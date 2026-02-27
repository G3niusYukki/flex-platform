/**
 * 缓存服务
 * 使用 Redis 实现应用层缓存
 */

import { getRedis, REDIS_KEYS } from "./redis";

const DEFAULT_TTL = 300;

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis();
    const data = await redis.get(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  } catch {
    return null;
  }
}

export async function setCache(
  key: string,
  data: unknown,
  ttl: number = DEFAULT_TTL,
): Promise<void> {
  try {
    const redis = getRedis();
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch {
    // 静默失败，不影响主流程
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    const redis = getRedis();
    await redis.del(key);
  } catch {
    // 静默失败
  }
}

export async function invalidatePattern(pattern: string): Promise<void> {
  try {
    const redis = getRedis();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // 静默失败
  }
}

export const CACHE_KEYS = {
  USER: (id: string) => `cache:user:${id}`,
  ORDER: (id: string) => `cache:order:${id}`,
  WORKER_LIST: (city?: string) => `cache:workers:${city || "all"}`,
  ORDER_LIST: (status: string) => `cache:orders:${status}`,
  STATS: (type: string) => `cache:stats:${type}`,
} as const;

export const CACHE_TTL = {
  USER: 600,
  ORDER: 300,
  WORKER_LIST: 120,
  ORDER_LIST: 60,
  STATS: 300,
} as const;
