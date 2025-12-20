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

## Architecture / 架构

- **Core**: Node.js + TypeScript SSG Engine.
- **Rendering**: Preact (Server-Side Rendering).
- **Styling**: TailwindCSS.

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
