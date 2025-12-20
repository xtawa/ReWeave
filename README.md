# ReWeave

**ReWeave** is a high-performance, static blog framework designed for aesthetics and speed.
**ReWeave** 是一个专为美学和速度设计的高性能静态博客框架。

## Philosophy / 设计理念

- **Performance First**: Zero client-side JavaScript by default.
  **性能优先**：默认零客户端 JavaScript。
- **Aesthetics**: Premium, minimalist design.
  **美学**：高端、极简的设计。
- **Arbitrary Stack**: Built with TypeScript, Vite, and Preact.
  **任意技术栈**：基于 TypeScript, Vite 和 Preact 构建。

## Getting Started / 快速开始

```bash
npm install
npm run dev
```

## Configuration / 配置

All site configurations are managed in `src/core/config.ts`.
所有网站配置都在 `src/core/config.ts` 中管理。

### Example Configuration / 配置示例

```typescript
export const config: SiteConfig = {
    // Basic Info / 基本信息
    title: "ReWeave Blog",
    description: "A high-performance static blog built with ReWeave.",
    language: "zh", // 'en' or 'zh'
    siteUrl: "https://example.com", // Base URL for RSS/Sitemap
    homePage: "hero", // 'hero' for personal card, 'posts' for article list

    // Theme Selection / 主题选择
    themeName: "weave",

    // Logo / 网站 Logo
    logo: {
        path: "logo.png", // Relative to public/ or absolute URL
        alt: "ReWeave Logo",
    },

    // Hero Page / 个人名片页 (Configured in src/core/hero.config.ts)
    // See src/core/hero.config.ts for detailed hero settings (name, role, bio, social, etc.)
    hero: {
        enabled: true,
        // ... other settings in hero.config.ts
    },

    // Social Links / 社交链接
    social: {
        twitter: "https://twitter.com/yourhandle",
        github: "https://github.com/yourhandle",
    },

    // Footer / 页脚配置
    footer: {
        copyright: "Your Name",
        icp: "京ICP备XXXXXXXX号",
    },

    // Table of Contents / 目录配置
    toc: {
        enabled: true,
        maxDepth: 3,
        position: 'right', // 'top', 'left', 'right'
        collapsible: true,
    },

    // Pages / 页面开关
    about: {
        enabled: true,
        file: "about.md", // Relative to src/pages/
        title: "About Me",
    },
    projects: {
        enabled: true,
        file: "projects.md",
        title: "My Projects",
    },

    // Theme Customization / 主题自定义
    theme: {
        primaryColor: "#14b8a6", // Teal-500
    },
};
```

### Key Features / 核心功能

- **Hero Page**: Premium personal card page as a configurable homepage.
- **RSS Feed**: Automatically generated at `/rss.xml`.
- **Sitemap**: Automatically generated at `/sitemap.xml`.
- **Stats Page**: Comprehensive statistics at `/stats.html`.
- **TOC**: Highly configurable Table of Contents with smooth scroll and active highlighting.
- **Theme Transition**: Smooth animation when switching between light and dark modes.
- **Glow Effects**: Premium hover animations on navigation items.
- **Git Version**: Automatic display of Git commit SHA in the footer.

## Content Management / 内容管理

### 1. Articles / 文章
- **Add**: Create a new `.md` file in `src/content/`.
  **新增**：在 `src/content/` 目录下创建一个新的 `.md` 文件。
- **Delete**: Simply remove the `.md` file from `src/content/`.
  **删除**：直接从 `src/content/` 目录中删除对应的 `.md` 文件。

### 2. Standalone Pages / 独立页面 (About, Projects)
- **Add/Modify**:
  1. Create or edit the `.md` file in `src/pages/`.
     在 `src/pages/` 中创建或编辑 `.md` 文件。
  2. Ensure it is enabled and correctly pointed to in `src/core/config.ts`.
     确保在 `src/core/config.ts` 中已启用并正确指向该文件。
- **Delete**: Set `enabled: false` in `src/core/config.ts` or remove the configuration entry.
  **删除**：在 `src/core/config.ts` 中设置 `enabled: false` 或移除相关配置项。

### 3. Navigation Links / 导航链接
- **Manage**: All navigation links are managed in `src/core/config.ts` under the `navbar.items` array.
  **管理**：所有导航链接都在 `src/core/config.ts` 的 `navbar.items` 数组中管理。
- **Sort**: Reorder the objects in the `items` array to change the display order.
  **排序**：通过调整 `items` 数组中对象的顺序来改变显示顺序。
- **Add/Delete**: Add or remove objects from the `items` array.
  **新增/删除**：在 `items` 数组中添加或移除对象。

## Performance Benchmarks / 性能测试

Build time performance on a standard machine:
标准机器上的构建时间性能：

| Posts (文章数) | Build Time (构建时间) |
|---|---|
| 50 | 5.67s |
| 100 | 6.62s |
| 250 | 6.52s |
| 500 | 7.27s |

*Tested with parallel processing enabled.*
*已启用并行处理测试。*

