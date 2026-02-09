/**
 * 基础风控系统
 * 检测异常登录、频繁注册、订单异常等
 */

import { prisma } from '@/lib/prisma';

// 风控记录存储（生产环境应使用 Redis）
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const registrationIPs = new Map<string, { count: number; firstTime: number }>();

export interface RiskCheckResult {
    passed: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    reasons: string[];
    action?: 'allow' | 'captcha' | 'block';
}

/**
 * 登录风险检测
 */
export function checkLoginRisk(
    phone: string,
    ip: string,
    userAgent: string
): RiskCheckResult {
    const now = Date.now();
    const reasons: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // 检查登录尝试频率
    const attempts = loginAttempts.get(`${phone}-${ip}`);
    if (attempts) {
        const timeDiff = now - attempts.lastAttempt;

        // 1分钟内超过5次尝试
        if (timeDiff < 60000 && attempts.count >= 5) {
            reasons.push('登录尝试过于频繁');
            riskLevel = 'high';
        }
        // 1分钟内超过3次尝试
        else if (timeDiff < 60000 && attempts.count >= 3) {
            reasons.push('多次登录尝试');
            riskLevel = 'medium';
        }
    }

    // 可疑 User-Agent 检测
    const suspiciousUA = [
        'curl', 'wget', 'python', 'scrapy', 'bot', 'spider',
    ];
    if (suspiciousUA.some(ua => userAgent.toLowerCase().includes(ua))) {
        reasons.push('可疑的客户端');
        riskLevel = riskLevel === 'high' ? 'high' : 'medium';
    }

    // 更新尝试记录
    const key = `${phone}-${ip}`;
    const current = loginAttempts.get(key);
    if (current && (now - current.lastAttempt) < 300000) { // 5分钟窗口
        loginAttempts.set(key, { count: current.count + 1, lastAttempt: now });
    } else {
        loginAttempts.set(key, { count: 1, lastAttempt: now });
    }

    // 确定行动
    let action: 'allow' | 'captcha' | 'block' = 'allow';
    if (riskLevel === 'high') action = 'block';
    else if (riskLevel === 'medium') action = 'captcha';

    return {
        passed: riskLevel !== 'high',
        riskLevel,
        reasons,
        action,
    };
}

/**
 * 注册风险检测
 */
export function checkRegistrationRisk(ip: string): RiskCheckResult {
    const now = Date.now();
    const reasons: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // 同一 IP 在1小时内的注册次数
    const record = registrationIPs.get(ip);
    if (record) {
        const timeDiff = now - record.firstTime;

        if (timeDiff < 3600000) { // 1小时内
            if (record.count >= 5) {
                reasons.push('同一IP注册过多账号');
                riskLevel = 'high';
            } else if (record.count >= 3) {
                reasons.push('同一IP多次注册');
                riskLevel = 'medium';
            }
        }
    }

    // 更新记录
    if (record && (now - record.firstTime) < 3600000) {
        registrationIPs.set(ip, { count: record.count + 1, firstTime: record.firstTime });
    } else {
        registrationIPs.set(ip, { count: 1, firstTime: now });
    }

    let action: 'allow' | 'captcha' | 'block' = 'allow';
    if (riskLevel === 'high') action = 'block';
    else if (riskLevel === 'medium') action = 'captcha';

    return {
        passed: riskLevel !== 'high',
        riskLevel,
        reasons,
        action,
    };
}

/**
 * 订单异常检测
 */
export async function checkOrderRisk(
    employerId: string,
    amount: number
): Promise<RiskCheckResult> {
    const reasons: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // 检查用户最近订单情况
    const recentOrders = await prisma.order.count({
        where: {
            employerId,
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
    });

    // 24小时内超过10个订单
    if (recentOrders >= 10) {
        reasons.push('短时间内创建大量订单');
        riskLevel = 'medium';
    }

    // 检查取消率
    const stats = await prisma.order.groupBy({
        by: ['status'],
        where: {
            employerId,
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        _count: true,
    });

    const total = stats.reduce((sum, s) => sum + s._count, 0);
    const canceled = stats.find(s => s.status === 'CANCELED')?._count || 0;

    if (total > 5 && canceled / total > 0.5) {
        reasons.push('订单取消率过高');
        riskLevel = riskLevel === 'medium' ? 'high' : 'medium';
    }

    // 大额订单警告
    if (amount > 10000) {
        reasons.push('大额订单');
        riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
    }

    let action: 'allow' | 'captcha' | 'block' = 'allow';
    if (riskLevel === 'high') action = 'captcha';
    else if (riskLevel === 'medium') action = 'captcha';

    return {
        passed: riskLevel !== 'high',
        riskLevel,
        reasons,
        action,
    };
}

/**
 * 记录风控事件（用于分析）
 */
export async function logRiskEvent(
    userId: string | null,
    eventType: string,
    riskLevel: string,
    details: Record<string, unknown>
): Promise<void> {
    console.log(`[RISK] ${eventType}`, {
        userId,
        riskLevel,
        details,
        timestamp: new Date().toISOString(),
    });

    // TODO: 可以存储到数据库或发送到监控系统
}

/**
 * 清理过期的风控记录
 */
export function cleanupRiskRecords(): void {
    const now = Date.now();

    // 清理超过5分钟的登录尝试记录
    const loginEntries = Array.from(loginAttempts.entries());
    for (const [key, value] of loginEntries) {
        if (now - value.lastAttempt > 300000) {
            loginAttempts.delete(key);
        }
    }

    // 清理超过1小时的注册记录
    const regEntries = Array.from(registrationIPs.entries());
    for (const [key, value] of regEntries) {
        if (now - value.firstTime > 3600000) {
            registrationIPs.delete(key);
        }
    }
}
