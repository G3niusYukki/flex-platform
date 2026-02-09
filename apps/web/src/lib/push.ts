/**
 * 推送通知服务
 * 支持极光推送 / Firebase Cloud Messaging
 */

// 通知类型定义
export type NotificationType =
    | 'NEW_ORDER'           // 新订单
    | 'ORDER_DISPATCHED'    // 订单派单
    | 'ORDER_ACCEPTED'      // 订单被接受
    | 'ORDER_STARTED'       // 开始工作
    | 'ORDER_COMPLETED'     // 工作完成
    | 'ORDER_CANCELED'      // 订单取消
    | 'PAYMENT_RECEIVED'    // 收到付款
    | 'WITHDRAWAL_SUCCESS'  // 提现成功
    | 'NEW_EVALUATION'      // 新评价
    | 'SYSTEM_NOTICE';      // 系统通知

export interface PushNotification {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, string>;
    sound?: string;
    badge?: number;
}

// 设备 Token 存储（生产环境应使用数据库）
const deviceTokens = new Map<string, { token: string; platform: 'ios' | 'android' | 'web' }>();

/**
 * 注册设备 Token
 */
export function registerDeviceToken(
    userId: string,
    token: string,
    platform: 'ios' | 'android' | 'web'
): void {
    deviceTokens.set(userId, { token, platform });
    console.log(`[PUSH] 注册设备: ${userId} -> ${platform}`);
}

/**
 * 移除设备 Token
 */
export function unregisterDeviceToken(userId: string): void {
    deviceTokens.delete(userId);
}

/**
 * 发送推送通知
 */
export async function sendPushNotification(notification: PushNotification): Promise<boolean> {
    const device = deviceTokens.get(notification.userId);

    if (!device) {
        console.log(`[PUSH] 用户 ${notification.userId} 没有注册设备`);
        return false;
    }

    // 根据配置选择推送服务
    if (process.env.JPUSH_APP_KEY) {
        return sendViaJPush(notification, device);
    } else if (process.env.FIREBASE_PROJECT_ID) {
        return sendViaFCM(notification, device);
    } else {
        console.log(`[PUSH] 模拟发送:`, notification);
        return true;
    }
}

/**
 * 极光推送
 */
async function sendViaJPush(
    notification: PushNotification,
    device: { token: string; platform: string }
): Promise<boolean> {
    const { JPUSH_APP_KEY, JPUSH_MASTER_SECRET } = process.env;

    if (!JPUSH_APP_KEY || !JPUSH_MASTER_SECRET) {
        console.warn('[PUSH] 极光推送未配置');
        return false;
    }

    try {
        const auth = Buffer.from(`${JPUSH_APP_KEY}:${JPUSH_MASTER_SECRET}`).toString('base64');

        const response = await fetch('https://api.jpush.cn/v3/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify({
                platform: 'all',
                audience: { registration_id: [device.token] },
                notification: {
                    alert: notification.body,
                    android: {
                        alert: notification.body,
                        title: notification.title,
                        extras: notification.data,
                    },
                    ios: {
                        alert: { title: notification.title, body: notification.body },
                        sound: notification.sound || 'default',
                        badge: notification.badge,
                        extras: notification.data,
                    },
                },
                options: { apns_production: process.env.NODE_ENV === 'production' },
            }),
        });

        const result = await response.json();
        console.log('[PUSH] 极光推送结果:', result);
        return response.ok;
    } catch (error) {
        console.error('[PUSH] 极光推送失败:', error);
        return false;
    }
}

/**
 * Firebase Cloud Messaging
 */
async function sendViaFCM(
    notification: PushNotification,
    device: { token: string; platform: string }
): Promise<boolean> {
    const { FIREBASE_PROJECT_ID, FIREBASE_SERVER_KEY } = process.env;

    if (!FIREBASE_PROJECT_ID || !FIREBASE_SERVER_KEY) {
        console.warn('[PUSH] Firebase 未配置');
        return false;
    }

    try {
        const response = await fetch(
            `https://fcm.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/messages:send`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${FIREBASE_SERVER_KEY}`,
                },
                body: JSON.stringify({
                    message: {
                        token: device.token,
                        notification: {
                            title: notification.title,
                            body: notification.body,
                        },
                        data: notification.data,
                        android: {
                            priority: 'high',
                            notification: { sound: 'default' },
                        },
                        apns: {
                            payload: {
                                aps: {
                                    sound: 'default',
                                    badge: notification.badge,
                                },
                            },
                        },
                    },
                }),
            }
        );

        const result = await response.json();
        console.log('[PUSH] FCM 推送结果:', result);
        return response.ok;
    } catch (error) {
        console.error('[PUSH] FCM 推送失败:', error);
        return false;
    }
}

/**
 * 批量发送推送
 */
export async function sendBulkNotifications(
    userIds: string[],
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, string>
): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const userId of userIds) {
        const result = await sendPushNotification({ userId, type, title, body, data });
        if (result) success++;
        else failed++;
    }

    return { success, failed };
}

// ==================== 便捷方法 ====================

/**
 * 派单通知
 */
export async function notifyDispatch(
    workerId: string,
    orderTitle: string,
    orderId: string
): Promise<boolean> {
    return sendPushNotification({
        userId: workerId,
        type: 'ORDER_DISPATCHED',
        title: '🔔 新的派单',
        body: `您有一个新的工作机会: ${orderTitle}`,
        data: { orderId, action: 'view_order' },
        sound: 'dispatch.wav',
    });
}

/**
 * 订单完成通知
 */
export async function notifyOrderCompleted(
    employerId: string,
    orderTitle: string,
    orderId: string
): Promise<boolean> {
    return sendPushNotification({
        userId: employerId,
        type: 'ORDER_COMPLETED',
        title: '✅ 工作已完成',
        body: `${orderTitle} 已完成，请确认并评价`,
        data: { orderId, action: 'confirm_order' },
    });
}

/**
 * 收款通知
 */
export async function notifyPaymentReceived(
    workerId: string,
    amount: number
): Promise<boolean> {
    return sendPushNotification({
        userId: workerId,
        type: 'PAYMENT_RECEIVED',
        title: '💰 收到付款',
        body: `您已收到 ¥${amount.toFixed(2)} 的工作报酬`,
        data: { action: 'view_wallet' },
    });
}
