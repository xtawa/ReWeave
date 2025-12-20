---
title: ReWeave Configuration Guide
date: 2025-12-23
excerpt: Complete guide to configuring your ReWeave blog theme and frontmatter options.
category: Tutorial
tags: [Configuration, Guide, ReWeave]
abbrlink: config-guide
---

# ReWeave Configuration Guide

This guide covers all configuration options available in ReWeave.

## Site Configuration

Edit `src/core/config.ts` to customize your blog.

### Basic Settings

```typescript
{
  title: "Your Blog Title",
  description: "A short description for SEO",
  language: "en", // or "zh" for Chinese
  themeName: "weave"
}
```

### Social Links

```typescript
{
  social: {
    twitter: "https://twitter.com/yourhandle",
    github: "https://github.com/yourusername"
  }
}
```

### Footer Configuration

```typescript
{
  footer: {
    copyright: "Your Name or Company",
    icp: "ICP备案号" // For Chinese websites
  }
}
```

### Theme Customization

```typescript
{
  theme: {
    primaryColor: "#000000" // Hex color code
  }
}
```

## Frontmatter Options

Each Markdown post supports the following frontmatter fields:

### Required Fields

```yaml
---
title: Your Post Title
date: 2025-12-23
---
```

### Optional Fields

#### SEO & Display

```yaml
excerpt: A short summary of your post
image: https://example.com/image.jpg
```

#### Organization

```yaml
category: Tutorial
tags: [tag1, tag2, tag3]
```

#### URL & Visibility

```yaml
abbrlink: custom-url-slug  # Use custom URL instead of filename
draft: true                 # Hide from production build
hide: true                  # Completely hide from all pages
```

## Frontmatter Field Reference

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | string | Post title (required) |
| `date` | string | Publication date in YYYY-MM-DD format (required) |
| `excerpt` | string | Short summary for SEO and post listings |
| `image` | string | Featured image URL for OpenGraph |
| `category` | string | Single category for the post |
| `tags` | array | List of tags |
| `abbrlink` | string | Custom URL slug (e.g., "my-post" → `/posts/my-post.html`) |
| `draft` | boolean | If `true`, post is excluded from build |
| `hide` | boolean | If `true`, post is completely hidden |

## Language Support

ReWeave supports English and Chinese out of the box.

### Switching Language

In `config.ts`:

```typescript
language: "zh"  // Chinese
// or
language: "en"  // English
```

### Translated UI Elements

- Navigation (Home, About, Projects)
- Post actions ("Read article" / "阅读文章")
- Category/Tag labels
- Footer text

## Draft vs Hide

### Draft Posts

```yaml
draft: true
```

- Excluded from production builds
- Useful for work-in-progress content
- Can be previewed locally during development

### Hidden Posts

```yaml
hide: true
```

- Completely excluded from all pages
- Not indexed in categories or tags
- Useful for archived or private content

## Custom URLs with Abbrlink

Instead of using the filename as the URL, you can specify a custom slug:

```yaml
---
title: My Awesome Post
abbrlink: awesome
---
```

This creates `/posts/awesome.html` instead of `/posts/my-awesome-post.html`.

## Example: Complete Frontmatter

```yaml
---
title: Getting Started with ReWeave
date: 2025-12-23
excerpt: Learn how to set up and configure your ReWeave blog.
image: https://example.com/reweave-cover.jpg
category: Tutorial
tags: [Getting Started, Configuration, ReWeave]
abbrlink: getting-started
draft: false
hide: false
---
```

## Performance Tips

1. **Use abbrlink** for shorter, cleaner URLs
2. **Mark drafts** to exclude unfinished posts from builds
3. **Optimize images** before adding them to posts
4. **Use categories** to organize content logically

## Next Steps

- Read the [Performance Report](/posts/performance-report.html)
- Explore [Rich Text Features](/posts/rich-text-demo.html)
- Check the [Testing Checklist](/CHECKLIST.md)
