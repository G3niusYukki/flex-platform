import Stripe from 'stripe';

// Stripe 客户端（用于国际支付和部分场景）
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

export type PaymentProvider = 'stripe' | 'wechat' | 'alipay';

export interface CreatePaymentParams {
    orderId: string;
    amount: number; // 单位：分
    currency?: string;
    description: string;
    provider: PaymentProvider;
    returnUrl?: string;
    userId: string;
}

export interface PaymentResult {
    success: boolean;
    paymentId?: string;
    clientSecret?: string;
    payUrl?: string;
    qrCode?: string;
    message?: string;
}

/**
 * Stripe 支付
 */
export async function createStripePayment(params: CreatePaymentParams): Promise<PaymentResult> {
    if (!stripe) {
        return { success: false, message: 'Stripe 未配置' };
    }

    try {
        // 创建 PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: params.amount,
            currency: params.currency || 'cny',
            description: params.description,
            metadata: {
                orderId: params.orderId,
                userId: params.userId,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            success: true,
            paymentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret || undefined,
        };
    } catch (error) {
        console.error('Stripe 支付创建失败:', error);
        return { success: false, message: '支付创建失败' };
    }
}

/**
 * 微信支付（Native 二维码支付）
 * 注意：需要配置微信支付商户证书
 */
export async function createWechatPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    const {
        WECHAT_PAY_MCH_ID,
        WECHAT_PAY_APP_ID,
        WECHAT_PAY_API_V3_KEY,
        WECHAT_PAY_NOTIFY_URL,
    } = process.env;

    if (!WECHAT_PAY_MCH_ID || !WECHAT_PAY_APP_ID) {
        return { success: false, message: '微信支付未配置' };
    }

    try {
        // 生成订单号
        const outTradeNo = `WX${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

        // 微信支付 Native 下单
        // 注意：实际实现需要配置商户证书和调用微信支付 API
        // 这里提供框架代码，具体实现需要根据微信支付文档完善

        console.log('微信支付请求:', {
            mchid: WECHAT_PAY_MCH_ID,
            appid: WECHAT_PAY_APP_ID,
            description: params.description,
            out_trade_no: outTradeNo,
            amount: { total: params.amount, currency: 'CNY' },
            notify_url: WECHAT_PAY_NOTIFY_URL,
        });

        // TODO: 调用微信支付 API 获取二维码链接
        // const response = await fetch('https://api.mch.weixin.qq.com/v3/pay/transactions/native', {...})

        return {
            success: true,
            paymentId: outTradeNo,
            qrCode: `weixin://wxpay/bizpayurl?pr=${outTradeNo}`, // 示例
            message: '微信支付接口需要配置商户证书',
        };
    } catch (error) {
        console.error('微信支付创建失败:', error);
        return { success: false, message: '微信支付创建失败' };
    }
}

/**
 * 支付宝支付（网页支付）
 * 注意：需要配置支付宝密钥
 */
export async function createAlipayPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    const {
        ALIPAY_APP_ID,
        ALIPAY_PRIVATE_KEY,
        ALIPAY_NOTIFY_URL,
        ALIPAY_RETURN_URL,
    } = process.env;

    if (!ALIPAY_APP_ID || !ALIPAY_PRIVATE_KEY) {
        return { success: false, message: '支付宝未配置' };
    }

    try {
        // 生成订单号
        const outTradeNo = `ALI${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

        // 支付宝网页支付
        // 注意：实际实现需要使用 alipay-sdk 并配置密钥
        // 这里提供框架代码，具体实现需要根据支付宝开放平台文档完善

        console.log('支付宝支付请求:', {
            app_id: ALIPAY_APP_ID,
            subject: params.description,
            out_trade_no: outTradeNo,
            total_amount: (params.amount / 100).toFixed(2), // 转换为元
            notify_url: ALIPAY_NOTIFY_URL,
            return_url: params.returnUrl || ALIPAY_RETURN_URL,
        });

        // TODO: 调用支付宝 SDK 生成支付链接
        // const alipay = new AlipaySdk({...})
        // const result = await alipay.pageExec('alipay.trade.page.pay', {...})

        return {
            success: true,
            paymentId: outTradeNo,
            payUrl: `https://openapi.alipay.com/gateway.do?out_trade_no=${outTradeNo}`, // 示例
            message: '支付宝接口需要配置密钥',
        };
    } catch (error) {
        console.error('支付宝支付创建失败:', error);
        return { success: false, message: '支付宝支付创建失败' };
    }
}

/**
 * 统一支付入口
 */
export async function createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    switch (params.provider) {
        case 'stripe':
            return createStripePayment(params);
        case 'wechat':
            return createWechatPayment(params);
        case 'alipay':
            return createAlipayPayment(params);
        default:
            return { success: false, message: '不支持的支付方式' };
    }
}

/**
 * 验证 Stripe Webhook
 */
export function verifyStripeWebhook(
    payload: string | Buffer,
    signature: string
): Stripe.Event | null {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
        return null;
    }

    try {
        return stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error('Stripe Webhook 验证失败:', error);
        return null;
    }
}

/**
 * 处理退款
 */
export async function createRefund(
    paymentId: string,
    amount?: number,
    provider: PaymentProvider = 'stripe'
): Promise<{ success: boolean; refundId?: string; message?: string }> {
    try {
        switch (provider) {
            case 'stripe':
                if (!stripe) return { success: false, message: 'Stripe 未配置' };
                const refund = await stripe.refunds.create({
                    payment_intent: paymentId,
                    amount: amount, // 部分退款
                });
                return { success: true, refundId: refund.id };

            case 'wechat':
                // TODO: 调用微信退款 API
                return { success: false, message: '微信退款需要实现' };

            case 'alipay':
                // TODO: 调用支付宝退款 API
                return { success: false, message: '支付宝退款需要实现' };

            default:
                return { success: false, message: '不支持的支付方式' };
        }
    } catch (error) {
        console.error('退款失败:', error);
        return { success: false, message: '退款处理失败' };
    }
}
