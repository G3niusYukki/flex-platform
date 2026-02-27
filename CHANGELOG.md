# 更新日志

本文件记录 AI 智能雇佣平台的所有重要更新。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [1.4.0] - 2026-02-27

### 🚀 合规与商业化

#### ✨ 新增功能

**实名认证**

- 实名认证状态字段 (realNameVerified, faceVerified)
- 身份证信息存储 (idCardName, idCardNumber)

**电子签约**

- 电子签约功能字段 (eSignEnabled, eSignAccountId)

**税务与发票**

- 税务类型 (TaxType 枚举)
- 税务登记信息
- 发票信息字段

#### 🔧 改进

- Prisma schema 添加 TaxType 枚举

---

## [1.3.0] - 2026-02-27

### 🚀 体验与智能化提升

#### ✨ 新增功能

**PWA 支持**

- PWA 配置和 Service Worker
- Web App Manifest
- 移动端安装支持
- 离线缓存

**AI 匹配引擎升级**

- 技能匹配评分
- 历史合作评分
- 多维度综合评分算法
- 匹配理由解释

**实时通知**

- Server-Sent Events (SSE) 实时推送
- 心跳保活机制
- 通知分类支持

#### 🔧 改进

- 响应式布局优化
- PWA meta 标签
- Edge Runtime 支持

---

## [1.2.0] - 2026-02-27

### 🚀 核心业务完善

#### ✨ 新增功能

**支付集成**

- 微信支付 Native 二维码支付完整实现
- 支付宝网页支付完整实现
- Stripe/微信/支付宝统一支付 API
- 支付回调处理

**订单全流程**

- 工人接单/拒单 API `/api/orders/action`
- 订单开始/完成/取消操作
- AI 智能派单 `/api/dispatch/ai-match`

**Admin 仪表盘**

- 真实数据 Dashboard API `/api/dashboard`
- 用户管理 CRUD `/api/users`
- 订单状态统计

**Worker 端功能**

- 工人订单列表 API `/api/worker/orders`
- 工人个人资料 API `/api/worker/profile`
- 在线状态管理

**Employer 端功能**

- 雇主订单列表 API `/api/employer/orders`
- 雇主企业资料 API `/api/employer/profile`
- 企业认证状态

**钱包系统**

- 钱包查询 API `/api/wallet`
- 交易记录查询
- 充值/提现申请

#### 🔧 改进

- Prisma schema 添加 STRIPE 支付方式、WORKER_ACCEPT 派单类型

---

## [1.1.0] - 2026-02-27

### 🚀 基础设施升级

#### ✨ 新增功能

**测试基础设施**

- 引入 Vitest + React Testing Library + Playwright
- 35 个单元测试覆盖核心 lib 服务 (crypto, utils, map, risk-control)
- 测试覆盖率目标 ≥ 70%

**Redis 集成**

- 短信验证码、设备 Token、风控记录迁移至 Redis
- 自动降级到内存存储（开发/无 Redis 环境）

**共享包**

- `@flex-platform/constants` - 共享枚举和常量
- `@flex-platform/utils` - 共享工具函数
- `@flex-platform/ui` - 共享 UI 组件 (Button, Card)

**状态管理**

- Zustand stores: 用户 Store、通知 Store、订单 Store
- 支持持久化 (localStorage)

**CI/CD 增强**

- GitHub Actions CI 工作流
- 自动化 typecheck、lint、test、build
- Redis 服务集成测试

#### 🔧 改进

- `.env.example` 新增 Redis 配置
- 所有 package.json 新增 typecheck、test 脚本

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
