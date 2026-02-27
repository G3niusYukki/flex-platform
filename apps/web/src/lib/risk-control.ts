import {
  getRedis,
  REDIS_KEYS,
  LOGIN_ATTEMPT_TTL,
  REGISTRATION_IP_TTL,
} from "./redis";

export interface RiskCheckResult {
  passed: boolean;
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  action?: "allow" | "captcha" | "block";
}

interface LoginAttemptRecord {
  count: number;
  lastAttempt: number;
}

interface RegistrationIPRecord {
  count: number;
  firstTime: number;
}

let useRedis = true;

const memoryLoginAttempts = new Map<string, LoginAttemptRecord>();
const memoryRegistrationIPs = new Map<string, RegistrationIPRecord>();

async function getLoginAttempt(
  phone: string,
  ip: string,
): Promise<LoginAttemptRecord | null> {
  if (useRedis) {
    try {
      const redis = getRedis();
      const data = await redis.get(REDIS_KEYS.LOGIN_ATTEMPT(phone, ip));
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch {
      useRedis = false;
    }
  }
  return memoryLoginAttempts.get(`${phone}-${ip}`) || null;
}

async function setLoginAttempt(
  phone: string,
  ip: string,
  record: LoginAttemptRecord,
): Promise<void> {
  if (useRedis) {
    try {
      const redis = getRedis();
      await redis.setex(
        REDIS_KEYS.LOGIN_ATTEMPT(phone, ip),
        LOGIN_ATTEMPT_TTL,
        JSON.stringify(record),
      );
      return;
    } catch {
      useRedis = false;
    }
  }
  memoryLoginAttempts.set(`${phone}-${ip}`, record);
}

async function getRegistrationIP(
  ip: string,
): Promise<RegistrationIPRecord | null> {
  if (useRedis) {
    try {
      const redis = getRedis();
      const data = await redis.get(REDIS_KEYS.REGISTRATION_IP(ip));
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch {
      useRedis = false;
    }
  }
  return memoryRegistrationIPs.get(ip) || null;
}

async function setRegistrationIP(
  ip: string,
  record: RegistrationIPRecord,
): Promise<void> {
  if (useRedis) {
    try {
      const redis = getRedis();
      await redis.setex(
        REDIS_KEYS.REGISTRATION_IP(ip),
        REGISTRATION_IP_TTL,
        JSON.stringify(record),
      );
      return;
    } catch {
      useRedis = false;
    }
  }
  memoryRegistrationIPs.set(ip, record);
}

export async function checkLoginRisk(
  phone: string,
  ip: string,
  userAgent: string,
): Promise<RiskCheckResult> {
  const now = Date.now();
  const reasons: string[] = [];
  let riskLevel: "low" | "medium" | "high" = "low";

  const attempts = await getLoginAttempt(phone, ip);
  if (attempts) {
    const timeDiff = now - attempts.lastAttempt;

    if (timeDiff < 60000 && attempts.count >= 5) {
      reasons.push("登录尝试过于频繁");
      riskLevel = "high";
    } else if (timeDiff < 60000 && attempts.count >= 3) {
      reasons.push("多次登录尝试");
      riskLevel = "medium";
    }
  }

  const suspiciousUA = ["curl", "wget", "python", "scrapy", "bot", "spider"];
  if (suspiciousUA.some((ua) => userAgent.toLowerCase().includes(ua))) {
    reasons.push("可疑的客户端");
    riskLevel = riskLevel === "high" ? "high" : "medium";
  }

  const key = `${phone}-${ip}`;
  const current = await getLoginAttempt(phone, ip);
  if (current && now - current.lastAttempt < 300000) {
    await setLoginAttempt(phone, ip, {
      count: current.count + 1,
      lastAttempt: now,
    });
  } else {
    await setLoginAttempt(phone, ip, { count: 1, lastAttempt: now });
  }

  let action: "allow" | "captcha" | "block" = "allow";
  if (riskLevel === "high") action = "block";
  else if (riskLevel === "medium") action = "captcha";

  return {
    passed: riskLevel !== "high",
    riskLevel,
    reasons,
    action,
  };
}

export async function checkRegistrationRisk(
  ip: string,
): Promise<RiskCheckResult> {
  const now = Date.now();
  const reasons: string[] = [];
  let riskLevel: "low" | "medium" | "high" = "low";

  const record = await getRegistrationIP(ip);
  if (record) {
    const timeDiff = now - record.firstTime;

    if (timeDiff < 3600000) {
      if (record.count >= 5) {
        reasons.push("同一IP注册过多账号");
        riskLevel = "high";
      } else if (record.count >= 3) {
        reasons.push("同一IP多次注册");
        riskLevel = "medium";
      }
    }
  }

  const current = await getRegistrationIP(ip);
  if (current && now - current.firstTime < 3600000) {
    await setRegistrationIP(ip, {
      count: current.count + 1,
      firstTime: current.firstTime,
    });
  } else {
    await setRegistrationIP(ip, { count: 1, firstTime: now });
  }

  let action: "allow" | "captcha" | "block" = "allow";
  if (riskLevel === "high") action = "block";
  else if (riskLevel === "medium") action = "captcha";

  return {
    passed: riskLevel !== "high",
    riskLevel,
    reasons,
    action,
  };
}

export async function checkOrderRisk(
  employerId: string,
  amount: number,
): Promise<RiskCheckResult> {
  const reasons: string[] = [];
  let riskLevel: "low" | "medium" | "high" = "low";

  const recentOrders = await (
    await import("@/lib/prisma")
  ).prisma.order.count({
    where: {
      employerId,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  if (recentOrders >= 10) {
    reasons.push("短时间内创建大量订单");
    riskLevel = "medium";
  }

  const stats = await (
    await import("@/lib/prisma")
  ).prisma.order.groupBy({
    by: ["status"],
    where: {
      employerId,
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
    _count: true,
  });

  const total = stats.reduce((sum, s) => sum + s._count, 0);
  const canceled = stats.find((s) => s.status === "CANCELED")?._count || 0;

  if (total > 5 && canceled / total > 0.5) {
    reasons.push("订单取消率过高");
    riskLevel = riskLevel === "medium" ? "high" : "medium";
  }

  if (amount > 10000) {
    reasons.push("大额订单");
    riskLevel = riskLevel === "low" ? "medium" : riskLevel;
  }

  let action: "allow" | "captcha" | "block" = "allow";
  if (riskLevel === "high") action = "captcha";
  else if (riskLevel === "medium") action = "captcha";

  return {
    passed: riskLevel !== "high",
    riskLevel,
    reasons,
    action,
  };
}

export async function logRiskEvent(
  userId: string | null,
  eventType: string,
  riskLevel: string,
  details: Record<string, unknown>,
): Promise<void> {
  console.log(`[RISK] ${eventType}`, {
    userId,
    riskLevel,
    details,
    timestamp: new Date().toISOString(),
  });
}

export async function cleanupRiskRecords(): Promise<void> {
  console.log("[RISK] Cleanup (Redis handles TTL automatically)");
}
