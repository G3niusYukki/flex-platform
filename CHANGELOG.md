# 更新日志

本文件记录 AI 智能雇佣平台的所有重要更新。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [1.0.0] - 2026-02-09

### 🎉 首个正式版发布

#### ✨ 新增功能

**安全与认证**
- SMS 短信验证码登录 (阿里云)
- Google OAuth 第三方登录
- AES-256-GCM 敏感数据加密
- 基础风控系统 (登录/注册/订单异常检测)

**支付集成**
- Stripe 国际支付 (完整实现)
- 微信支付框架
- 支付宝框架
- 统一支付 API `/api/payment/create`
- Stripe Webhook 回调处理

**智能派单**
- AI 智能匹配算法 (距离 × 评分 × 响应率)
- 自动派单 `/api/dispatch/ai-match`
- 候选工人推荐列表

**地图服务**
- 高德地图 API 集成
- 逆地理编码 (坐标 → 地址)
- 距离计算 (Haversine + 路线规划)

**推送通知**
- 极光推送 (JPush) 支持
- Firebase Cloud Messaging 支持
- 设备注册 API `/api/push/device`
- 派单/完成/收款通知

**评价系统**
- 多维度结构化评分 (准时性/质量/态度/沟通)
- 标签化评价
- 评分统计分析

**监控与日志**
- Sentry 错误追踪集成
- 会话回放 (Session Replay)

#### 🔧 改进

- 登录页面支持验证码/密码双模式切换
- 新增 Google 登录按钮
- 更新项目 README 文档
- 完善 `.env.example` 环境变量模板

#### 📦 技术栈

- Next.js 14.1.4
- TypeScript 5.0
- Prisma 5.22
- Tailwind CSS 3.4
- @sentry/nextjs
- stripe
- @alicloud/dysmsapi20170525

---

## [0.1.0] - 2026-02-08

### 初始版本

- 基础用户端和管理后台框架
- Prisma 数据模型设计
- NextAuth 认证
- 基础 UI 组件库
