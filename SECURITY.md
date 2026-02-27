<div align="center">

# 🛡️ Security Policy

**安全是我们最重要的优先事项。**

如果你发现任何安全漏洞，请负责任地披露。

</div>

---

## 🔒 支持的版本

我们为以下版本提供安全更新：

| Version | Supported         |
| ------- | ----------------- |
| 2.0.x   | ✅ Active support |
| 1.4.x   | ✅ Security fixes |
| 1.3.x   | ⚠️ End of life    |
| < 1.3   | ❌ Not supported  |

---

## 🚨 报告漏洞

**请不要通过公开 Issue 报告安全漏洞。**

### 报告方式

1. **GitHub Security Advisories** (推荐)

   访问 [Security Advisories](https://github.com/G3niusYukki/flex-platform/security/advisories/new) 提交报告

2. **Email**

   发送邮件至: `security@flexhire.com`

   请在邮件主题中包含 `[Security]` 前缀

### 报告内容

请包含以下信息：

- 漏洞描述
- 复现步骤
- 影响范围
- 可能的修复方案（可选）
- 你的联系方式

### 响应时间

- **确认收到**: 24 小时内
- **初步评估**: 3 个工作日内
- **修复时间**: 根据严重程度
  - 🔴 Critical: 24-48 小时
  - 🟠 High: 7 天
  - 🟡 Medium: 14 天
  - 🟢 Low: 30 天

---

## 🏆 安全致谢

我们感谢以下安全研究人员：

<!--
| 姓名 | 发现的漏洞 | 日期 |
|------|-----------|------|
| @username | XSS in profile | 2024-01-01 |
-->

_成为第一个上榜的贡献者！_

---

## 📋 安全最佳实践

### 部署安全

- [ ] 使用强密码和密钥
- [ ] 启用 HTTPS
- [ ] 配置 CORS 策略
- [ ] 定期更新依赖
- [ ] 启用日志监控

### 环境变量

```bash
# 必须使用强密钥
NEXTAUTH_SECRET=your-strong-secret-here  # 至少 32 字符

# 数据库连接使用 SSL
DATABASE_URL=postgresql://...?sslmode=require

# 不要提交敏感信息到版本控制
```

### API 安全

- 所有 API 端点都需要认证
- 敏感操作需要二次验证
- 实施请求速率限制
- 验证所有用户输入

---

## 🔐 安全功能

FlexHire 内置以下安全功能：

| 功能            | 说明              |
| --------------- | ----------------- |
| 🔒 AES-256 加密 | 敏感数据加密存储  |
| 🛡️ CSRF 保护    | NextAuth 内置保护 |
| 🔑 OAuth 2.0    | 安全的第三方登录  |
| 📱 短信验证     | 手机号验证        |
| 🚦 风控系统     | 异常行为检测      |
| 📊 Sentry 监控  | 实时错误追踪      |

---

<div align="center">

**感谢你帮助保持 FlexHire 安全！ 🙏**

[⬆ 返回顶部](#-security-policy)

</div>
