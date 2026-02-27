/**
 * AI 智能匹配算法
 * 基于距离、评分、响应率、技能匹配、历史偏好等多维度加权评分系统
 */

import { prisma } from "@/lib/prisma";
import { calculateDistance, GeoLocation } from "@/lib/map";

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
  skillMatchScore: number;
  historyScore: number;
  score: number;
  matchReasons: string[];
}

export interface MatchConfig {
  maxDistance: number;
  minRating: number;
  weightDistance: number;
  weightRating: number;
  weightResponse: number;
  weightCompletion: number;
  weightSkill: number;
  weightHistory: number;
  limit: number;
}

const DEFAULT_CONFIG: MatchConfig = {
  maxDistance: 10000,
  minRating: 3.0,
  weightDistance: 0.25,
  weightRating: 0.2,
  weightResponse: 0.15,
  weightCompletion: 0.15,
  weightSkill: 0.15,
  weightHistory: 0.1,
  limit: 10,
};

export async function matchWorkers(
  orderLocation: GeoLocation,
  serviceCategory: string,
  skills: string[] = [],
  employerId?: string,
  config: Partial<MatchConfig> = {},
): Promise<MatchCandidate[]> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const workers = await prisma.workerProfile.findMany({
    where: {
      isOnline: true,
      onlineStatus: { in: ["ONLINE", "BUSY"] },
      serviceCategory: { hasSome: [serviceCategory] },
      averageRating: { gte: cfg.minRating },
      user: { status: "ACTIVE" },
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

  let historicalOrders: { workerId: string | null }[] = [];
  if (employerId) {
    historicalOrders = await prisma.order.findMany({
      where: {
        employerId,
        workerId: { not: null },
      },
      select: { workerId: true },
    });
  }

  const workerOrderCounts = historicalOrders.reduce(
    (acc, order) => {
      if (order.workerId) {
        acc[order.workerId] = (acc[order.workerId] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const candidates: MatchCandidate[] = [];

  for (const worker of workers) {
    if (!worker.lastLocationLat || !worker.lastLocationLng) continue;

    const workerLocation: GeoLocation = {
      lat: worker.lastLocationLat,
      lng: worker.lastLocationLng,
    };

    const distance = calculateDistance(orderLocation, workerLocation);
    if (distance > cfg.maxDistance) continue;

    const distanceScore = Math.max(0, 100 - (distance / cfg.maxDistance) * 100);
    const ratingScore = (worker.averageRating / 5) * 100;
    const responseScore = worker.acceptanceRate;
    const completionScore = worker.completionRate;

    let skillMatchScore = 0;
    const matchedSkills: string[] = [];
    if (skills.length > 0) {
      const workerSkills = worker.skills || [];
      const matched = skills.filter((s) => workerSkills.includes(s));
      skillMatchScore = (matched.length / skills.length) * 100;
      matchedSkills.push(...matched);
    }

    const historyCount = workerOrderCounts[worker.user.id] || 0;
    const historyScore = Math.min(100, historyCount * 20);

    const score =
      distanceScore * cfg.weightDistance +
      ratingScore * cfg.weightRating +
      responseScore * cfg.weightResponse +
      completionScore * cfg.weightCompletion +
      skillMatchScore * cfg.weightSkill +
      historyScore * cfg.weightHistory;

    const matchReasons: string[] = [];
    if (distance < 1000) matchReasons.push("距离很近");
    else if (distance < 3000) matchReasons.push("距离较近");
    if (worker.averageRating >= 4.8) matchReasons.push("评分优秀");
    else if (worker.averageRating >= 4.5) matchReasons.push("评分良好");
    if (worker.completedOrders > 100) matchReasons.push("经验丰富");
    if (worker.acceptanceRate >= 95) matchReasons.push("响应迅速");
    if (matchedSkills.length > 0)
      matchReasons.push(`技能匹配: ${matchedSkills.join(", ")}`);
    if (historyScore > 0) matchReasons.push("历史合作良好");

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
      skillMatchScore,
      historyScore,
      score: Math.round(score * 100) / 100,
      matchReasons,
    });
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, cfg.limit);
}

export async function autoDispatch(
  orderId: string,
  orderLocation: GeoLocation,
  serviceCategory: string,
  skills: string[] = [],
  employerId?: string,
): Promise<{ success: boolean; workerId?: string; message: string }> {
  try {
    const candidates = await matchWorkers(
      orderLocation,
      serviceCategory,
      skills,
      employerId,
      {
        limit: 5,
      },
    );

    if (candidates.length === 0) {
      return { success: false, message: "暂无合适的工人" };
    }

    const bestMatch = candidates[0];

    await prisma.dispatchRecord.create({
      data: {
        orderId,
        workerId: bestMatch.workerId,
        dispatchType: "SYSTEM_AUTO",
        priorityScore: bestMatch.score,
        distance: bestMatch.distance,
        acceptDeadline: new Date(Date.now() + 5 * 60 * 1000),
        status: "PENDING",
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { dispatchStatus: "PENDING_ACCEPT" },
    });

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
    console.error("自动派单失败:", error);
    return { success: false, message: "派单失败" };
  }
}

export async function getCandidatesForOrder(
  orderId: string,
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
    order.employerId,
    { limit: 20 },
  );
}

export function getMatchExplanation(candidate: MatchCandidate): string {
  const factors: string[] = [];

  if (candidate.distance < 1000) {
    factors.push(`距离仅${candidate.distance}米`);
  }
  if (candidate.rating >= 4.5) {
    factors.push(`评分${candidate.rating.toFixed(1)}分`);
  }
  if (candidate.skillMatchScore >= 80) {
    factors.push("技能匹配度高");
  }
  if (candidate.historyScore > 0) {
    factors.push("历史合作愉快");
  }

  return factors.join("，") || "综合评分高";
}
