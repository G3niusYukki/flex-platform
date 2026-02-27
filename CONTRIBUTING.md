<div align="center">

# 🤝 Contributing to FlexHire

**感谢你考虑为 FlexHire 做贡献！**

我们欢迎所有形式的贡献，无论是新功能、Bug 修复、文档改进还是建议。

<img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" alt="PRs Welcome"/>
<img src="https://img.shields.io/badge/Contributors-All_Welcome-blue?style=for-the-badge" alt="Contributors Welcome"/>

</div>

---

## 📋 目录

- [行为准则](#-行为准则)
- [我能如何贡献？](#-我能如何贡献)
- [开发流程](#-开发流程)
- [代码规范](#-代码规范)
- [提交规范](#-提交规范)
- [Pull Request 流程](#-pull-request-流程)

---

## 🌟 行为准则

本项目采用 [Contributor Covenant](CODE_OF_CONDUCT.md) 行为准则。参与本项目即表示你同意遵守其条款。

---

## 🚀 我能如何贡献？

### 报告 Bug

在提交 Bug 报告前，请先：

1. 检查 [Issues](https://github.com/G3niusYukki/flex-platform/issues) 中是否已有相同问题
2. 确认你使用的是最新版本
3. 收集以下信息：
   - 操作系统和版本
   - Node.js 版本
   - 浏览器版本（如适用）
   - 复现步骤
   - 预期行为 vs 实际行为

### 建议新功能

我们欢迎新功能建议！请提供：

- 功能描述
- 使用场景
- 可能的实现方式（可选）

### 改进文档

文档改进包括但不限于：

- 修正拼写或语法错误
- 添加缺失的文档
- 改进现有文档的清晰度

---

## 💻 开发流程

### 1. Fork & Clone

```bash
# Fork 后 clone 你的仓库
git clone https://github.com/<your-username>/flex-platform.git
cd flex-platform
```

### 2. 安装依赖

```bash
npm install
```

### 3. 创建分支

```bash
git checkout -b feat/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 4. 本地开发

```bash
# 配置环境变量
cp .env.example apps/web/.env

# 初始化数据库
cd apps/web
npx prisma db push
npx ts-node prisma/seed.ts

# 启动开发服务器
npm run dev
```

### 5. 运行测试

```bash
# 单元测试
npm test

# 类型检查
npm run typecheck

# Lint
npm run lint
```

---

## 📏 代码规范

### TypeScript

- 使用 TypeScript 编写所有新代码
- 避免使用 `any`，优先使用具体类型
- 为公共 API 添加 JSDoc 注释

### React

- 使用函数组件和 Hooks
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

### 样式

- 使用 Tailwind CSS
- 遵循现有的设计系统

### 代码格式化

项目使用 ESLint 和 Prettier：

```bash
# 检查代码风格
npm run lint

# 自动修复
npm run lint:fix
```

---

## 📝 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Type 类型

| Type       | 说明      | 示例                                        |
| ---------- | --------- | ------------------------------------------- |
| `feat`     | 新功能    | `feat(auth): add OAuth login`               |
| `fix`      | Bug 修复  | `fix(payment): resolve stripe webhook`      |
| `docs`     | 文档更新  | `docs: update installation guide`           |
| `style`    | 代码格式  | `style: format code`                        |
| `refactor` | 代码重构  | `refactor(ai): optimize matching algorithm` |
| `perf`     | 性能优化  | `perf(api): reduce response time`           |
| `test`     | 测试相关  | `test(dispatch): add unit tests`            |
| `chore`    | 构建/工具 | `chore: update dependencies`                |

### Scope 范围

- `auth` - 认证相关
- `payment` - 支付相关
- `dispatch` - 派单相关
- `api` - API 相关
- `ui` - UI 组件
- `db` - 数据库相关
- `admin` - 管理后台

---

## 🔀 Pull Request 流程

### 提交前检查清单

- [ ] 代码通过所有测试 `npm test`
- [ ] 代码通过 Lint 检查 `npm run lint`
- [ ] 代码通过类型检查 `npm run typecheck`
- [ ] 更新了相关文档
- [ ] 提交信息遵循规范

### PR 标题格式

```
<type>(<scope>): <description>
```

示例：

- `feat(auth): add WeChat OAuth login`
- `fix(payment): resolve duplicate charge issue`

### PR 描述模板

```markdown
## 变更类型

- [ ] 🐛 Bug 修复
- [ ] ✨ 新功能
- [ ] 📝 文档更新
- [ ] 🔨 重构
- [ ] 🎨 样式更新
- [ ] ⚡ 性能优化

## 描述

简要描述你的更改...

## 相关 Issue

Closes #xxx

## 测试

描述如何测试这些更改...

## 截图（如适用）
```

### Review 流程

1. 提交 PR 后，CI 会自动运行测试
2. 至少需要 1 位维护者审核通过
3. 解决所有 review 意见后，维护者会合并 PR

---

## 🏆 贡献者

感谢所有贡献者！

<a href="https://github.com/G3niusYukki/flex-platform/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=G3niusYukki/flex-platform" />
</a>

---

## ❓ 需要帮助？

- 💬 [GitHub Discussions](https://github.com/G3niusYukki/flex-platform/discussions)
- 🐛 [Issue Tracker](https://github.com/G3niusYukki/flex-platform/issues)
- 📧 Email: support@flexhire.com

---

<div align="center">

**再次感谢你的贡献！ ❤️**

[⬆ 返回顶部](#-contributing-to-flexhire)

</div>
