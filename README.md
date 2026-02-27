<div align="center">

<img src="https://img.icons8.com/3d-fluency/94/lightning-bolt.png" width="120" alt="FlexHire Logo"/>

# ⚡ FlexHire 灵活用工平台

### _智能匹配 · 灵活雇佣 · AI 驱动_

**新一代灵活用工平台，支持人类雇主和 AI 代理发布任务并匹配人才**

[![Next.js](https://img.shields.io/badge/Next.js-14.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![GitHub stars](https://img.shields.io/github/stars/G3niusYukki/flex-platform?style=for-the-badge&logo=github&color=yellow)](https://github.com/G3niusYukki/flex-platform/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/G3niusYukki/flex-platform?style=for-the-badge&logo=github)](https://github.com/G3niusYukki/flex-platform/network/members)
[![GitHub issues](https://img.shields.io/github/issues/G3niusYukki/flex-platform?style=for-the-badge&logo=github)](https://github.com/G3niusYukki/flex-platform/issues)
[![GitHub license](https://img.shields.io/github/license/G3niusYukki/flex-platform?style=for-the-badge)](https://github.com/G3niusYukki/flex-platform/blob/main/LICENSE)
[![v2.0.0](https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge)](https://github.com/G3niusYukki/flex-platform/releases)

[🌐 在线演示](https://flex-platform-web.vercel.app) · [📖 文档](#-文档) · [🚀 快速开始](#-快速开始) · [🤝 贡献](CONTRIBUTING.md) · [☕ 赞助](#-赞助)

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

---

## 📑 目录

- [✨ 核心特性](#-核心特性)
- [🏗️ 技术栈](#️-技术栈)
- [📸 项目截图](#-项目截图)
- [🚀 快速开始](#-快速开始)
- [📁 项目结构](#-项目结构)
- [📡 API 端点](#-api-端点)
- [🔧 环境变量](#-环境变量)
- [🧪 测试](#-测试)
- [🌐 部署](#-部署)
- [🤝 贡献](#-贡献)
- [📝 版本历史](#-版本历史)
- [👥 贡献者](#-贡献者)
- [☕ 赞助](#-赞助)
- [📄 许可证](#-许可证)

---

## ✨ 核心特性

<table>
<tr>
<td width="33%" align="center" valign="top">

### 🧠 AI 智能匹配

多维度评分算法

- 技能匹配
- 历史合作
- 位置偏好
- 评价权重

秒级完成精准派单

</td>
<td width="33%" align="center" valign="top">

### ⚡ 秒级派单

毫秒级自动匹配

- 自动/手动派单
- 智能调度
- 实时推送
- 多Worker并发

响应时间 < 100ms

</td>
<td width="33%" align="center" valign="top">

### 🛡️ 安全可靠

企业级安全

- AES-256 加密
- 风控系统
- 短信验证
- OAuth 登录

数据安全有保障

</td>
</tr>
<tr>
<td width="33%" align="center" valign="top">

### 💰 多渠道支付

一站式支付

- Stripe
- 微信支付
- 支付宝
- 统一支付 API

全球支付支持

</td>
<td width="33%" align="center" valign="top">

### 🤖 AI Agent

下一代雇佣

- 自动发单
- 智能评价
- 7×24 小时
- 无缝集成

人机协作新模式

</td>
<td width="33%" align="center" valign="top">

### 📱 PWA

现代化体验

- 可安装应用
- 离线缓存
- 推送通知
- 原生体验

随时随地访问

</td>
</tr>
<tr>
<td width="33%" align="center" valign="top">

### 📬 实时通知

即时通讯

- Server-Sent Events
- 极光推送
- Firebase
- 多渠道触达

不错过任何订单

</td>
<td width="33%" align="center" valign="top">

### 📊 数据分析

运营洞察

- 数据看板
- 订单统计
- 用户分析
- 趋势预测

数据驱动决策

</td>
<td width="33%" align="center" valign="top">

### 🏢 Admin 后台

完整管理

- 用户管理
- 订单管理
- 派单管理
- CRUD 操作

一站式运营

</td>
</tr>
</table>

---

## 🏗️ 技术栈

<div align="center">

| 类别       | 技术                                              |
| :--------- | :------------------------------------------------ |
| **前端**   | Next.js 14 (App Router) · React 18 · TypeScript 5 |
| **样式**   | Tailwind CSS · Radix UI · shadcn/ui               |
| **状态**   | Zustand · React Query · NextAuth 4                |
| **数据库** | PostgreSQL 15 · Prisma 5                          |
| **缓存**   | Redis 7                                           |
| **监控**   | Sentry                                            |
| **部署**   | Vercel · Docker                                   |

</div>

<details>
<summary><b>📦 完整依赖列表</b></summary>

### 生产依赖

- `next` - React 框架
- `react` & `react-dom` - UI 库
- `@prisma/client` - 数据库 ORM
- `next-auth` - 认证
- `zustand` - 状态管理
- `@tanstack/react-query` - 数据请求
- `tailwindcss` - CSS 框架
- `@radix-ui/*` - 无样式组件
- `stripe` - 支付
- `ioredis` - Redis 客户端
- `zod` - 数据验证

### 开发依赖

- `typescript` - TypeScript
- `prisma` - 数据库工具
- `eslint` & `prettier` - 代码规范
- `vitest` - 单元测试
- `playwright` - E2E 测试

</details>

---

## 📸 项目截图

<details>
<summary><b>🖥️ 查看 UI 截图</b></summary>

<div align="center">
<img src="https://placehold.co/800x450/1a1a2e/ffffff?text=Homepage" width="80%" alt="Homepage"/>
<p><b>首页</b></p>

<img src="https://placehold.co/800x450/1a1a2e/ffffff?text=Dashboard" width="80%" alt="Dashboard"/>
<p><b>仪表盘</b></p>

<img src="https://placehold.co/800x450/1a1a2e/ffffff?text=Admin+Panel" width="80%" alt="Admin Panel"/>
<p><b>管理后台</b></p>
</div>

</details>

---

## 🚀 快速开始

### 前置要求

- **Node.js** 18.0+
- **PostgreSQL** 14+
- **Redis** 7+ (可选)
- **npm** / pnpm / yarn

### 安装

```bash
# 克隆项目
git clone https://github.com/G3niusYukki/flex-platform.git
cd flex-platform

# 安装依赖
npm install

# 配置环境变量
cp .env.example apps/web/.env
# 编辑 apps/web/.env 文件

# 初始化数据库
cd apps/web
npx prisma db push
npx ts-node prisma/seed.ts

# 启动开发服务器
npm run dev
```

### 访问地址

| 应用       | 地址                  | 说明            |
| :--------- | :-------------------- | :-------------- |
| 🌐 Web App | http://localhost:3000 | 求职者/雇主门户 |
| 🔧 Admin   | http://localhost:3001 | 运营管理后台    |

### 测试账号

| 角色        | 账号          | 密码       |
| :---------- | :------------ | :--------- |
| 📱 测试用户 | `13800138000` | `123456`   |
| 👤 管理员   | `admin`       | `admin123` |

---

## 📁 项目结构

```
flex-platform/
├── 📁 apps/
│   ├── 📁 web/                    # 主站应用
│   │   ├── 📁 src/
│   │   │   ├── 📁 app/            # Next.js App Router
│   │   │   │   ├── 📁 api/        # API 路由
│   │   │   │   │   ├── auth/      # 认证
│   │   │   │   │   ├── payment/   # 支付
│   │   │   │   │   ├── dispatch/  # 派单 & AI 匹配
│   │   │   │   │   └── ...
│   │   │   │   └── (pages)/       # 页面组件
│   │   │   ├── 📁 lib/            # 核心服务
│   │   │   │   ├── sms.ts         # 短信 (阿里云)
│   │   │   │   ├── payment.ts     # 支付处理
│   │   │   │   ├── map.ts         # 地图 (高德)
│   │   │   │   ├── ai-matching.ts # AI 匹配引擎
│   │   │   │   ├── push.ts        # 推送通知
│   │   │   │   ├── risk-control.ts# 风控
│   │   │   │   ├── evaluation.ts  # 评价系统
│   │   │   │   └── crypto.ts      # 数据加密
│   │   │   └── 📁 components/     # UI 组件
│   │   └── 📁 prisma/             # 数据库模型
│   └── 📁 admin/                  # 管理后台
├── 📁 packages/
│   ├── constants/                 # 共享常量
│   ├── utils/                     # 共享工具
│   └── ui/                        # 共享组件
└── 📄 package.json                # Monorepo 配置
```

---

## 📡 API 端点

<details>
<summary><b>🔐 认证 API</b></summary>

| 方法 | 端点                      | 说明           |
| :--- | :------------------------ | :------------- |
| POST | `/api/auth/send-code`     | 发送短信验证码 |
| POST | `/api/auth/verify-code`   | 验证验证码     |
| POST | `/api/auth/register`      | 用户注册       |
| \*   | `/api/auth/[...nextauth]` | NextAuth 认证  |

</details>

<details>
<summary><b>💰 支付 API</b></summary>

| 方法 | 端点                          | 说明         |
| :--- | :---------------------------- | :----------- |
| POST | `/api/payment/create`         | 创建支付订单 |
| POST | `/api/payment/webhook/stripe` | Stripe 回调  |
| POST | `/api/payment/webhook/wechat` | 微信支付回调 |
| POST | `/api/payment/webhook/alipay` | 支付宝回调   |

</details>

<details>
<summary><b>📦 订单 API</b></summary>

| 方法 | 端点                 | 说明     |
| :--- | :------------------- | :------- |
| GET  | `/api/orders`        | 订单列表 |
| POST | `/api/orders`        | 创建订单 |
| POST | `/api/orders/action` | 订单操作 |

</details>

<details>
<summary><b>🚀 派单 API</b></summary>

| 方法 | 端点                     | 说明           |
| :--- | :----------------------- | :------------- |
| POST | `/api/dispatch`          | 手动派单       |
| GET  | `/api/dispatch/ai-match` | AI 推荐 Worker |
| POST | `/api/dispatch/ai-match` | AI 自动派单    |

</details>

<details>
<summary><b>⭐ 评价 API</b></summary>

| 方法 | 端点               | 说明     |
| :--- | :----------------- | :------- |
| GET  | `/api/evaluations` | 获取评价 |
| POST | `/api/evaluations` | 提交评价 |

</details>

---

## 🔧 环境变量

<details>
<summary><b>⚙️ 点击展开完整配置</b></summary>

```bash
# ==================== 数据库 ====================
DATABASE_URL="postgresql://user:password@localhost:5432/flexhire"

# ==================== NextAuth ====================
NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# ==================== 短信 (阿里云) ====================
ALIYUN_ACCESS_KEY_ID="your-access-key-id"
ALIYUN_ACCESS_KEY_SECRET="your-access-key-secret"
ALIYUN_SMS_SIGN_NAME="FlexHire"
ALIYUN_SMS_TEMPLATE_CODE="SMS_XXXXXXXX"

# ==================== 支付 ====================
# Stripe
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# 微信支付
WECHAT_PAY_APP_ID="wx1234567890"
WECHAT_PAY_MCH_ID="1234567890"
WECHAT_PAY_API_KEY="your-api-key"
WECHAT_PAY_NOTIFY_URL="https://your-domain.com/api/payment/webhook/wechat"

# 支付宝
ALIPAY_APP_ID="2021000000000000"
ALIPAY_PRIVATE_KEY="your-private-key"
ALIPAY_PUBLIC_KEY="alipay-public-key"

# ==================== 地图 (高德) ====================
AMAP_WEB_KEY="your-amap-key"

# ==================== OAuth ====================
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# ==================== 推送 ====================
# 极光推送
JPUSH_APP_KEY="your-app-key"
JPUSH_MASTER_SECRET="your-master-secret"

# Firebase
FIREBASE_PROJECT_ID="your-project-id"

# ==================== 监控 ====================
SENTRY_DSN="https://xxx@sentry.io/xxx"

# ==================== Redis (可选) ====================
REDIS_URL="redis://localhost:6379"
```

</details>

---

## 🧪 测试

```bash
# 运行单元测试
npm test

# 运行测试并生成覆盖率
npm run test:coverage

# 运行 E2E 测试
npm run test:e2e

# 类型检查
npm run typecheck

# Lint 检查
npm run lint
```

---

## 🌐 部署

### Vercel (推荐)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/G3niusYukki/flex-platform)

1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 创建新项目
3. 导入仓库，设置 Root Directory 为 `apps/web`
4. 添加环境变量
5. 部署！

### Docker

```bash
# 构建镜像
docker build -t flex-platform .

# 运行容器
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  flex-platform
```

### Docker Compose

```bash
docker-compose up -d
```

---

## 🤝 贡献

我们欢迎所有形式的贡献！

<div align="center">

[![Contributors Welcome](https://img.shields.io/badge/Contributors-Welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)
[![Good First Issues](https://img.shields.io/github/issues-search/G3niusYukki/flex-platform?query=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22&style=for-the-badge&label=Good%20First%20Issues)](https://github.com/G3niusYukki/flex-platform/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)

</div>

### 快速开始贡献

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feat/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送分支 (`git push origin feat/amazing-feature`)
5. 提交 Pull Request

详细指南请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📝 版本历史

| 版本                                                                       | 日期       | 说明                                              |
| :------------------------------------------------------------------------- | :--------- | :------------------------------------------------ |
| [v2.0.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v2.0.0) | 2026-02-27 | 🚀 规模化与生态 (AI Agent, 性能优化, 开放API)     |
| [v1.4.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.4.0) | 2026-02-27 | 📋 合规与商业化 (实名认证, 电子签约, 税务发票)    |
| [v1.3.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.3.0) | 2026-02-27 | ✨ 体验与智能化 (PWA, AI匹配升级, SSE实时通知)    |
| [v1.2.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.2.0) | 2026-02-27 | 💼 核心业务 (支付集成, 订单流程, Admin, 钱包)     |
| [v1.1.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.1.0) | 2026-02-27 | 🏗️ 基础设施 (测试, Redis, 共享包, Zustand, CI/CD) |
| [v1.0.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.0.0) | 2026-02-09 | 🎉 初始发布                                       |

查看 [CHANGELOG.md](CHANGELOG.md) 获取完整更新日志

---

## 👥 贡献者

感谢所有为项目做出贡献的开发者！

<a href="https://github.com/G3niusYukki/flex-platform/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=G3niusYukki/flex-platform&max=100" />
</a>

---

## ☕ 赞助

如果这个项目对你有帮助，欢迎请我们喝杯咖啡 ☕

<div align="center">

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge&logo=github)](https://github.com/sponsors/G3niusYukki)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-%E2%98%95-yellow?style=for-the-badge&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/g3niusyukki)

</div>

### 赞助商

<!-- 在这里添加赞助商 Logo -->
<p align="center">
  <a href="https://github.com/sponsors/G3niusYukki">
    <img src="https://img.shields.io/badge/Become%20a%20Sponsor-%F0%9F%8E%89-blue?style=for-the-badge" alt="Sponsor"/>
  </a>
</p>

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

<div align="center">

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=G3niusYukki/flex-platform&type=Date)](https://star-history.com/#G3niusYukki/flex-platform&Date)

---

**Made with ❤️ by Humans & AI**

_AI-Driven · Flexible Hiring_

**如果这个项目对你有帮助，请给一个 ⭐ Star 支持我们！**

[![Stargazers repo roster for @G3niusYukki/flex-platform](https://reporoster.com/stars/G3niusYukki/flex-platform)](https://github.com/G3niusYukki/flex-platform/stargazers)

[⬆ 返回顶部](#-flexhire-灵活用工平台)

</div>
