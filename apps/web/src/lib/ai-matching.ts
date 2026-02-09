/**
 * AI 智能匹配算法
 * 基于距离、评分、响应率的加权评分系统
 */

import { prisma } from '@/lib/prisma';
import { calculateDistance, GeoLocation } from '@/lib/map';

export interface MatchCandidate {
    workerId: string;
    workerName: string;
    phone: string;
    avatar: string | null;
    distance: number;
    rating: number;
    responseRate: number;
    completionRate: number;
    totalOrders: number;
    score: number;
    matchReasons: string[];
}

export interface MatchConfig {
    maxDistance: number;      // 最大距离（米）
    minRating: number;        // 最低评分
    weightDistance: number;   // 距离权重
    weightRating: number;     // 评分权重
    weightResponse: number;   // 响应率权重
    weightCompletion: number; // 完成率权重
    limit: number;            // 返回数量
}

const DEFAULT_CONFIG: MatchConfig = {
    maxDistance: 10000,     // 10公里
    minRating: 3.0,
    weightDistance: 0.35,
    weightRating: 0.30,
    weightResponse: 0.20,
    weightCompletion: 0.15,
    limit: 10,
};

/**
 * AI 智能匹配工人
 */
export async function matchWorkers(
    orderLocation: GeoLocation,
    serviceCategory: string,
    skills: string[] = [],
    config: Partial<MatchConfig> = {}
): Promise<MatchCandidate[]> {
    const cfg = { ...DEFAULT_CONFIG, ...config };

    // 查询在线且符合条件的工人
    const workers = await prisma.workerProfile.findMany({
        where: {
            isOnline: true,
            onlineStatus: { in: ['ONLINE', 'BUSY'] },
            serviceCategory: { hasSome: [serviceCategory] },
            averageRating: { gte: cfg.minRating },
            user: { status: 'ACTIVE' },
        },
        include: {
            user: {
                select: {
                    id: true,
                    phone: true,
                    realName: true,
                    avatar: true,
                },
            },
        },
    });

    // 计算每个工人的匹配分数
    const candidates: MatchCandidate[] = [];

    for (const worker of workers) {
        // 跳过没有位置信息的工人
        if (!worker.lastLocationLat || !worker.lastLocationLng) continue;

        const workerLocation: GeoLocation = {
            lat: worker.lastLocationLat,
            lng: worker.lastLocationLng,
        };

        // 计算距离
        const distance = calculateDistance(orderLocation, workerLocation);

        // 跳过超出范围的工人
        if (distance > cfg.maxDistance) continue;

        // 计算各项得分 (0-100)
        const distanceScore = Math.max(0, 100 - (distance / cfg.maxDistance) * 100);
        const ratingScore = (worker.averageRating / 5) * 100;
        const responseScore = worker.acceptanceRate;
        const completionScore = worker.completionRate;

        // 加权总分
        const score =
            distanceScore * cfg.weightDistance +
            ratingScore * cfg.weightRating +
            responseScore * cfg.weightResponse +
            completionScore * cfg.weightCompletion;

        // 生成匹配理由
        const matchReasons: string[] = [];
        if (distance < 1000) matchReasons.push('距离很近');
        else if (distance < 3000) matchReasons.push('距离较近');
        if (worker.averageRating >= 4.8) matchReasons.push('评分优秀');
        else if (worker.averageRating >= 4.5) matchReasons.push('评分良好');
        if (worker.completedOrders > 100) matchReasons.push('经验丰富');
        if (worker.acceptanceRate >= 95) matchReasons.push('响应迅速');
        if (skills.length > 0) {
            const matchedSkills = skills.filter(s => worker.skills.includes(s));
            if (matchedSkills.length > 0) matchReasons.push(`技能匹配: ${matchedSkills.join(', ')}`);
        }

        candidates.push({
            workerId: worker.user.id,
            workerName: worker.user.realName || worker.user.phone,
            phone: worker.user.phone,
            avatar: worker.user.avatar,
            distance: Math.round(distance),
            rating: worker.averageRating,
            responseRate: worker.acceptanceRate,
            completionRate: worker.completionRate,
            totalOrders: worker.completedOrders,
            score: Math.round(score * 100) / 100,
            matchReasons,
        });
    }

    // 按分数排序并返回
    return candidates
        .sort((a, b) => b.score - a.score)
        .slice(0, cfg.limit);
}

/**
 * 智能派单 - 自动选择最佳工人
 */
export async function autoDispatch(
    orderId: string,
    orderLocation: GeoLocation,
    serviceCategory: string,
    skills: string[] = []
): Promise<{ success: boolean; workerId?: string; message: string }> {
    try {
        // 获取匹配的工人
        const candidates = await matchWorkers(orderLocation, serviceCategory, skills, {
            limit: 5,
        });

        if (candidates.length === 0) {
            return { success: false, message: '暂无合适的工人' };
        }

        // 选择得分最高的工人
        const bestMatch = candidates[0];

        // 创建派单记录
        await prisma.dispatchRecord.create({
            data: {
                orderId,
                workerId: bestMatch.workerId,
                dispatchType: 'SYSTEM_AUTO',
                priorityScore: bestMatch.score,
                distance: bestMatch.distance,
                acceptDeadline: new Date(Date.now() + 5 * 60 * 1000), // 5分钟
                status: 'PENDING',
            },
        });

        // 更新订单派单状态
        await prisma.order.update({
            where: { id: orderId },
            data: { dispatchStatus: 'PENDING_ACCEPT' },
        });

        // 记录匹配日志
        console.log(`[AI 派单] 订单 ${orderId} -> 工人 ${bestMatch.workerName}`, {
            score: bestMatch.score,
            distance: bestMatch.distance,
            reasons: bestMatch.matchReasons,
        });

        return {
            success: true,
            workerId: bestMatch.workerId,
            message: `已派单给 ${bestMatch.workerName}`,
        };
    } catch (error) {
        console.error('自动派单失败:', error);
        return { success: false, message: '派单失败' };
    }
}

/**
 * 获取订单的候选工人列表（供管理员手动选择）
 */
export async function getCandidatesForOrder(
    orderId: string
): Promise<MatchCandidate[]> {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
    });

    if (!order) {
        return [];
    }

    return matchWorkers(
        { lat: order.latitude, lng: order.longitude },
        order.serviceCategory,
        order.skills,
        { limit: 20 }
    );
}
