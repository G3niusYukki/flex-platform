#!/bin/bash

echo "========================================="
echo "Vercel 自动部署配置脚本"
echo "========================================="

# 检查是否已安装 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "安装命令: npm i -g vercel"
    exit 1
fi

echo ""
echo "步骤 1: 获取 Vercel 配置信息"
echo "-----------------------------------"

# 获取 Token
echo "请访问 https://vercel.com/account/tokens 创建 Token"
echo "然后运行: vercel login"
vercel login 2>/dev/null || echo "跳过登录（如果已登录）"

# 获取 Organization ID 和 Project ID
echo ""
echo "获取项目配置..."

# 列出项目获取 ID
vercel projects list 2>/dev/null | grep -E "(flex-platform-web|flex-platform-admin)" || echo "未找到项目，请先在 Vercel Dashboard 创建项目"

echo ""
echo "========================================="
echo "步骤 2: GitHub Secrets 配置"
echo "========================================="
echo ""
echo "请在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加以下 Secrets:"
echo ""
echo "┌─────────────────────────────────────────┐"
echo "│ Secret Name                  │ 示例值  │"
echo "├─────────────────────────────────────────┤"
echo "│ VERCEL_TOKEN                 │ xxxxxx │"
echo "│ VERCEL_ORG_ID                │ xxxxxx │"
echo "│ VERCEL_PROJECT_ID_WEB        │ xxxxxx │"
echo "│ VERCEL_PROJECT_ID_ADMIN      │ xxxxxx │"
echo "│ NEXT_PUBLIC_API_URL         │ https://xxx.vercel.app │"
echo "│ DATABASE_URL                │ postgresql://... │"
echo "│ NEXTAUTH_URL                │ https://xxx.vercel.app │"
echo "│ NEXTAUTH_SECRET             │ xxxxxx │"
echo "└─────────────────────────────────────────┘"
echo ""
echo "获取方式:"
echo "1. VERCEL_TOKEN: https://vercel.com/account/tokens"
echo "2. VEREL_ORG_ID & PROJECT_ID: 运行 'vercel projects list' 或在项目 Settings 获取"
echo ""

# 生成 NextAuth Secret
echo "生成 NEXTAUTH_SECRET..."
NEXT_AUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET = $NEXT_AUTH_SECRET"
echo ""
echo "复制上面的命令输出，添加到 GitHub Secrets"
