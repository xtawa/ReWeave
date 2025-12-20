---
title: 富文本功能演示：Markdown 的极致体验
date: 2025-12-22
excerpt: 演示 ReWeave 支持的语法高亮、Mermaid 图表、GFM 表格以及增强的目录功能。
category: 教程
tags: [Markdown, 功能, 演示]
---

# 富文本功能演示

ReWeave 提供了丰富的 Markdown 扩展功能，让你的内容表达更加生动。

## 1. 语法高亮

我们集成了 `rehype-highlight`，并默认使用 `github-dark` 主题。

```typescript
// TypeScript 示例
interface User {
  id: number;
  name: string;
}

function greet(user: User) {
  console.log(`Hello, ${user.name}!`);
}
```

```python
# Python 示例
def fib(n):
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a+b
    print()
```

## 2. Mermaid 图表

原生支持 [Mermaid](https://mermaid.js.org/) 图表，无需额外插件。

<div class="mermaid">
graph TD
    A[开始] --> B{是否运行中?}
    B -- 是 --> C[太棒了!]
    B -- 否 --> D[调试]
    D --> B
</div>

<div class="mermaid">
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!
</div>

## 3. GFM 表格

| 功能 | 支持情况 | 备注 |
| :--- | :---: | :--- |
| **加粗** | ✅ | 标准 Markdown |
| *斜体* | ✅ | 标准 Markdown |
| `代码` | ✅ | 行内代码 |
| 表格 | ✅ | 通过 `remark-gfm` |
| Mermaid | ✅ | 客户端 JS 渲染 |

## 4. 增强的目录功能 (TOC)

本页面右侧（或上方）的目录具有以下特性：
- **平滑滚动**：点击链接平滑跳转到对应章节。
- **自动高亮**：滚动时自动高亮当前阅读的章节。
- **折叠动画**：支持平滑的展开与折叠效果。

## 5. 引用与列表

> “预测未来的最好方法就是去创造它。” —— Alan Kay

*   项目 1
*   项目 2
    *   子项目 A
    *   子项目 B

---

## 接下来

- 了解 [配置指南](/posts/config-guide.html)
- 查看 [性能报告](/posts/performance-report.html)
