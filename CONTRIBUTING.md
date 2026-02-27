<div align="center">

# 🤝 Contributing to FlexHire

**Thank you for considering contributing to FlexHire!**

We welcome all forms of contribution, whether new features, bug fixes, documentation improvements, or suggestions.

<img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" alt="PRs Welcome"/>
<img src="https://img.shields.io/badge/Contributors-All_Welcome-blue?style=for-the-badge" alt="Contributors Welcome"/>

</div>

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Process](#-development-process)
- [Code Standards](#-code-standards)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)

---

## 🌟 Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md) code of conduct. By participating, you agree to abide by its terms.

---

## 🚀 How Can I Contribute?

### Reporting Bugs

Before submitting a bug report, please:

1. Check if the issue already exists in [Issues](https://github.com/G3niusYukki/flex-platform/issues)
2. Confirm you're using the latest version
3. Collect the following information:
   - OS and version
   - Node.js version
   - Browser version (if applicable)
   - Steps to reproduce
   - Expected vs actual behavior

### Suggesting Features

We welcome feature suggestions! Please provide:

- Feature description
- Use cases
- Possible implementation approach (optional)

### Improving Documentation

Documentation improvements include:

- Fixing spelling or grammar errors
- Adding missing documentation
- Improving clarity of existing docs

---

## 💻 Development Process

### 1. Fork & Clone

```bash
# After forking, clone your repository
git clone https://github.com/<your-username>/flex-platform.git
cd flex-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Local Development

```bash
# Configure environment variables
cp .env.example apps/web/.env

# Initialize database
cd apps/web
npx prisma db push
npx ts-node prisma/seed.ts

# Start dev server
npm run dev
```

### 5. Run Tests

```bash
# Unit tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## 📏 Code Standards

### TypeScript

- Write all new code in TypeScript
- Avoid `any`, prefer specific types
- Add JSDoc comments for public APIs

### React

- Use function components and Hooks
- Use PascalCase for component names
- Use kebab-case for file names

### Styling

- Use Tailwind CSS
- Follow existing design system

### Code Formatting

Project uses ESLint and Prettier:

```bash
# Check code style
npm run lint

# Auto-fix
npm run lint:fix
```

---

## 📝 Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description   | Example                                     |
| ---------- | ------------- | ------------------------------------------- |
| `feat`     | New feature   | `feat(auth): add OAuth login`               |
| `fix`      | Bug fix       | `fix(payment): resolve stripe webhook`      |
| `docs`     | Documentation | `docs: update installation guide`           |
| `style`    | Code format   | `style: format code`                        |
| `refactor` | Code refactor | `refactor(ai): optimize matching algorithm` |
| `perf`     | Performance   | `perf(api): reduce response time`           |
| `test`     | Testing       | `test(dispatch): add unit tests`            |
| `chore`    | Build/tools   | `chore: update dependencies`                |

### Scopes

- `auth` - Authentication
- `payment` - Payment
- `dispatch` - Dispatch
- `api` - API
- `ui` - UI components
- `db` - Database
- `admin` - Admin panel

---

## 🔀 Pull Request Process

### Pre-submission Checklist

- [ ] Code passes all tests `npm test`
- [ ] Code passes lint `npm run lint`
- [ ] Code passes type check `npm run typecheck`
- [ ] Documentation updated
- [ ] Commit messages follow guidelines

### PR Title Format

```
<type>(<scope>): <description>
```

Examples:

- `feat(auth): add WeChat OAuth login`
- `fix(payment): resolve duplicate charge issue`

### PR Description Template

```markdown
## Type of Change

- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 📝 Documentation update
- [ ] 🔨 Refactor
- [ ] 🎨 Style update
- [ ] ⚡ Performance optimization

## Description

Brief description of your changes...

## Related Issue

Closes #xxx

## Testing

How to test these changes...

## Screenshots (if applicable)
```

### Review Process

1. After PR submission, CI runs tests automatically
2. At least 1 maintainer approval required
3. After resolving all review comments, maintainer will merge PR

---

## 🏆 Contributors

Thanks to all contributors!

<a href="https://github.com/G3niusYukki/flex-platform/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=G3niusYukki/flex-platform" />
</a>

---

## ❓ Need Help?

- 💬 [GitHub Discussions](https://github.com/G3niusYukki/flex-platform/discussions)
- 🐛 [Issue Tracker](https://github.com/G3niusYukki/flex-platform/issues)
- 📧 Email: support@flexhire.com

---

<div align="center">

**Thanks again for your contribution! ❤️**

[⬆ Back to top](#-contributing-to-flexhire)

</div>
