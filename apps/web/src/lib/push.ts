import { getRedis, REDIS_KEYS, DEVICE_TOKEN_TTL } from "./redis";

export type NotificationType =
  | "NEW_ORDER"
  | "ORDER_DISPATCHED"
  | "ORDER_ACCEPTED"
  | "ORDER_STARTED"
  | "ORDER_COMPLETED"
  | "ORDER_CANCELED"
  | "PAYMENT_RECEIVED"
  | "WITHDRAWAL_SUCCESS"
  | "NEW_EVALUATION"
  | "SYSTEM_NOTICE";

export interface PushNotification {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: string;
  badge?: number;
}

interface DeviceTokenRecord {
  token: string;
  platform: "ios" | "android" | "web";
}

let useRedis = true;

const memoryDeviceTokens = new Map<string, DeviceTokenRecord>();

async function setDeviceToken(
  userId: string,
  record: DeviceTokenRecord,
): Promise<void> {
  if (useRedis) {
    try {
      const redis = getRedis();
      await redis.setex(
        REDIS_KEYS.DEVICE_TOKEN(userId),
        DEVICE_TOKEN_TTL,
        JSON.stringify(record),
      );
      return;
    } catch {
      useRedis = false;
    }
  }
  memoryDeviceTokens.set(userId, record);
}

async function getDeviceToken(
  userId: string,
): Promise<DeviceTokenRecord | null> {
  if (useRedis) {
    try {
      const redis = getRedis();
      const data = await redis.get(REDIS_KEYS.DEVICE_TOKEN(userId));
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch {
      useRedis = false;
    }
  }
  return memoryDeviceTokens.get(userId) || null;
}

async function deleteDeviceToken(userId: string): Promise<void> {
  if (useRedis) {
    try {
      const redis = getRedis();
      await redis.del(REDIS_KEYS.DEVICE_TOKEN(userId));
      return;
    } catch {
      useRedis = false;
    }
  }
  memoryDeviceTokens.delete(userId);
}

export async function registerDeviceToken(
  userId: string,
  token: string,
  platform: "ios" | "android" | "web",
): Promise<void> {
  await setDeviceToken(userId, { token, platform });
  console.log(`[PUSH] 注册设备: ${userId} -> ${platform}`);
}

export async function unregisterDeviceToken(userId: string): Promise<void> {
  await deleteDeviceToken(userId);
}

export async function sendPushNotification(
  notification: PushNotification,
): Promise<boolean> {
  const device = await getDeviceToken(notification.userId);

  if (!device) {
    console.log(`[PUSH] 用户 ${notification.userId} 没有注册设备`);
    return false;
  }

  if (process.env.JPUSH_APP_KEY) {
    return sendViaJPush(notification, device);
  } else if (process.env.FIREBASE_PROJECT_ID) {
    return sendViaFCM(notification, device);
  } else {
    console.log(`[PUSH] 模拟发送:`, notification);
    return true;
  }
}

async function sendViaJPush(
  notification: PushNotification,
  device: DeviceTokenRecord,
): Promise<boolean> {
  const { JPUSH_APP_KEY, JPUSH_MASTER_SECRET } = process.env;

  if (!JPUSH_APP_KEY || !JPUSH_MASTER_SECRET) {
    console.warn("[PUSH] 极光推送未配置");
    return false;
  }

  try {
    const auth = Buffer.from(
      `${JPUSH_APP_KEY}:${JPUSH_MASTER_SECRET}`,
    ).toString("base64");

    const response = await fetch("https://api.jpush.cn/v3/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        platform: "all",
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
            sound: notification.sound || "default",
            badge: notification.badge,
            extras: notification.data,
          },
        },
        options: { apns_production: process.env.NODE_ENV === "production" },
      }),
    });

    const result = await response.json();
    console.log("[PUSH] 极光推送结果:", result);
    return response.ok;
  } catch (error) {
    console.error("[PUSH] 极光推送失败:", error);
    return false;
  }
}

async function sendViaFCM(
  notification: PushNotification,
  device: DeviceTokenRecord,
): Promise<boolean> {
  const { FIREBASE_PROJECT_ID, FIREBASE_SERVER_KEY } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_SERVER_KEY) {
    console.warn("[PUSH] Firebase 未配置");
    return false;
  }

  try {
    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${FIREBASE_SERVER_KEY}`,
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
              priority: "high",
              notification: { sound: "default" },
            },
            apns: {
              payload: {
                aps: {
                  sound: "default",
                  badge: notification.badge,
                },
              },
            },
          },
        }),
      },
    );

    const result = await response.json();
    console.log("[PUSH] FCM 推送结果:", result);
    return response.ok;
  } catch (error) {
    console.error("[PUSH] FCM 推送失败:", error);
    return false;
  }
}

export async function sendBulkNotifications(
  userIds: string[],
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const userId of userIds) {
    const result = await sendPushNotification({
      userId,
      type,
      title,
      body,
      data,
    });
    if (result) success++;
    else failed++;
  }

  return { success, failed };
}

export async function notifyDispatch(
  workerId: string,
  orderTitle: string,
  orderId: string,
): Promise<boolean> {
  return sendPushNotification({
    userId: workerId,
    type: "ORDER_DISPATCHED",
    title: "🔔 新的派单",
    body: `您有一个新的工作机会: ${orderTitle}`,
    data: { orderId, action: "view_order" },
    sound: "dispatch.wav",
  });
}

export async function notifyOrderCompleted(
  employerId: string,
  orderTitle: string,
  orderId: string,
): Promise<boolean> {
  return sendPushNotification({
    userId: employerId,
    type: "ORDER_COMPLETED",
    title: "✅ 工作已完成",
    body: `${orderTitle} 已完成，请确认并评价`,
    data: { orderId, action: "confirm_order" },
  });
}

export async function notifyPaymentReceived(
  workerId: string,
  amount: number,
): Promise<boolean> {
  return sendPushNotification({
    userId: workerId,
    type: "PAYMENT_RECEIVED",
    title: "💰 收到付款",
    body: `您已收到 ¥${amount.toFixed(2)} 的工作报酬`,
    data: { action: "view_wallet" },
  });
}
