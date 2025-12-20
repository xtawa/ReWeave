# Logo 配置说明 / Logo Configuration Guide

## 中文说明

### 如何使用自定义 Logo

1. **准备 Logo 文件**
   - 将您的 logo 文件放在 `public/` 目录下
   - 推荐格式：PNG（支持透明）或 SVG（矢量图）
   - 推荐尺寸：至少 200x200 像素（会自动缩放为圆形）

2. **配置 Logo**
   
   编辑 `src/core/config.ts` 文件，取消注释并修改 logo 配置：

   ```typescript
   logo: {
       path: "logo.png",  // 您的 logo 文件名
       alt: "我的博客 Logo",
   },
   ```

3. **使用外部 URL**
   
   如果 logo 托管在其他地方：

   ```typescript
   logo: {
       path: "https://example.com/my-logo.png",
       alt: "我的博客 Logo",
   },
   ```

4. **重新构建**
   
   ```bash
   npm run build
   ```

### 注意事项

- Logo 会显示为圆形，请确保主要内容在中心区域
- 支持透明背景
- 如果不配置 logo，将显示默认的渐变色占位符

---

## English Instructions

### How to Use Custom Logo

1. **Prepare Logo File**
   - Place your logo file in the `public/` directory
   - Recommended formats: PNG (with transparency) or SVG (vector)
   - Recommended size: At least 200x200 pixels (will be auto-scaled to circular)

2. **Configure Logo**
   
   Edit `src/core/config.ts` file, uncomment and modify the logo configuration:

   ```typescript
   logo: {
       path: "logo.png",  // Your logo filename
       alt: "My Blog Logo",
   },
   ```

3. **Use External URL**
   
   If your logo is hosted elsewhere:

   ```typescript
   logo: {
       path: "https://example.com/my-logo.png",
       alt: "My Blog Logo",
   },
   ```

4. **Rebuild**
   
   ```bash
   npm run build
   ```

### Notes

- Logo will be displayed as a circle, ensure main content is centered
- Transparent backgrounds are supported
- If no logo is configured, a default gradient placeholder will be shown
