import Dysmsapi20170525, * as $Dysmsapi20170525 from "@alicloud/dysmsapi20170525";
import * as $OpenApi from "@alicloud/openapi-client";
import * as $Util from "@alicloud/tea-util";
import { getRedis, REDIS_KEYS, SMS_CODE_TTL, SMS_LIMIT_TTL } from "./redis";

interface VerificationCodeRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

let useRedis = true;

function getVerificationCodes(): Map<string, VerificationCodeRecord> | null {
  if (!useRedis) return null;
  try {
    const redis = getRedis();
    if (!redis) return null;
    return null;
  } catch {
    return null;
  }
}

const memoryVerificationCodes = new Map<string, VerificationCodeRecord>();
const memorySendLimits = new Map<string, number>();

async function setVerificationCode(
  phone: string,
  record: VerificationCodeRecord,
): Promise<void> {
  if (useRedis) {
    try {
      const redis = getRedis();
      await redis.setex(
        REDIS_KEYS.SMS_CODE(phone),
        SMS_CODE_TTL,
        JSON.stringify(record),
      );
      return;
    } catch {
      useRedis = false;
    }
  }
  memoryVerificationCodes.set(phone, record);
}

async function getVerificationCode(
  phone: string,
): Promise<VerificationCodeRecord | null> {
  if (useRedis) {
    try {
      const redis = getRedis();
      const data = await redis.get(REDIS_KEYS.SMS_CODE(phone));
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch {
      useRedis = false;
    }
  }
  return memoryVerificationCodes.get(phone) || null;
}

async function deleteVerificationCode(phone: string): Promise<void> {
  if (useRedis) {
    try {
      const redis = getRedis();
      await redis.del(REDIS_KEYS.SMS_CODE(phone));
      return;
    } catch {
      useRedis = false;
    }
  }
  memoryVerificationCodes.delete(phone);
}

async function getSendLimit(phone: string): Promise<number | null> {
  if (useRedis) {
    try {
      const redis = getRedis();
      const data = await redis.get(REDIS_KEYS.SMS_LIMIT(phone));
      return data ? parseInt(data, 10) : null;
    } catch {
      useRedis = false;
    }
  }
  return memorySendLimits.get(phone) || null;
}

async function setSendLimit(phone: string): Promise<void> {
  if (useRedis) {
    try {
      const redis = getRedis();
      await redis.setex(
        REDIS_KEYS.SMS_LIMIT(phone),
        SMS_LIMIT_TTL,
        Date.now().toString(),
      );
      return;
    } catch {
      useRedis = false;
    }
  }
  memorySendLimits.set(phone, Date.now());
}

function createClient(): Dysmsapi20170525 {
  const config = new $OpenApi.Config({
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
  });
  config.endpoint = "dysmsapi.aliyuncs.com";
  return new Dysmsapi20170525(config);
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationCode(phone: string): Promise<{
  success: boolean;
  message: string;
  code?: string;
}> {
  const lastSendTime = await getSendLimit(phone);
  const now = Date.now();

  if (lastSendTime && now - lastSendTime < 60000) {
    const remainingSeconds = Math.ceil((60000 - (now - lastSendTime)) / 1000);
    return {
      success: false,
      message: `请${remainingSeconds}秒后再试`,
    };
  }

  const code = generateCode();

  if (
    process.env.NODE_ENV === "development" ||
    !process.env.ALIYUN_ACCESS_KEY_ID
  ) {
    await setVerificationCode(phone, {
      code,
      expiresAt: now + 5 * 60 * 1000,
      attempts: 0,
    });
    await setSendLimit(phone);

    console.log(`[DEV] 验证码发送到 ${phone}: ${code}`);
    return {
      success: true,
      message: "验证码已发送（开发模式）",
      code,
    };
  }

  try {
    const client = createClient();
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      phoneNumbers: phone,
      signName: process.env.ALIYUN_SMS_SIGN_NAME || "AI雇佣平台",
      templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE || "SMS_123456789",
      templateParam: JSON.stringify({ code }),
    });

    const runtime = new $Util.RuntimeOptions({});
    const response = await client.sendSmsWithOptions(sendSmsRequest, runtime);

    if (response.body?.code === "OK") {
      await setVerificationCode(phone, {
        code,
        expiresAt: now + 5 * 60 * 1000,
        attempts: 0,
      });
      await setSendLimit(phone);

      return {
        success: true,
        message: "验证码已发送",
      };
    } else {
      console.error("SMS发送失败:", response.body);
      return {
        success: false,
        message: "短信发送失败，请稍后重试",
      };
    }
  } catch (error) {
    console.error("SMS发送异常:", error);
    return {
      success: false,
      message: "短信服务暂时不可用",
    };
  }
}

export async function verifyCode(
  phone: string,
  code: string,
): Promise<{
  success: boolean;
  message: string;
}> {
  const record = await getVerificationCode(phone);

  if (!record) {
    return {
      success: false,
      message: "请先获取验证码",
    };
  }

  if (Date.now() > record.expiresAt) {
    await deleteVerificationCode(phone);
    return {
      success: false,
      message: "验证码已过期，请重新获取",
    };
  }

  if (record.attempts >= 5) {
    await deleteVerificationCode(phone);
    return {
      success: false,
      message: "验证码错误次数过多，请重新获取",
    };
  }

  if (record.code !== code) {
    record.attempts++;
    await setVerificationCode(phone, record);
    return {
      success: false,
      message: `验证码错误，还剩${5 - record.attempts}次机会`,
    };
  }

  await deleteVerificationCode(phone);
  return {
    success: true,
    message: "验证成功",
  };
}

export async function cleanupExpiredCodes(): Promise<void> {
  console.log("[SMS] Cleanup expired codes (Redis handles TTL automatically)");
}
