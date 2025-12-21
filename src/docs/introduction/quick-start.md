---
title: 快速开始
---

# 快速开始

安装依赖并运行：

```bash
npm install
npm run dev
```

## 配置示例

以下是基本配置示例：

```javascript
// reweave.config.ts
export default {
  title: "My Documentation",
  themeName: "gitbook",
  description: "A powerful static site generator",
  features: {
    darkMode: true,
    codeHighlight: true,
    copyButton: true
  }
};
```

```typescript
interface Config {
  title: string;
  themeName: 'weave' | 'gitbook';
  description?: string;
}
```
