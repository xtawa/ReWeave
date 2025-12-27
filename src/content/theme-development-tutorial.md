---
title: ReWeave 主题开发教程：打造你的专属美学
date: 2025-12-20
excerpt: 深入了解 ReWeave 的主题系统，学习如何从零开始构建一个高性能、高颜值的静态博客主题。
category: 教程
tags: [ReWeave, 主题开发, TypeScript, Preact]
---

# ReWeave 主题开发教程

ReWeave 是一个基于 **TypeScript + Preact + TailwindCSS** 构建的高性能静态博客框架。它的核心理念是“美学与速度并重”。本教程将带你深入了解 ReWeave 的主题架构，并教你如何开发自己的主题。

## 1. 主题架构概览

ReWeave 的主题存储在 `src/themes/` 目录下。每个主题都是一个独立的文件夹。以默认主题 `weave` 为例，其结构如下：

```text
src/themes/weave/
├── components/       # 可复用组件 (Header, Footer, Hero, TOC 等)
├── layouts/          # 页面布局 (Layout.tsx)
└── styles/           # 主题特有样式 (可选)
```
注：主题配置文件需配置在 `src\config\ThemeName.config.ts` 中。

## 2. 核心组件开发

### Layout (布局)
`Layout.tsx` 是所有页面的外壳，负责渲染 `<html>`, `<head>` 和 `<body>`。

```tsx
/** @jsx h */
import { h, ComponentChildren } from 'preact';
import { config } from '../../../core/config';

export function Layout({ title, children }: { title?: string, children: ComponentChildren }) {
    const pageTitle = title ? `${title} | ${config.title}` : config.title;
    return (
        <html lang={config.language}>
            <head>
                <title>{pageTitle}</title>
                <link rel="icon" type="image/png" href="/logo.png" />
                <link rel="stylesheet" href="/style.css" />
            </head>
            <body class="bg-white dark:bg-zinc-900 transition-colors">
                {children}
            </body>
        </html>
    );
}
```

### Hero (个人名片)
Hero 组件是 ReWeave 的一大特色，它允许你创建一个极具个性化的首页。

- **配置驱动**：通过 `src/core/hero.config.ts` 进行配置。
- **动画支持**：利用 TailwindCSS 或原生 CSS 添加动画（如 `animate-wave`）。

## 3. 样式系统

ReWeave 使用 **TailwindCSS** 进行样式管理。全局样式位于 `src/style.css`，你可以在其中定义自定义动画和复杂的过渡效果。

### 主题切换动画
ReWeave 支持平滑的深色/浅色模式切换动画。通过在切换时临时添加 `.theme-transition` 类来实现：

```css
.theme-transition, .theme-transition * {
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out !important;
}
```

## 4. 目录 (TOC) 增强

一个优秀的主题需要良好的阅读体验。ReWeave 的 TOC 支持：
- **自动 ID 生成**：基于 `rehype-slug`。
- **平滑滚动**：`scroll-behavior: smooth`。
- **实时高亮**：通过客户端脚本监听滚动事件。
- **折叠动画**：使用 `max-height` 和 `opacity` 实现平滑展开。

## 5. 开发流程

1. **创建文件夹**：在 `src/themes/` 下新建你的主题文件夹。
2. **实现组件**：至少需要实现 `Header`, `Footer`, `Hero` 和 `Layout`。
3. **配置切换**：在 `src/core/config.ts` 中修改 `themeName` 为你的主题名。
4. **预览**：运行 `npm run dev` 进行实时预览。

## 6. 最佳实践

- **性能优先**：尽量减少客户端 JavaScript 的使用。
- **响应式设计**：确保在移动端也有完美的显示效果。
- **语义化 HTML**：使用正确的 HTML5 标签以利于 SEO。

通过本教程，你应该已经对 ReWeave 的主题开发有了全面的了解。现在，开始动手打造你的专属主题吧！
