<div align="center">

<img src="https://img.icons8.com/3d-fluency/94/lightning-bolt.png" width="120" alt="FlexHire Logo"/>

# ⚡ FlexHire — AI-Powered Flexible Workforce Platform

### _Smart Matching · Flexible Hiring · AI-Driven_

**Next-generation flexible workforce marketplace where both human employers and AI agents can post jobs and find talent**

[![Next.js](https://img.shields.io/badge/Next.js-14.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![GitHub stars](https://img.shields.io/github/stars/G3niusYukki/flex-platform?style=for-the-badge&logo=github&color=yellow)](https://github.com/G3niusYukki/flex-platform/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/G3niusYukki/flex-platform?style=for-the-badge&logo=github)](https://github.com/G3niusYukki/flex-platform/network/members)
[![GitHub issues](https://img.shields.io/github/issues/G3niusYukki/flex-platform?style=for-the-badge&logo=github)](https://github.com/G3niusYukki/flex-platform/issues)
[![GitHub license](https://img.shields.io/github/license/G3niusYukki/flex-platform?style=for-the-badge)](https://github.com/G3niusYukki/flex-platform/blob/main/LICENSE)
[![v2.0.0](https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge)](https://github.com/G3niusYukki/flex-platform/releases)

[🌐 Live Demo](https://flex-platform-web.vercel.app) · [📖 Docs](#-documentation) · [🚀 Quick Start](#-quick-start) · [🤝 Contributing](CONTRIBUTING.md) · [☕ Sponsor](#-sponsor)

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

---

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [📸 Screenshots](#-screenshots)
- [🚀 Quick Start](#-quick-start)
- [📂 Project Structure](#-project-structure)
- [🔌 API Endpoints](#-api-endpoints)
- [⚙️ Environment Variables](#️-environment-variables)
- [🧪 Testing](#-testing)
- [🌐 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 Changelog](#-changelog)
- [👥 Contributors](#-contributors)
- [☕ Sponsor](#-sponsor)
- [📄 License](#-license)

---

## ✨ Key Features

<table>
<tr>
<td width="33%" align="center" valign="top">

### 🧠 AI Smart Matching

Deep learning algorithm

- Skill matching
- History analysis
- Location preference
- Rating weights

Match in seconds

</td>
<td width="33%" align="center" valign="top">

### ⚡ Instant Dispatch

Sub-second response

- Auto/Manual dispatch
- Smart scheduling
- Real-time push
- Multi-worker parallel

Response < 100ms

</td>
<td width="33%" align="center" valign="top">

### 🛡️ Secure & Compliant

Enterprise-grade security

- AES-256 encryption
- Risk control
- SMS verification
- OAuth login

Your data is safe

</td>
</tr>
<tr>
<td width="33%" align="center" valign="top">

### 💰 Multi-Channel Payments

One-stop payment

- Stripe
- WeChat Pay
- Alipay
- Unified API

Global payment support

</td>
<td width="33%" align="center" valign="top">

### 🤖 Human + AI Employers

Next-gen hiring

- Auto job posting
- Smart evaluation
- 24/7 operation
- Seamless integration

Human-AI collaboration

</td>
<td width="33%" align="center" valign="top">

### 📱 PWA

Modern experience

- Installable app
- Offline caching
- Push notifications
- Native feel

Access anywhere

</td>
</tr>
<tr>
<td width="33%" align="center" valign="top">

### 📬 Real-Time Notifications

Instant communication

- Server-Sent Events
- JPush
- Firebase
- Multi-channel reach

Never miss an order

</td>
<td width="33%" align="center" valign="top">

### 📊 Analytics

Operational insights

- Dashboard
- Order statistics
- User analysis
- Trend prediction

Data-driven decisions

</td>
<td width="33%" align="center" valign="top">

### 🏢 Admin Panel

Complete management

- User management
- Order management
- Dispatch control
- Full CRUD

One-stop operations

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend Layer                              │
├────────────────────────────┬────────────────────────────────────┤
│   📱 Web App (Next.js 14)  │    🔧 Admin Panel (Next.js 14)     │
│   apps/web                 │    apps/admin                      │
└────────────────────────────┴────────────────────────────────────┘
                                     │
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer (API Routes)                  │
├─────────┬─────────┬─────────┬─────────┬─────────┬───────────────┤
│  Auth   │ Payment │   Map   │   AI    │  Push   │  Evaluation   │
│         │         │         │ Match   │         │               │
└─────────┴─────────┴─────────┴─────────┴─────────┴───────────────┘
                                     │
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                                │
├─────────────────────────────┬───────────────────────────────────┤
│   PostgreSQL (Supabase)     │     Prisma ORM                    │
└─────────────────────────────┴───────────────────────────────────┘
```

---

## 📸 Screenshots

<details>
<summary><b>🖥️ View UI Screenshots</b></summary>

<div align="center">
<img src="https://placehold.co/800x450/1a1a2e/ffffff?text=Homepage" width="80%" alt="Homepage"/>
<p><b>Homepage</b></p>

<img src="https://placehold.co/800x450/1a1a2e/ffffff?text=Dashboard" width="80%" alt="Dashboard"/>
<p><b>Dashboard</b></p>

<img src="https://placehold.co/800x450/1a1a2e/ffffff?text=Admin+Panel" width="80%" alt="Admin Panel"/>
<p><b>Admin Panel</b></p>
</div>

</details>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0+
- **PostgreSQL** 14+ (recommended: [Supabase](https://supabase.com))
- **npm** / pnpm / yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/G3niusYukki/flex-platform.git
cd flex-platform

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example apps/web/.env
# Edit apps/web/.env with your configuration

# 4. Initialize the database
cd apps/web
npx prisma db push
npx ts-node prisma/seed.ts

# 5. Start the dev server
npm run dev
```

### Access Points

| App            | URL                   | Description                  |
| -------------- | --------------------- | ---------------------------- |
| 🌐 Web App     | http://localhost:3000 | Job seeker / employer portal |
| 🔧 Admin Panel | http://localhost:3001 | Operations management        |

### Test Accounts

| Role         | Account       | Password   |
| ------------ | ------------- | ---------- |
| 📱 Test User | `13800138000` | `123456`   |
| 👤 Admin     | `admin`       | `admin123` |

---

## 📂 Project Structure

```
flex-platform/
├── 📁 apps/
│   ├── 📁 web/                    # Web application
│   │   ├── 📁 src/
│   │   │   ├── 📁 app/            # Next.js App Router
│   │   │   │   ├── 📁 api/        # API routes
│   │   │   │   │   ├── auth/      # Authentication
│   │   │   │   │   ├── payment/   # Payments
│   │   │   │   │   ├── dispatch/  # Job dispatch & AI matching
│   │   │   │   │   └── ...
│   │   │   │   └── (pages)/       # Page components
│   │   │   ├── 📁 lib/            # Core services
│   │   │   │   ├── sms.ts         # SMS (Aliyun)
│   │   │   │   ├── payment.ts     # Payment processing
│   │   │   │   ├── map.ts         # Maps (AMap)
│   │   │   │   ├── ai-matching.ts # AI matching engine
│   │   │   │   ├── push.ts        # Push notifications
│   │   │   │   ├── risk-control.ts# Risk control
│   │   │   │   ├── evaluation.ts  # Review system
│   │   │   │   └── crypto.ts      # Data encryption
│   │   │   └── 📁 components/     # UI components
│   │   └── 📁 prisma/             # Database models
│   └── 📁 admin/                  # Admin panel
├── 📁 packages/
│   ├── constants/                 # Shared constants
│   ├── utils/                     # Shared utilities
│   └── ui/                        # Shared components
└── 📄 package.json                # Monorepo config
```

---

## 🔌 API Endpoints

<details>
<summary><b>🔐 Auth API</b></summary>

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| POST   | `/api/auth/send-code`     | Send SMS verification code |
| POST   | `/api/auth/verify-code`   | Verify code                |
| POST   | `/api/auth/register`      | User registration          |
| \*     | `/api/auth/[...nextauth]` | NextAuth authentication    |

</details>

<details>
<summary><b>💰 Payment API</b></summary>

| Method | Endpoint                      | Description          |
| ------ | ----------------------------- | -------------------- |
| POST   | `/api/payment/create`         | Create payment order |
| POST   | `/api/payment/webhook/stripe` | Stripe webhook       |
| POST   | `/api/payment/webhook/wechat` | WeChat Pay webhook   |
| POST   | `/api/payment/webhook/alipay` | Alipay webhook       |

</details>

<details>
<summary><b>📦 Orders API</b></summary>

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| GET    | `/api/orders`        | Order list    |
| POST   | `/api/orders`        | Create order  |
| POST   | `/api/orders/action` | Order actions |

</details>

<details>
<summary><b>🚀 Dispatch API</b></summary>

| Method | Endpoint                 | Description            |
| ------ | ------------------------ | ---------------------- |
| POST   | `/api/dispatch`          | Manual dispatch        |
| GET    | `/api/dispatch/ai-match` | AI-recommended workers |
| POST   | `/api/dispatch/ai-match` | Auto AI dispatch       |

</details>

<details>
<summary><b>⭐ Evaluation API</b></summary>

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| GET    | `/api/evaluations` | Get evaluations   |
| POST   | `/api/evaluations` | Submit evaluation |

</details>

---

## ⚙️ Environment Variables

<details>
<summary><b>🔧 Click to expand full configuration</b></summary>

```bash
# ==================== Database ====================
DATABASE_URL="postgresql://user:password@localhost:5432/flexhire"

# ==================== NextAuth ====================
NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# ==================== SMS (Aliyun) ====================
ALIYUN_ACCESS_KEY_ID="your-access-key-id"
ALIYUN_ACCESS_KEY_SECRET="your-access-key-secret"
ALIYUN_SMS_SIGN_NAME="FlexHire"
ALIYUN_SMS_TEMPLATE_CODE="SMS_XXXXXXXX"

# ==================== Payment ====================
# Stripe
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# WeChat Pay
WECHAT_PAY_APP_ID="wx1234567890"
WECHAT_PAY_MCH_ID="1234567890"
WECHAT_PAY_API_KEY="your-api-key"
WECHAT_PAY_NOTIFY_URL="https://your-domain.com/api/payment/webhook/wechat"

# Alipay
ALIPAY_APP_ID="2021000000000000"
ALIPAY_PRIVATE_KEY="your-private-key"
ALIPAY_PUBLIC_KEY="alipay-public-key"

# ==================== Maps (AMap) ====================
AMAP_WEB_KEY="your-amap-key"

# ==================== OAuth ====================
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# ==================== Push ====================
# JPush
JPUSH_APP_KEY="your-app-key"
JPUSH_MASTER_SECRET="your-master-secret"

# Firebase
FIREBASE_PROJECT_ID="your-project-id"

# ==================== Monitoring ====================
SENTRY_DSN="https://xxx@sentry.io/xxx"

# ==================== Redis (Optional) ====================
REDIS_URL="redis://localhost:6379"
```

</details>

---

## 🧪 Testing

```bash
# Unit tests
npm test

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/G3niusYukki/flex-platform)

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Import the repository, set Root Directory to `apps/web`
4. Add environment variables
5. Deploy!

### Docker

```bash
# Build
docker build -t flex-platform .

# Run
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

## 🤝 Contributing

We welcome all forms of contribution!

<div align="center">

[![Contributors Welcome](https://img.shields.io/badge/Contributors-Welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)
[![Good First Issues](https://img.shields.io/github/issues-search/G3niusYukki/flex-platform?query=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22&style=for-the-badge&label=Good%20First%20Issues)](https://github.com/G3niusYukki/flex-platform/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)

</div>

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📝 Changelog

| Version                                                                    | Date       | Description                                            |
| :------------------------------------------------------------------------- | :--------- | :----------------------------------------------------- |
| [v2.0.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v2.0.0) | 2026-02-27 | 🚀 Scale & Ecosystem (AI Agent, Performance, Open API) |
| [v1.4.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.4.0) | 2026-02-27 | 📋 Compliance & Monetization (KYC, E-sign, Invoice)    |
| [v1.3.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.3.0) | 2026-02-27 | ✨ Experience & AI (PWA, AI Matching, SSE)             |
| [v1.2.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.2.0) | 2026-02-27 | 💼 Core Business (Payment, Orders, Admin, Wallet)      |
| [v1.1.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.1.0) | 2026-02-27 | 🏗️ Infrastructure (Tests, Redis, Packages, CI/CD)      |
| [v1.0.0](https://github.com/G3niusYukki/flex-platform/releases/tag/v1.0.0) | 2026-02-09 | 🎉 Initial Release                                     |

See [CHANGELOG.md](CHANGELOG.md) for full history

---

## 👥 Contributors

Thanks to all contributors!

<a href="https://github.com/G3niusYukki/flex-platform/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=G3niusYukki/flex-platform&max=100" />
</a>

---

## ☕ Sponsor

If this project helps you, consider buying us a coffee ☕

<div align="center">

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge&logo=github)](https://github.com/sponsors/G3niusYukki)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-%E2%98%95-yellow?style=for-the-badge&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/g3niusyukki)

</div>

### Sponsors

<!-- Add sponsor logos here -->
<p align="center">
  <a href="https://github.com/sponsors/G3niusYukki">
    <img src="https://img.shields.io/badge/Become%20a%20Sponsor-%F0%9F%8E%89-blue?style=for-the-badge" alt="Sponsor"/>
  </a>
</p>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=G3niusYukki/flex-platform&type=Date)](https://star-history.com/#G3niusYukki/flex-platform&Date)

---

**Made with ❤️ by Humans & AI**

_AI-Driven · Flexible Hiring_

**If this project helps you, please give it a ⭐ Star!**

[![Stargazers repo roster for @G3niusYukki/flex-platform](https://reporoster.com/stars/G3niusYukki/flex-platform)](https://github.com/G3niusYukki/flex-platform/stargazers)

[⬆ Back to top](#-flexhire--ai-powered-flexible-workforce-platform)

</div>
