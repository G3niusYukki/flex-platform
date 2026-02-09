import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createEvaluation, getUserEvaluationStats, EVALUATION_DIMENSIONS, EVALUATION_TAGS } from '@/lib/evaluation';
import { prisma } from '@/lib/prisma';

/**
 * GET - 获取评价配置和用户评价统计
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const action = searchParams.get('action');

        // 获取评价配置
        if (action === 'config') {
            return NextResponse.json({
                success: true,
                data: {
                    dimensions: EVALUATION_DIMENSIONS,
                    tags: EVALUATION_TAGS,
                },
            });
        }

        // 获取用户评价统计
        if (userId) {
            const stats = await getUserEvaluationStats(userId);
            return NextResponse.json({
                success: true,
                data: stats,
            });
        }

        return NextResponse.json(
            { success: false, message: '缺少参数' },
            { status: 400 }
        );
    } catch (error) {
        console.error('获取评价信息失败:', error);
        return NextResponse.json(
            { success: false, message: '服务器错误' },
            { status: 500 }
        );
    }
}

/**
 * POST - 提交评价
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: '请先登录' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { orderId, dimensions, tags, comment, isAnonymous } = body;

        if (!orderId || !dimensions) {
            return NextResponse.json(
                { success: false, message: '缺少必要参数' },
                { status: 400 }
            );
        }

        // 验证订单
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { employer: true, worker: true },
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: '订单不存在' },
                { status: 404 }
            );
        }

        if (order.status !== 'COMPLETED') {
            return NextResponse.json(
                { success: false, message: '订单未完成，无法评价' },
                { status: 400 }
            );
        }

        // 确定评价类型和被评价者
        let revieweeId: string;
        let evaluationType: 'EMPLOYER_TO_WORKER' | 'WORKER_TO_EMPLOYER';

        if (session.user.id === order.employerId) {
            // 雇主评价工人
            if (!order.workerId) {
                return NextResponse.json(
                    { success: false, message: '订单没有工人' },
                    { status: 400 }
                );
            }
            revieweeId = order.workerId;
            evaluationType = 'EMPLOYER_TO_WORKER';
        } else if (session.user.id === order.workerId) {
            // 工人评价雇主
            revieweeId = order.employerId;
            evaluationType = 'WORKER_TO_EMPLOYER';
        } else {
            return NextResponse.json(
                { success: false, message: '无权评价此订单' },
                { status: 403 }
            );
        }

        // 检查是否已评价
        const existingEvaluation = await prisma.evaluation.findFirst({
            where: {
                orderId,
                reviewerId: session.user.id,
            },
        });

        if (existingEvaluation) {
            return NextResponse.json(
                { success: false, message: '已经评价过此订单' },
                { status: 400 }
            );
        }

        // 创建评价
        const evaluation = await createEvaluation({
            orderId,
            reviewerId: session.user.id,
            revieweeId,
            type: evaluationType,
            dimensions,
            tags: tags || [],
            comment,
            isAnonymous,
        });

        return NextResponse.json({
            success: true,
            message: '评价提交成功',
            data: evaluation,
        });
    } catch (error) {
        console.error('提交评价失败:', error);
        return NextResponse.json(
            { success: false, message: '服务器错误' },
            { status: 500 }
        );
    }
}
