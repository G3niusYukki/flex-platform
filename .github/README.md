# GitHub Actions 部署配置

## 部署工作流

本项目包含两个自动部署工作流：

- `.github/workflows/deploy-web.yml` - 自动部署 Web 前端
- `.github/workflows/deploy-admin.yml` - 自动部署 Admin 后台

## 触发条件

- `main` 分支有推送时自动部署
- 手动触发 (`workflow_dispatch`)

## 配置步骤

### 1. 创建 Vercel 项目

```bash
# 部署 Web
cd apps/web
vercel

# 部署 Admin
cd apps/admin
vercel
```

### 2. 获取 Vercel 配置

```bash
# 查看项目列表和 ID
vercel projects list

# 查看组织 ID
vercel whoami --list
```

### 3. 添加 GitHub Secrets

在 GitHub 仓库 **Settings → Secrets and variables → Actions** 中添加：

| Secret Name               | Description            |
| ------------------------- | ---------------------- |
| `VERCEL_TOKEN`            | Vercel Access Token    |
| `VERCEL_ORG_ID`           | Vercel Organization ID |
| `VERCEL_PROJECT_ID_WEB`   | Web 项目 ID            |
| `VERCEL_PROJECT_ID_ADMIN` | Admin 项目 ID          |
| `NEXT_PUBLIC_API_URL`     | API 地址               |
| `DATABASE_URL`            | PostgreSQL 连接字符串  |
| `NEXTAUTH_URL`            | NextAuth 回调地址      |
| `NEXTAUTH_SECRET`         | NextAuth 密钥          |

### 4. 启用 GitHub Actions

1. 推送代码到 main 分支
2. 进入仓库 **Actions** 标签
3. 确认工作流已启用

### 5. 验证部署

部署完成后访问：

- Web: `https://[project-name].vercel.app`
- Admin: `https://[project-name]-admin.vercel.app`

## 手动触发部署

```bash
# 通过 GitHub CLI
gh workflow run deploy-web.yml

# 或在 GitHub Actions 页面手动触发
```

## 注意事项

- 确保 Vercel 项目已正确配置环境变量
- 数据库迁移需要在 Vercel 控制台手动运行
- 自定义域名可在 Vercel Dashboard 中配置
