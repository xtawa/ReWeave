---
title: ReWeave 配置指南：全方位定制你的博客
date: 2025-12-23
excerpt: 完整介绍 ReWeave 博客框架的配置选项，包括站点信息、主题定制、名片页设置及目录功能。
category: 教程
tags: [配置, 指南, ReWeave]
abbrlink: config-guide
---
Sample Article
# ReWeave 配置指南

本指南涵盖了 ReWeave 中所有可用的配置选项。

## 1. 站点全局配置

编辑 `src/core/config.ts` 来自定义你的博客。

### 基本设置

```typescript
{
  title: "ReWeave Blog",
  description: "专为美学和速度设计的高性能静态博客框架。",
  language: "zh", // 'en' 或 'zh'
  siteUrl: "https://example.com", // 用于生成 RSS 和 Sitemap 的基础 URL
  homePage: "hero", // 'hero' (名片页) 或 'posts' (文章列表页)
  themeName: "weave"
}
```

### 社交链接与页脚

```typescript
{
  social: {
    twitter: "https://twitter.com/yourhandle",
    github: "https://github.com/yourusername"
  },
  footer: {
    copyright: "ReWeave Labs",
    icp: "京ICP备XXXXXXXX号" // 可选，中国备案号
  }
}
```

### 目录 (TOC) 配置

```typescript
{
  toc: {
    enabled: true,
    maxDepth: 3,
    position: 'right', // 'top', 'left', 'right'
    collapsible: true, // 是否允许折叠
  }
}
```

## 2. 个人名片页配置 (Hero)

名片页配置已独立到 `src/core/hero.config.ts`，方便管理个人信息。

```typescript
export const heroConfig: HeroConfig = {
    enabled: true,
    name: "Innei",
    role: "NodeJS Full Stack",
    description: "An independent developer coding with love.",
    avatar: "logo.png",
    social: {
        github: "https://github.com/innei",
        twitter: "https://twitter.com/_innei",
        email: "mailto:i@innei.ren",
        bilibili: "https://space.bilibili.com/26578164",
        netease: "https://music.163.com/#/user/home?id=63035382",
        telegram: "https://t.me/innei_ren",
        rss: true,
    },
};
```

## 3. 文章 Frontmatter 选项

每个 Markdown 文章都支持以下 frontmatter 字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `title` | string | 文章标题 (必填) |
| `date` | string | 发布日期 YYYY-MM-DD (必填) |
| `excerpt` | string | 摘要，用于 SEO 和列表显示 |
| `image` | string | 封面图 URL |
| `category` | string | 文章分类 |
| `tags` | array | 标签列表 |
| `abbrlink` | string | 自定义 URL 路径 (例如 `my-post`) |
| `draft` | boolean | 是否为草稿 (不参与构建) |
| `hide` | boolean | 是否在列表中隐藏 |
| `pin` | boolean | 是否置顶文章 (置顶文章会显示图钉图标) |

## 4. 分页配置

在 `src/core/config.ts` 中可以配置每页显示的文章数量：

```typescript
{
  pagination: {
    pageSize: 15,
  }
}
```

## 5. 自动化功能与特性

ReWeave 会在构建时自动生成以下文件并提供以下特性：
- **Clean URLs**: 所有页面均通过目录结构生成（如 `/posts/my-post/index.html`），访问时无需带 `.html` 后缀。
- **中文路径支持**: 自动处理非 ASCII 字符，确保中文文件名或 `abbrlink` 在各种环境下都能正常访问。
- **RSS Feed**: `/rss.xml` (包含最近 20 篇文章)
- **Sitemap**: `/sitemap.xml` (包含所有页面)
- **统计页面**: `/stats` (字数、标签云、时间轴)

## 6. 最佳实践

1. **配置 siteUrl**：确保 RSS 和 Sitemap 中的链接正确。
2. **使用 abbrlink**：创建更短、更美观的 URL。
3. **开启 TOC**：为长文章提供更好的阅读体验。
4. **定制 Hero**：在 `hero.config.ts` 中展示你的个人风采。

---

## 下一步

- 阅读 [主题开发教程](/posts/theme-development-tutorial)
- 查看 [性能报告](/posts/performance-report)
- 探索 [富文本演示](/posts/rich-text-demo)
