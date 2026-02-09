import { NextRequest, NextResponse } from 'next/server';
import { verifyStripeWebhook } from '@/lib/payment';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const payload = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { success: false, message: '缺少签名' },
                { status: 400 }
            );
        }

        // 验证 Webhook
        const event = verifyStripeWebhook(payload, signature);
        if (!event) {
            return NextResponse.json(
                { success: false, message: '签名验证失败' },
                { status: 400 }
            );
        }

        // 处理事件
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const orderId = paymentIntent.metadata.orderId;
                const userId = paymentIntent.metadata.userId;

                if (orderId) {
                    // 更新订单状态
                    await prisma.order.update({
                        where: { id: orderId },
                        data: { status: 'ACCEPTED' },
                    });

                    // 更新交易状态
                    await prisma.transaction.updateMany({
                        where: {
                            orderId,
                            transactionNo: paymentIntent.id,
                        },
                        data: {
                            status: 'COMPLETED',
                            completedAt: new Date(),
                        },
                    });

                    console.log(`订单 ${orderId} 支付成功`);
                }
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const orderId = paymentIntent.metadata.orderId;

                if (orderId) {
                    await prisma.transaction.updateMany({
                        where: {
                            orderId,
                            transactionNo: paymentIntent.id,
                        },
                        data: {
                            status: 'FAILED',
                        },
                    });

                    console.log(`订单 ${orderId} 支付失败`);
                }
                break;
            }

            case 'charge.refunded': {
                const charge = event.data.object;
                console.log('退款成功:', charge.id);
                break;
            }

            default:
                console.log('未处理的事件类型:', event.type);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook 处理失败:', error);
        return NextResponse.json(
            { success: false, message: '处理失败' },
            { status: 500 }
        );
    }
}
