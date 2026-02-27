import Stripe from "stripe";
import { prisma } from "./prisma";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export type PaymentProvider = "stripe" | "wechat" | "alipay";

export interface CreatePaymentParams {
  orderId: string;
  amount: number;
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

export async function createStripePayment(
  params: CreatePaymentParams,
): Promise<PaymentResult> {
  if (!stripe) {
    return { success: false, message: "Stripe not configured" };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency || "cny",
      description: params.description,
      metadata: {
        orderId: params.orderId,
        userId: params.userId,
      },
      automatic_payment_methods: { enabled: true },
    });

    return {
      success: true,
      paymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret || undefined,
    };
  } catch (error) {
    console.error("[Payment] Stripe error:", error);
    return { success: false, message: "Payment creation failed" };
  }
}

export async function createWechatPayment(
  params: CreatePaymentParams,
): Promise<PaymentResult> {
  const { WECHAT_PAY_APP_ID, WECHAT_PAY_MCH_ID, WECHAT_PAY_NOTIFY_URL } =
    process.env;

  if (!WECHAT_PAY_APP_ID || !WECHAT_PAY_MCH_ID) {
    return { success: false, message: "WeChat Pay not configured" };
  }

  try {
    const outTradeNo = `WX${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

    const response = await fetch(
      "https://api.mch.weixin.qq.com/v3/pay/transactions/native",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          appid: WECHAT_PAY_APP_ID,
          mchid: WECHAT_PAY_MCH_ID,
          description: params.description,
          out_trade_no: outTradeNo,
          notify_url: WECHAT_PAY_NOTIFY_URL,
          amount: {
            total: params.amount,
            currency: "CNY",
          },
        }),
      },
    );

    const data = await response.json();

    if (data.code_url) {
      return {
        success: true,
        paymentId: outTradeNo,
        qrCode: data.code_url,
      };
    }

    return { success: false, message: data.message || "Failed to get QR code" };
  } catch (error) {
    console.error("[Payment] WeChat Pay error:", error);
    return { success: false, message: "WeChat Pay error" };
  }
}

export async function createAlipayPayment(
  params: CreatePaymentParams,
): Promise<PaymentResult> {
  const { ALIPAY_APP_ID, ALIPAY_NOTIFY_URL, ALIPAY_RETURN_URL } = process.env;

  if (!ALIPAY_APP_ID) {
    return { success: false, message: "Alipay not configured" };
  }

  try {
    const outTradeNo = `ALI${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

    const bizContent = {
      out_trade_no: outTradeNo,
      product_code: "FAST_INSTANT_TRADE_PAY",
      total_amount: (params.amount / 100).toFixed(2),
      subject: params.description,
    };

    const formData = new URLSearchParams();
    formData.append("app_id", ALIPAY_APP_ID);
    formData.append("method", "alipay.trade.page.pay");
    formData.append("format", "JSON");
    formData.append("charset", "utf-8");
    formData.append("sign_type", "RSA2");
    formData.append("timestamp", new Date().toISOString().slice(0, 19));
    formData.append("version", "1.0");
    formData.append("notify_url", ALIPAY_NOTIFY_URL || "");
    formData.append("return_url", params.returnUrl || ALIPAY_RETURN_URL || "");
    formData.append("biz_content", JSON.stringify(bizContent));

    return {
      success: true,
      paymentId: outTradeNo,
      payUrl: `https://openapi.alipay.com/gateway.do?${formData.toString()}`,
    };
  } catch (error) {
    console.error("[Payment] Alipay error:", error);
    return { success: false, message: "Alipay error" };
  }
}

export async function createPayment(
  params: CreatePaymentParams,
): Promise<PaymentResult> {
  switch (params.provider) {
    case "stripe":
      return createStripePayment(params);
    case "wechat":
      return createWechatPayment(params);
    case "alipay":
      return createAlipayPayment(params);
    default:
      return { success: false, message: "Unsupported payment method" };
  }
}

export function verifyStripeWebhook(
  payload: string | Buffer,
  signature: string,
): Stripe.Event | null {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return null;
  }

  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("[Payment] Stripe webhook error:", error);
    return null;
  }
}

export async function handlePaymentCallback(
  provider: PaymentProvider,
  orderId: string,
  paymentId: string,
  amount: number,
  status: "success" | "failed",
): Promise<boolean> {
  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      console.error("[Payment] Order not found:", orderId);
      return false;
    }

    if (status === "success") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "ACCEPTED",
        },
      });

      const wallet = await prisma.wallet.findUnique({
        where: { userId: order.employerId },
      });
      if (wallet) {
        await prisma.transaction.create({
          data: {
            walletId: wallet.id,
            amount: amount / 100,
            type: "ORDER_PAY",
            status: "COMPLETED",
            orderId,
            paymentMethod:
              provider === "stripe"
                ? "STRIPE"
                : provider === "wechat"
                  ? "WECHAT"
                  : "ALIPAY",
            transactionNo: paymentId,
            description: `Order payment: ${order.title}`,
            completedAt: new Date(),
          },
        });
      }
    }

    return true;
  } catch (error) {
    console.error("[Payment] Callback error:", error);
    return false;
  }
}

export async function createRefund(
  paymentId: string,
  amount?: number,
  provider: PaymentProvider = "stripe",
): Promise<{ success: boolean; refundId?: string; message?: string }> {
  try {
    switch (provider) {
      case "stripe":
        if (!stripe)
          return { success: false, message: "Stripe not configured" };

        const refund = await stripe.refunds.create({
          payment_intent: paymentId,
          amount: amount,
        });

        return { success: true, refundId: refund.id };

      case "wechat":
      case "alipay":
        return {
          success: false,
          message: `${provider} refund not implemented yet`,
        };

      default:
        return { success: false, message: "Unsupported payment method" };
    }
  } catch (error) {
    console.error("[Payment] Refund error:", error);
    return { success: false, message: "Refund failed" };
  }
}
