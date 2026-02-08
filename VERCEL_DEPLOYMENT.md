# Vercel 部署指南

本项目包含两个 Next.js 应用：

- **Web 前端**: `apps/web` - 用户界面
- **Admin 后台**: `apps/admin` - 管理后台

## 前置准备

1. **Vercel 账号**: https://vercel.com 注册账号
2. **数据库**: 推荐使用 Supabase、Neon 或 Railway 的 PostgreSQL
3. **Redis**: 推荐使用 Upstash (Vercel KV)

## 部署步骤

### 1. 创建 Vercel 项目

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署 Web 前端
cd apps/web
vercel --prod
```

### 2. 通过 Vercel Dashboard 部署

#### 部署 Web 前端

1. 访问 https://vercel.com/new
2. 导入 GitHub 仓库
3. 配置设置：
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `out`
4. 添加环境变量（见下方）
5. 点击 Deploy

#### 部署 Admin 后台

1. 重复上述步骤
2. Root Directory: `apps/admin`
3. 添加对应的环境变量

### 3. 环境变量配置

在 Vercel 项目的 **Settings → Environment Variables** 中添加：

#### Web 前端 (`apps/web`)

| 变量名                | 值                       | 类型       |
| --------------------- | ------------------------ | ---------- |
| `DATABASE_URL`        | `postgresql://...`       | Production |
| `NEXTAUTH_URL`        | `https://xxx.vercel.app` | Production |
| `NEXTAUTH_SECRET`     | `你的密钥`               | Secret     |
| `REDIS_URL`           | `redis://...`            | Production |
| `NEXT_PUBLIC_API_URL` | `https://xxx.vercel.app` | Production |

#### Admin 后台 (`apps/admin`)

| 变量名            | 值                             | 类型       |
| ----------------- | ------------------------------ | ---------- |
| `DATABASE_URL`    | `postgresql://...`             | Production |
| `NEXTAUTH_URL`    | `https://xxx-admin.vercel.app` | Production |
| `NEXTAUTH_SECRET` | `你的密钥`                     | Secret     |

### 4. 生成 NEXTAUTH_SECRET

```bash
# 方法1: 使用 OpenSSL
openssl rand -base64 32

# 方法2: 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法3: 使用 npm 依赖
npx next-auth secret
```

### 5. 数据库设置

#### 选项 A: Supabase (推荐)

1. 创建 Supabase 项目: https://supabase.com
2. 获取 `DATABASE_URL`:
   ```
   postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres
   ```
3. 运行迁移:
   ```bash
   npx prisma migrate deploy
   ```

#### 选项 B: Neon

1. 创建 Neon 项目: https://neon.tech
2. 获取连接字符串
3. 在 Vercel 中配置

### 6. 验证部署

部署完成后访问：

- Web 前端: `https://[project-name].vercel.app`
- Admin 后台: `https://[project-name]-admin.vercel.app`

## 域名配置 (可选)

### 添加自定义域名

1. Vercel Dashboard → 项目 → Settings → Domains
2. 添加你的域名
3. 配置 DNS 记录

### 配置子域名

```bash
# Web: www.example.com → apps/web
# Admin: admin.example.com → apps/admin
```

## 常见问题

### 1. 构建失败

- 检查环境变量是否完整
- 确保 `DATABASE_URL` 格式正确
- 查看 Vercel 构建日志

### 2. 数据库连接失败

- 确保 IP 白名单包含 Vercel 的 IP
- 使用连接池模式的 URL

### 3. 样式丢失

- 确认 `globals.css` 已正确引入
- 检查 Tailwind 配置

### 4. API 路由 404

- 确认使用了正确的 API 路径
- 检查 Vercel Functions 配置

## 监控与日志

- **Vercel Dashboard**: 查看构建状态、函数日志
- **Function Logs**: 实时查看 API 请求日志
- **Speed Insight**: 监控页面性能

## 自动化部署

配置 GitHub Actions 实现自动部署：

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

## 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署](https://nextjs.org/docs/deployment)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
