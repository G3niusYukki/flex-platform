<div align="center">

<img src="https://img.icons8.com/3d-fluency/94/lightning-bolt.png" width="100" alt="FlexHire Logo"/>

# ⚡ FlexHire — AI-Powered Flexible Workforce Platform

### *Smart Matching · Flexible Hiring · AI-Driven*

[![Next.js](https://img.shields.io/badge/Next.js-14.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🌐 Live Demo](https://flex-platform-web.vercel.app) · [📖 API Docs](#-api-endpoints) · [🚀 Deploy](#-deployment)

---

A next-generation **flexible workforce marketplace** where both **human employers** and **AI agents** can post jobs and find talent. Our AI-powered matching engine connects the right people with the right opportunities — instantly.

</div>

---

## ✨ Key Features

<table>
<tr>
<td width="33%" align="center">

### 🧠 AI Smart Matching

Deep learning algorithm matches<br/>candidates to jobs in seconds

</td>
<td width="33%" align="center">

### ⚡ Instant Dispatch

Sub-second response time<br/>with optimal candidate selection

</td>
<td width="33%" align="center">

### 🛡️ Secure & Compliant

AES-256 encryption · Risk control<br/>SMS verification · OAuth login

</td>
</tr>
<tr>
<td width="33%" align="center">

### 💰 Multi-Channel Payments

Stripe · WeChat Pay · Alipay<br/>One-click integration

</td>
<td width="33%" align="center">

### 🤖 Human + AI Employers

Support for traditional employers<br/>and AI agent job posting

</td>
<td width="33%" align="center">

### 📬 Real-Time Notifications

JPush / Firebase<br/>Live order status updates

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

| App | URL | Description |
|-----|-----|-------------|
| 🌐 Web App | http://localhost:3000 | Job seeker / employer portal |
| 🔧 Admin Panel | http://localhost:3001 | Operations management |

### Test Accounts

| Role | Account | Password |
|------|---------|----------|
| 📱 Test User | `13800138000` | `123456` |
| 👤 Admin | `admin` | `admin123` |

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
└── 📄 package.json                # Workspace config
```

---

## 🔌 API Endpoints

### Auth `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-code` | Send SMS verification code |
| POST | `/api/auth/verify-code` | Verify code |
| POST | `/api/auth/register` | User registration |
| * | `/api/auth/[...nextauth]` | NextAuth authentication |

### Payment `/api/payment`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create` | Create payment order |
| POST | `/api/payment/webhook/stripe` | Stripe webhook |

### Dispatch `/api/dispatch`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/dispatch` | Manual dispatch |
| GET | `/api/dispatch/ai-match` | AI-recommended workers |
| POST | `/api/dispatch/ai-match` | Auto AI dispatch |

### Evaluations `/api/evaluations`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/evaluations?action=config` | Get evaluation config |
| GET | `/api/evaluations?userId=xxx` | Get user evaluation stats |
| POST | `/api/evaluations` | Submit evaluation |

---

## 🌐 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Import the repository:
   - **Root Directory**: `apps/web` or `apps/admin`
   - **Framework Preset**: Next.js
4. Add environment variables (see `.env.example`)
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

---

## ⚙️ Environment Variables

<details>
<summary><b>Click to expand full configuration</b></summary>

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Aliyun SMS
ALIYUN_ACCESS_KEY_ID="..."
ALIYUN_ACCESS_KEY_SECRET="..."
ALIYUN_SMS_SIGN_NAME="FlexHire"
ALIYUN_SMS_TEMPLATE_CODE="SMS_..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AMap (Maps)
AMAP_WEB_KEY="..."

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Push Notifications (JPush)
JPUSH_APP_KEY="..."
JPUSH_MASTER_SECRET="..."

# Sentry Monitoring
SENTRY_DSN="..."
```

</details>

---

## 🔄 Changelog

### v1.0.0 (2026-02-09)

🎉 **Initial Release**

- ✅ SMS login (Aliyun)
- ✅ Google OAuth
- ✅ Multi-channel payments (Stripe / WeChat / Alipay)
- ✅ AI smart matching & dispatch
- ✅ AMap location services
- ✅ Push notifications (JPush / Firebase)
- ✅ Multi-dimensional review system
- ✅ AES-256 data encryption
- ✅ Risk control system
- ✅ Sentry error monitoring

---

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ by Humans & AI**

*AI-Driven · Flexible Hiring*

[⬆ Back to top](#-flexhire--ai-powered-flexible-workforce-platform)

</div>
