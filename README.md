# 许文涛的博客

基于 [Astro](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/) 构建的[个人网站](https://alvinhui.github.io)。

## 本地开发

### 环境要求

- [Node.js](https://nodejs.org/) >= 18

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问 http://localhost:4321 预览网站。

### 构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。

> testing!!!