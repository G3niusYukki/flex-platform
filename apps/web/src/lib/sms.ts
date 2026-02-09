import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';

// 验证码存储（生产环境应使用 Redis）
const verificationCodes = new Map<string, { code: string; expiresAt: number; attempts: number }>();

// 发送频率限制
const sendLimits = new Map<string, number>();

/**
 * 创建阿里云短信客户端
 */
function createClient(): Dysmsapi20170525 {
    const config = new $OpenApi.Config({
        accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
        accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    });
    config.endpoint = 'dysmsapi.aliyuncs.com';
    return new Dysmsapi20170525(config);
}

/**
 * 生成6位数字验证码
 */
function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 发送短信验证码
 */
export async function sendVerificationCode(phone: string): Promise<{
    success: boolean;
    message: string;
    code?: string; // 开发环境返回验证码
}> {
    // 检查发送频率（60秒内只能发送一次）
    const lastSendTime = sendLimits.get(phone);
    const now = Date.now();

    if (lastSendTime && now - lastSendTime < 60000) {
        const remainingSeconds = Math.ceil((60000 - (now - lastSendTime)) / 1000);
        return {
            success: false,
            message: `请${remainingSeconds}秒后再试`,
        };
    }

    // 生成验证码
    const code = generateCode();

    // 开发环境：直接返回验证码，不实际发送
    if (process.env.NODE_ENV === 'development' || !process.env.ALIYUN_ACCESS_KEY_ID) {
        verificationCodes.set(phone, {
            code,
            expiresAt: now + 5 * 60 * 1000, // 5分钟有效
            attempts: 0,
        });
        sendLimits.set(phone, now);

        console.log(`[DEV] 验证码发送到 ${phone}: ${code}`);
        return {
            success: true,
            message: '验证码已发送（开发模式）',
            code, // 开发环境返回验证码
        };
    }

    // 生产环境：调用阿里云 SMS API
    try {
        const client = createClient();
        const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
            phoneNumbers: phone,
            signName: process.env.ALIYUN_SMS_SIGN_NAME || 'AI雇佣平台',
            templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE || 'SMS_123456789',
            templateParam: JSON.stringify({ code }),
        });

        const runtime = new $Util.RuntimeOptions({});
        const response = await client.sendSmsWithOptions(sendSmsRequest, runtime);

        if (response.body?.code === 'OK') {
            // 存储验证码
            verificationCodes.set(phone, {
                code,
                expiresAt: now + 5 * 60 * 1000,
                attempts: 0,
            });
            sendLimits.set(phone, now);

            return {
                success: true,
                message: '验证码已发送',
            };
        } else {
            console.error('SMS发送失败:', response.body);
            return {
                success: false,
                message: '短信发送失败，请稍后重试',
            };
        }
    } catch (error) {
        console.error('SMS发送异常:', error);
        return {
            success: false,
            message: '短信服务暂时不可用',
        };
    }
}

/**
 * 验证短信验证码
 */
export function verifyCode(phone: string, code: string): {
    success: boolean;
    message: string;
} {
    const record = verificationCodes.get(phone);

    if (!record) {
        return {
            success: false,
            message: '请先获取验证码',
        };
    }

    // 检查过期
    if (Date.now() > record.expiresAt) {
        verificationCodes.delete(phone);
        return {
            success: false,
            message: '验证码已过期，请重新获取',
        };
    }

    // 检查尝试次数（最多5次）
    if (record.attempts >= 5) {
        verificationCodes.delete(phone);
        return {
            success: false,
            message: '验证码错误次数过多，请重新获取',
        };
    }

    // 验证码比对
    if (record.code !== code) {
        record.attempts++;
        return {
            success: false,
            message: `验证码错误，还剩${5 - record.attempts}次机会`,
        };
    }

    // 验证成功，删除验证码
    verificationCodes.delete(phone);
    return {
        success: true,
        message: '验证成功',
    };
}

/**
 * 清理过期验证码（定期调用）
 */
export function cleanupExpiredCodes(): void {
    const now = Date.now();
    const entries = Array.from(verificationCodes.entries());
    for (const [phone, record] of entries) {
        if (now > record.expiresAt) {
            verificationCodes.delete(phone);
        }
    }
}
