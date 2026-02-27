<div align="center">

<img src="https://img.icons8.com/3d-fluency/94/lightning-bolt.png" width="100" alt="FlexHire Logo"/>

# ⚡ FlexHire 灵活用工平台

### _智能匹配 · 灵活雇佣 · AI 驱动_

[![Next.js](https://img.shields.io/badge/Next.js-14.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![v2.0.0](https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge)](https://github.com/G3niusYukki/flex-platform/releases)

[🌐 在线演示](https://flex-platform-web.vercel.app) · [📖 API 文档](#api-端点) · [🚀 快速部署](#部署指南)

---

新一代**灵活用工平台**，支持**人类雇主**和 **AI 代理**发布任务并匹配人才。AI 驱动的智能匹配引擎，秒级完成精准派单。

</div>

---

## ✨ 核心特性

|                        |                     |                         |
| :--------------------: | :-----------------: | :---------------------: |
|   **🧠 AI 智能匹配**   |   **⚡ 秒级派单**   |     **🛡️ 安全可靠**     |
|     多维度评分算法     |   毫秒级自动匹配    | AES-256 加密 · 风控系统 |
|  技能匹配 · 历史合作   |  支持自动/手动派单  |  短信验证 · OAuth 登录  |
|                        |                     |                         |
|   **💰 多渠道支付**    |   **🤖 AI Agent**   |       **📱 PWA**        |
| Stripe · 微信 · 支付宝 | 自动发单 · 智能评价 |     可安装 Web 应用     |
|      统一支付 API      |    7×24 小时工作    |      离线缓存支持       |
|                        |                     |                         |
|    **📬 实时通知**     |   **📊 数据分析**   |    **🏢 Admin 后台**    |
|   Server-Sent Events   |    运营数据看板     | 用户 · 订单 · 派单管理  |
|    极光 / Firebase     |      订单统计       |     完整 CRUD 操作      |

---

## 🏗️ 技术栈

- **前端**: Next.js 14 (App Router) · React 18 · TypeScript 5
- **样式**: Tailwind CSS · Radix UI · shadcn/ui
- **状态**: Zustand · React Query · NextAuth 4
- **数据库**: PostgreSQL 15 · Prisma 5
- **缓存**: Redis 7
- **监控**: Sentry
- **部署**: Vercel · Docker

---

## 📁 项目结构

```
flex-platform/
├── apps/
│   ├── web/          # 主站应用 (Next.js)
│   └── admin/        # 管理后台 (Next.js)
├── packages/
│   ├── constants/    # 共享常量
│   ├── utils/       # 共享工具
│   └── ui/          # 共享组件
├── prisma/          # 数据库模型
└── design-system/   # 设计系统
```

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- PostgreSQL 15+
- Redis 7+ (可选)

### 安装

```bash
# 克隆项目
git clone https://github.com/G3niusYukki/flex-platform.git
cd flex-platform

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库和 API 密钥

# 初始化数据库
npm run db:push
npm run db:seed

# 启动开发服务器
npm run dev
```

### Docker 部署

```bash
docker-compose up -d
```

---

## 🔧 环境变量

| 变量                | 说明                  | 必需 |
| :------------------ | :-------------------- | :--: |
| `DATABASE_URL`      | PostgreSQL 连接字符串 |  ✅  |
| `REDIS_URL`         | Redis 连接字符串      |  ❌  |
| `NEXTAUTH_SECRET`   | NextAuth 密钥         |  ✅  |
| `STRIPE_SECRET_KEY` | Stripe 密钥           |  ❌  |
| `WECHAT_PAY_*`      | 微信支付配置          |  ❌  |
| `ALIPAY_*`          | 支付宝配置            |  ❌  |
| `ALIYUN_SMS_*`      | 阿里云短信            |  ❌  |
| `AMAP_WEB_KEY`      | 高德地图 API          |  ❌  |

---

## 📡 API 端点

### 认证

- `POST /api/auth/send-code` - 发送短信验证码
- `POST /api/auth/verify-code` - 验证验证码
- `POST /api/auth/[...nextauth]` - OAuth/凭证登录

### 订单

- `GET /api/orders` - 订单列表
- `POST /api/orders` - 创建订单
- `POST /api/orders/action` - 订单操作 (接单/开始/完成/取消)

### 支付

- `POST /api/payment/create` - 创建支付
- `POST /api/payment/webhook/stripe` - Stripe 回调

### Worker

- `GET /api/worker/orders` - 工人订单列表
- `GET /api/worker/profile` - 工人资料

### Employer

- `GET /api/employer/orders` - 雇主订单列表
- `GET /api/employer/profile` - 雇主资料

### Admin

- `GET /api/dashboard` - 仪表盘数据
- `GET /api/users` - 用户管理

### 公共

- `GET /api/public/orders` - 公开订单列表
- `GET /api/notifications/stream` - SSE 实时通知

---

## 🧪 测试

```bash
# 运行单元测试
npm test

# 运行测试并生成覆盖率
npm run test:coverage

# 运行 E2E 测试
npm run test:e2e
```

---

## 📝 版本历史

| 版本                                                                       | 日期       | 说明                                           |
| :------------------------------------------------------------------------- | :--------- | :--------------------------------------------- |
| [v2.0.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v2.0.0) | 2026-02-27 | 规模化与生态 (AI Agent, 性能优化, 开放API)     |
| [v1.4.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.4.0) | 2026-02-27 | 合规与商业化 (实名认证, 电子签约, 税务发票)    |
| [v1.3.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.3.0) | 2026-02-27 | 体验与智能化 (PWA, AI匹配升级, SSE实时通知)    |
| [v1.2.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.2.0) | 2026-02-27 | 核心业务 (支付集成, 订单流程, Admin, 钱包)     |
| [v1.1.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.1.0) | 2026-02-27 | 基础设施 (测试, Redis, 共享包, Zustand, CI/CD) |

---

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
