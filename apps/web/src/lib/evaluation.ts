/**
 * 结构化评价系统
 * 多维度评分 + 标签化评价
 */

import { prisma } from '@/lib/prisma';

// 评价维度定义
export const EVALUATION_DIMENSIONS = {
    EMPLOYER_TO_WORKER: [
        { key: 'punctuality', label: '准时性', weight: 0.25 },
        { key: 'quality', label: '工作质量', weight: 0.35 },
        { key: 'attitude', label: '服务态度', weight: 0.25 },
        { key: 'communication', label: '沟通能力', weight: 0.15 },
    ],
    WORKER_TO_EMPLOYER: [
        { key: 'payment', label: '支付及时', weight: 0.30 },
        { key: 'description', label: '描述准确', weight: 0.25 },
        { key: 'attitude', label: '沟通态度', weight: 0.25 },
        { key: 'environment', label: '工作环境', weight: 0.20 },
    ],
};

// 常用评价标签
export const EVALUATION_TAGS = {
    POSITIVE: [
        '技术专业', '态度友好', '准时到达', '工作认真',
        '沟通顺畅', '超出预期', '值得推荐', '响应迅速',
    ],
    NEGATIVE: [
        '迟到早退', '态度敷衍', '技术欠佳', '沟通困难',
        '未按要求完成', '多次催促',
    ],
    EMPLOYER_POSITIVE: [
        '支付爽快', '描述清晰', '好沟通', '环境良好',
        '尊重工人', '有复购意向',
    ],
    EMPLOYER_NEGATIVE: [
        '拖延支付', '描述不符', '态度恶劣', '环境较差',
    ],
};

export interface EvaluationInput {
    orderId: string;
    reviewerId: string;
    revieweeId: string;
    type: 'EMPLOYER_TO_WORKER' | 'WORKER_TO_EMPLOYER';
    dimensions: {
        punctuality?: number;
        quality?: number;
        attitude?: number;
        communication?: number;
        payment?: number;
        description?: number;
        environment?: number;
    };
    tags: string[];
    comment?: string;
    isAnonymous?: boolean;
}

/**
 * 创建结构化评价
 */
export async function createEvaluation(input: EvaluationInput) {
    const { orderId, reviewerId, revieweeId, type, dimensions, tags, comment, isAnonymous } = input;

    // 计算加权总分
    const dimensionConfig = EVALUATION_DIMENSIONS[type];
    let totalScore = 0;
    let totalWeight = 0;

    for (const dim of dimensionConfig) {
        const score = dimensions[dim.key as keyof typeof dimensions];
        if (score !== undefined) {
            totalScore += score * dim.weight;
            totalWeight += dim.weight;
        }
    }

    const overallRating = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 10) / 10 : 5;

    // 创建评价
    const evaluation = await prisma.evaluation.create({
        data: {
            orderId,
            reviewerId,
            revieweeId,
            evaluationType: type,
            overallRating: Math.round(overallRating),
            punctuality: dimensions.punctuality,
            quality: dimensions.quality,
            attitude: dimensions.attitude,
            tags,
            comment,
            isAnonymous: isAnonymous || false,
        },
    });

    // 更新被评价者的平均评分
    await updateUserRating(revieweeId, type);

    // 更新订单状态为已评价
    await prisma.order.update({
        where: { id: orderId },
        data: { status: 'EVALUATED' },
    });

    return evaluation;
}

/**
 * 更新用户平均评分
 */
async function updateUserRating(userId: string, type: string) {
    // 获取用户收到的所有评价
    const evaluations = await prisma.evaluation.findMany({
        where: {
            revieweeId: userId,
            evaluationType: type === 'EMPLOYER_TO_WORKER' ? 'EMPLOYER_TO_WORKER' : 'WORKER_TO_EMPLOYER',
        },
        select: { overallRating: true },
    });

    if (evaluations.length === 0) return;

    const avgRating = evaluations.reduce((sum, e) => sum + e.overallRating, 0) / evaluations.length;

    // 更新对应的 Profile
    if (type === 'EMPLOYER_TO_WORKER') {
        await prisma.workerProfile.updateMany({
            where: { userId },
            data: { averageRating: Math.round(avgRating * 10) / 10 },
        });
    } else {
        await prisma.employerProfile.updateMany({
            where: { userId },
            data: { averageRating: Math.round(avgRating * 10) / 10 },
        });
    }
}

/**
 * 获取用户评价统计
 */
export async function getUserEvaluationStats(userId: string) {
    const evaluations = await prisma.evaluation.findMany({
        where: { revieweeId: userId },
        select: {
            overallRating: true,
            punctuality: true,
            quality: true,
            attitude: true,
            tags: true,
            createdAt: true,
        },
    });

    if (evaluations.length === 0) {
        return {
            totalCount: 0,
            averageRating: 5.0,
            ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            dimensionAverages: {},
            topTags: [],
        };
    }

    // 评分分布
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;
    const dimensionSums: Record<string, { sum: number; count: number }> = {};
    const tagCounts: Record<string, number> = {};

    for (const e of evaluations) {
        totalRating += e.overallRating;
        ratingDistribution[e.overallRating as keyof typeof ratingDistribution]++;

        // 维度统计
        for (const [key, value] of Object.entries({ punctuality: e.punctuality, quality: e.quality, attitude: e.attitude })) {
            if (value !== null) {
                if (!dimensionSums[key]) dimensionSums[key] = { sum: 0, count: 0 };
                dimensionSums[key].sum += value;
                dimensionSums[key].count++;
            }
        }

        // 标签统计
        for (const tag of e.tags) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
    }

    // 计算维度平均
    const dimensionAverages: Record<string, number> = {};
    for (const [key, value] of Object.entries(dimensionSums)) {
        dimensionAverages[key] = Math.round((value.sum / value.count) * 10) / 10;
    }

    // 获取 Top 标签
    const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

    return {
        totalCount: evaluations.length,
        averageRating: Math.round((totalRating / evaluations.length) * 10) / 10,
        ratingDistribution,
        dimensionAverages,
        topTags,
    };
}
