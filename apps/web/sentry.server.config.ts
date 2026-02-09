import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // 采样率
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // 发布版本
    release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

    // 环境
    environment: process.env.NODE_ENV,

    // 禁用开发环境
    enabled: process.env.NODE_ENV === "production",
});
