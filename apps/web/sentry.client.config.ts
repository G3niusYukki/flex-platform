import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // 采样率：生产环境 10%，开发环境 100%
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // 错误采样率
    sampleRate: 1.0,

    // 发布版本
    release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

    // 环境
    environment: process.env.NODE_ENV,

    // 禁用开发环境的错误发送
    enabled: process.env.NODE_ENV === "production",

    // 过滤掉非错误的异常
    beforeSend(event) {
        // 过滤掉非关键错误
        if (event.exception?.values?.[0]?.type === "ChunkLoadError") {
            return null;
        }
        return event;
    },

    // 集成配置
    integrations: [
        Sentry.replayIntegration({
            // 会话录制配置
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],

    // 会话回放采样率
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 1.0,
});
