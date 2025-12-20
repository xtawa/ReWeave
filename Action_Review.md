# 操作记录

## 2025-12-20 22:48 - 移除说说功能

### 完成的操作

#### 移除的内容
- ✅ 从 `config.ts` 中移除 moments 配置接口和实例
- ✅ 从导航栏配置中移除 moments 链接
- ✅ 从 `build.tsx` 中移除整个 Moments 页面构建代码
- ✅ 从 `i18n.ts` 中移除 moments 相关翻译
- ✅ 清理了所有 Telegram 消息获取相关代码

### 修改的文件

- `src/core/config.ts` - 移除 moments 配置
- `src/core/build.tsx` - 移除 moments 页面构建
- `src/core/i18n.ts` - 移除 moments 翻译

### 说明

说说功能已完全移除,包括:
- Telegram 频道集成
- 图片折叠功能
- 所有相关的配置和翻译

构建成功,生成了 35 个页面。

---

## 2025-12-20 22:45 - 添加评论系统支持

### 完成的功能

#### 评论系统集成
- ✅ 在 `config.ts` 中添加了评论系统配置接口
- ✅ 支持三种主流评论系统:
  - **Waline** (默认)
  - **Twikoo**
  - **Gitalk**
- ✅ 创建了通用的 Comments 组件
- ✅ 在文章页面底部集成评论区域

### 配置说明

在 `src/core/config.ts` 中配置评论系统:

```typescript
comments: {
    enabled: true,
    type: 'waline',  // 'waline' | 'twikoo' | 'gitalk'
    serverURL: 'https://waline.xtyin.com',  // Waline 服务器地址
}
```

#### Waline 配置示例
```typescript
comments: {
    enabled: true,
    type: 'waline',
    serverURL: 'https://waline.xtyin.com',
}
```

#### Twikoo 配置示例
```typescript
comments: {
    enabled: true,
    type: 'twikoo',
    envId: 'your-twikoo-env-id',
}
```

#### Gitalk 配置示例
```typescript
comments: {
    enabled: true,
    type: 'gitalk',
    gitalk: {
        clientID: 'your-github-client-id',
        clientSecret: 'your-github-client-secret',
        repo: 'your-repo-name',
        owner: 'your-github-username',
        admin: ['your-github-username'],
    },
}
```

### 技术实现

**新增文件:**
- `src/themes/weave/components/Comments.tsx` - 评论组件

**修改文件:**
- `src/core/config.ts` - 添加评论系统配置接口和默认配置
- `src/core/build.tsx` - 在文章页面集成评论组件

**关键特性:**
- 自动根据配置类型加载对应的评论系统
- 支持暗色模式自动切换
- 使用 CDN 加载评论系统资源
- 评论区域有清晰的分隔线

### 使用方法

1. 在 `config.ts` 中启用并配置评论系统
2. 运行 `npm run build` 构建网站
3. 每篇文章底部会自动显示评论区域

### 前置条件

- **Waline**: 需要部署 Waline 服务器
- **Twikoo**: 需要在腾讯云或 Vercel 部署 Twikoo
- **Gitalk**: 需要创建 GitHub OAuth App

### Next Step

- ✅ 评论系统已集成,可以开始接收用户反馈
- ✅ 说说功能已移除,代码更加简洁
- 可以继续优化评论系统的样式和交互
- 建议配置自动化部署以保持内容更新
