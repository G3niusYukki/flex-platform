import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCandidatesForOrder, autoDispatch } from '@/lib/ai-matching';
import { prisma } from '@/lib/prisma';

/**
 * GET - 获取订单的候选工人列表
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: '请先登录' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: '缺少订单ID' },
                { status: 400 }
            );
        }

        // 验证订单权限
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order || order.employerId !== session.user.id) {
            return NextResponse.json(
                { success: false, message: '无权访问此订单' },
                { status: 403 }
            );
        }

        const candidates = await getCandidatesForOrder(orderId);

        return NextResponse.json({
            success: true,
            data: {
                orderId,
                candidates,
                totalCount: candidates.length,
            },
        });
    } catch (error) {
        console.error('获取候选工人失败:', error);
        return NextResponse.json(
            { success: false, message: '服务器错误' },
            { status: 500 }
        );
    }
}

/**
 * POST - 自动派单
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
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: '缺少订单ID' },
                { status: 400 }
            );
        }

        // 验证订单
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: '订单不存在' },
                { status: 404 }
            );
        }

        if (order.employerId !== session.user.id) {
            return NextResponse.json(
                { success: false, message: '无权操作此订单' },
                { status: 403 }
            );
        }

        if (order.dispatchStatus !== 'UNASSIGNED') {
            return NextResponse.json(
                { success: false, message: '订单已派单' },
                { status: 400 }
            );
        }

        // 执行自动派单
        const result = await autoDispatch(
            orderId,
            { lat: order.latitude, lng: order.longitude },
            order.serviceCategory,
            order.skills
        );

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message,
                data: { workerId: result.workerId },
            });
        } else {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('自动派单失败:', error);
        return NextResponse.json(
            { success: false, message: '服务器错误' },
            { status: 500 }
        );
    }
}
