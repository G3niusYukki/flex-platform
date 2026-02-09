<div align="center">

# 🤖 AI 智能雇佣平台

**人类，是时候为 AI 工作了**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🌐 在线演示](https://flex-platform.vercel.app) · [📖 文档](#功能特性) · [🚀 快速开始](#快速开始)

</div>

---

## ✨ 项目简介

**AI 智能雇佣平台**是一个创新的灵活用工解决方案，以"AI 雇佣人类"为核心概念，利用智能算法实现人岗精准匹配、秒级派单调度。平台连接企业用工需求与灵活就业者，提供从发布需求、智能匹配、实时派单到薪酬结算的全流程数字化服务。

### 🎯 核心亮点

- **🧠 神经网络匹配** - 深度学习算法，精准匹配人岗需求
- **⚡ AI 秒速派单** - 毫秒级响应，智能调度最优人选  
- **🛡️ AI 合规监控** - 24/7 智能风控，保障双方权益
- **💰 智能薪酬核算** - 自动化结算，透明高效零误差

---

## 🏗️ 技术架构

```
flex-platform/
├── apps/
│   ├── web/          # 用户端 (Next.js 14)
│   └── admin/        # 管理后台 (Next.js 14)
├── packages/         # 共享包
├── prisma/           # 数据库 Schema
└── docker-compose.yml
```

### 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **UI 组件** | Radix UI, Shadcn/UI, Lucide Icons |
| **状态管理** | Zustand, React Query |
| **后端** | Next.js API Routes, NextAuth.js |
| **数据库** | PostgreSQL, Prisma ORM |
| **部署** | Vercel, Supabase, Docker |

---

## 📦 功能模块

### 👤 用户端 (Web)

- **首页** - AI 主题科技风设计，实时派单统计
- **职位浏览** - 筛选、搜索、地图定位
- **一键接单** - 快速报名，AI 智能推荐
- **个人中心** - 资料管理、订单历史、收益统计
- **实名认证** - 身份验证、健康证上传

### 🔧 管理后台 (Admin)

- **数据仪表盘** - 实时统计、图表可视化
- **订单管理** - 全流程订单跟踪
- **用户管理** - 审核、封禁、权限控制
- **智能派单** - 手动/自动派单、调度策略
- **财务管理** - 结算、提现审核

### 📊 数据模型

```
用户 (User) ─────┬──── 工人档案 (WorkerProfile)
                 └──── 雇主档案 (EmployerProfile)

订单 (Order) ────┬──── 派单记录 (DispatchRecord)
                 ├──── 评价 (Evaluation)
                 └──── 交易 (Transaction)

钱包 (Wallet) ───┬──── 交易记录
                 └──── 提现记录
```

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 14+ (或 Supabase)
- pnpm / npm

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/G3niusYukki/flex-platform.git
cd flex-platform

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入数据库连接等配置

# 4. 初始化数据库
cd apps/web
npx prisma db push
npx ts-node prisma/seed.ts

# 5. 启动开发服务器
npm run dev
```

### 访问地址

- **用户端**: http://localhost:3000
- **管理后台**: http://localhost:3001

### 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 测试用户 | `13800138000` | `123456` |
| 管理员 | `admin` | `admin123` |

---

## 🌐 部署指南

### Vercel 部署

1. Fork 本仓库到你的 GitHub
2. 在 Vercel 创建新项目，导入仓库
3. 设置 Root Directory 为 `apps/web` 或 `apps/admin`
4. 配置环境变量：
   - `DATABASE_URL` - PostgreSQL 连接字符串
   - `NEXTAUTH_SECRET` - 认证密钥
   - `NEXTAUTH_URL` - 部署后的 URL
5. 点击 Deploy

### Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

---

## 📁 项目结构

```
apps/web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (main)/       # 主要页面
│   │   │   ├── page.tsx  # 首页
│   │   │   ├── jobs/     # 职位列表
│   │   │   └── ...
│   │   └── api/          # API 路由
│   ├── components/       # React 组件
│   │   └── ui/           # UI 基础组件
│   └── lib/              # 工具函数
├── prisma/
│   ├── schema.prisma     # 数据库模型
│   └── seed.ts           # 种子数据
└── public/               # 静态资源
```

---

## 🔧 开发命令

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 类型检查
npm run lint

# 数据库操作
npx prisma studio      # 可视化数据库
npx prisma db push     # 同步 Schema
npx prisma generate    # 生成 Client
```

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

<div align="center">

**Made with ❤️ by AI & Humans**

*让 AI 为人类创造更多可能*

</div>
