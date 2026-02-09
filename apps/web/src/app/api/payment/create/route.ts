import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPayment, PaymentProvider } from '@/lib/payment';
import { prisma } from '@/lib/prisma';

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
        const { orderId, provider } = body as { orderId: string; provider: PaymentProvider };

        if (!orderId || !provider) {
            return NextResponse.json(
                { success: false, message: '缺少必要参数' },
                { status: 400 }
            );
        }

        // 查询订单
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: '订单不存在' },
                { status: 404 }
            );
        }

        // 验证订单属于当前用户
        if (order.employerId !== session.user.id) {
            return NextResponse.json(
                { success: false, message: '无权操作此订单' },
                { status: 403 }
            );
        }

        // 创建支付
        const amount = Math.round(Number(order.expectedSalary) * 100); // 转换为分
        const result = await createPayment({
            orderId: order.id,
            amount,
            description: `订单支付: ${order.title}`,
            provider,
            userId: session.user.id,
            returnUrl: `${process.env.NEXTAUTH_URL}/orders/${orderId}/success`,
        });

        if (result.success) {
            // 记录交易
            const wallet = await prisma.wallet.findUnique({
                where: { userId: session.user.id },
            });

            if (wallet) {
                await prisma.transaction.create({
                    data: {
                        walletId: wallet.id,
                        amount: -amount / 100, // 转回元
                        type: 'ORDER_PAY',
                        status: 'PENDING',
                        orderId: order.id,
                        transactionNo: result.paymentId,
                        description: `支付订单: ${order.orderNo}`,
                    },
                });
            }

            return NextResponse.json({
                success: true,
                data: {
                    paymentId: result.paymentId,
                    clientSecret: result.clientSecret,
                    payUrl: result.payUrl,
                    qrCode: result.qrCode,
                },
            });
        } else {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('创建支付失败:', error);
        return NextResponse.json(
            { success: false, message: '服务器错误' },
            { status: 500 }
        );
    }
}
