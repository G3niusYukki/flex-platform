import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 3) {
          console.error("[Redis] Connection failed after 3 retries");
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    redis.on("connect", () => {
      console.log("[Redis] Connected");
    });

    redis.on("error", (err) => {
      console.error("[Redis] Error:", err.message);
    });
  }
  return redis;
}

export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

export const REDIS_KEYS = {
  SMS_CODE: (phone: string) => `sms:code:${phone}`,
  SMS_LIMIT: (phone: string) => `sms:limit:${phone}`,
  DEVICE_TOKEN: (userId: string) => `device:token:${userId}`,
  LOGIN_ATTEMPT: (phone: string, ip: string) => `risk:login:${phone}:${ip}`,
  REGISTRATION_IP: (ip: string) => `risk:reg:${ip}`,
} as const;

export const SMS_CODE_TTL = 300;
export const SMS_LIMIT_TTL = 3600;
export const DEVICE_TOKEN_TTL = 86400 * 30;
export const LOGIN_ATTEMPT_TTL = 300;
export const REGISTRATION_IP_TTL = 3600;
