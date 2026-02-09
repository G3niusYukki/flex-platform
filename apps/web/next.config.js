const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,

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
module.exports = process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;
