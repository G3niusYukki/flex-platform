<div align="center">

# 🛡️ Security Policy

**Security is our top priority.**

If you discover any security vulnerability, please disclose it responsibly.

</div>

---

## 🔒 Supported Versions

We provide security updates for the following versions:

| Version | Supported         |
| ------- | ----------------- |
| 2.0.x   | ✅ Active support |
| 1.4.x   | ✅ Security fixes |
| 1.3.x   | ⚠️ End of life    |
| < 1.3   | ❌ Not supported  |

---

## 🚨 Reporting a Vulnerability

**Please do not report security vulnerabilities through public Issues.**

### Reporting Methods

1. **GitHub Security Advisories** (Recommended)

   Visit [Security Advisories](https://github.com/G3niusYukki/flex-platform/security/advisories/new) to submit a report

2. **Email**

   Send to: `security@flexhire.com`

   Please include `[Security]` prefix in the subject line

### Report Contents

Please include:

- Vulnerability description
- Steps to reproduce
- Impact scope
- Possible fix (optional)
- Your contact information

### Response Time

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 3 business days
- **Fix Timeline**: Based on severity
  - 🔴 Critical: 24-48 hours
  - 🟠 High: 7 days
  - 🟡 Medium: 14 days
  - 🟢 Low: 30 days

---

## 🏆 Security Acknowledgments

We thank the following security researchers:

<!--
| Name | Vulnerability Found | Date |
|------|---------------------|------|
| @username | XSS in profile | 2024-01-01 |
-->

_Be the first to be listed!_

---

## 📋 Security Best Practices

### Deployment Security

- [ ] Use strong passwords and keys
- [ ] Enable HTTPS
- [ ] Configure CORS policy
- [ ] Update dependencies regularly
- [ ] Enable log monitoring

### Environment Variables

```bash
# Must use strong keys
NEXTAUTH_SECRET=your-strong-secret-here  # At least 32 characters

# Database connection with SSL
DATABASE_URL=postgresql://...?sslmode=require

# Do not commit sensitive information
```

### API Security

- All API endpoints require authentication
- Sensitive operations require 2FA
- Implement rate limiting
- Validate all user input

---

## 🔐 Security Features

FlexHire includes the following security features:

| Feature               | Description                      |
| --------------------- | -------------------------------- |
| 🔒 AES-256 Encryption | Sensitive data encrypted at rest |
| 🛡️ CSRF Protection    | Built-in NextAuth protection     |
| 🔑 OAuth 2.0          | Secure third-party login         |
| 📱 SMS Verification   | Phone number verification        |
| 🚦 Risk Control       | Anomaly behavior detection       |
| 📊 Sentry Monitoring  | Real-time error tracking         |

---

<div align="center">

**Thank you for helping keep FlexHire secure! 🙏**

[⬆ Back to top](#-security-policy)

</div>
