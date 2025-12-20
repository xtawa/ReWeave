---
title: Rich Text Features Demo
date: 2025-12-22
excerpt: Demonstrating code highlighting, mermaid diagrams, and GFM tables.
---

# Rich Text Features

ReWeave supports a variety of rich text features to make your content stand out.

## 1. Syntax Highlighting

We use `highlight.js` with the `github-dark` theme.

```typescript
// TypeScript Example
interface User {
  id: number;
  name: string;
}

function greet(user: User) {
  console.log(`Hello, ${user.name}!`);
}
```

```python
# Python Example
def fib(n):
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a+b
    print()
```

## 2. Mermaid Diagrams

We support [Mermaid](https://mermaid.js.org/) diagrams natively.

<div class="mermaid">
graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]
    D --> B
</div>

<div class="mermaid">
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!
</div>

## 3. GFM Tables

| Feature | Support | Notes |
| :--- | :---: | :--- |
| **Bold** | ✅ | Standard Markdown |
| *Italic* | ✅ | Standard Markdown |
| `Code` | ✅ | Inline code |
| Tables | ✅ | Via `remark-gfm` |
| Mermaid | ✅ | Via Client-side JS |

## 4. Blockquotes & Lists

> "The best way to predict the future is to invent it." - Alan Kay

*   Item 1
*   Item 2
    *   Sub-item A
    *   Sub-item B
