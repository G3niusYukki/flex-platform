const { withSentryConfig } = require("@sentry/nextjs");
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  scope: "/",
  sw: "service-worker.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,

  // PWA 配置
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },

  // Sentry 配置
  sentry: {
    hideSourceMaps: true,
  },

  // 启用 instrumentation
  experimental: {
    instrumentationHook: true,
  },
};

// Sentry webpack 配置
const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

// 如果配置了 Sentry，则启用 Sentry 包装
module.exports = withPWA(
  process.env.SENTRY_DSN
    ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
    : nextConfig,
);
