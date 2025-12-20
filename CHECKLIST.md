# ReWeave Testing Checklist

## 项目初始化 / Project Initialization

- [ ] 克隆项目 / Clone the project
- [ ] 运行 `npm install` 安装依赖 / Run `npm install` to install dependencies
- [ ] 检查 Node.js 版本 >= 20 / Check Node.js version >= 20

## 核心功能测试 / Core Features Testing

### 1. 构建系统 / Build System

- [ ] 运行 `npm run build` / Run `npm run build`
- [ ] 检查 `dist/` 目录是否生成 / Check if `dist/` directory is generated
- [ ] 验证生成的文件：
  - [ ] `index.html` (首页)
  - [ ] `posts/*.html` (文章页面)
  - [ ] `categories/*.html` (分类页面)
  - [ ] `tags/*.html` (标签页面)
  - [ ] `style.css` (样式文件)

### 2. 开发服务器 / Development Server

- [ ] 运行 `npm run dev` / Run `npm run dev`
- [ ] 访问 `http://localhost:3000` / Visit `http://localhost:3000`
- [ ] 修改 Markdown 文件，检查是否自动重新构建 / Modify a Markdown file and check auto-rebuild
- [ ] 刷新浏览器，验证更改是否生效 / Refresh browser to verify changes

### 3. Markdown 解析 / Markdown Parsing

- [ ] 创建新的 Markdown 文件在 `src/content/` / Create a new Markdown file in `src/content/`
- [ ] 添加 frontmatter：
  ```yaml
  ---
  title: Test Post
  date: 2025-12-20
  excerpt: Test excerpt
  category: Test
  tags: [tag1, tag2]
  ---
  ```
- [ ] 添加以下内容并验证渲染：
  - [ ] 标题 (H1-H6) / Headings
  - [ ] 粗体和斜体 / Bold and italic
  - [ ] 列表（有序和无序）/ Lists (ordered and unordered)
  - [ ] 链接 / Links
  - [ ] 图片 / Images
  - [ ] 引用块 / Blockquotes
  - [ ] 代码块（带语法高亮）/ Code blocks with syntax highlighting
  - [ ] 表格 / Tables
  - [ ] Mermaid 图表 / Mermaid diagrams

### 4. 富文本功能 / Rich Text Features

#### 代码高亮 / Code Highlighting
- [ ] 创建包含 TypeScript 代码块的文章 / Create post with TypeScript code block
- [ ] 创建包含 Python 代码块的文章 / Create post with Python code block
- [ ] 验证语法高亮是否正确显示 / Verify syntax highlighting displays correctly

#### Mermaid 图表 / Mermaid Diagrams
- [ ] 添加流程图 / Add flowchart
  ```html
  <div class="mermaid">
  graph TD
      A[Start] --> B[End]
  </div>
  ```
- [ ] 添加时序图 / Add sequence diagram
- [ ] 验证图表是否正确渲染 / Verify diagrams render correctly

#### GFM 表格 / GFM Tables
- [ ] 创建包含表格的文章 / Create post with table
- [ ] 验证表格对齐（左对齐、居中、右对齐）/ Verify table alignment

### 5. 分类和标签 / Categories and Tags

- [ ] 为文章添加 `category` 字段 / Add `category` field to posts
- [ ] 为文章添加 `tags` 数组 / Add `tags` array to posts
- [ ] 构建后检查 `/categories/{category}.html` 是否生成 / Check if `/categories/{category}.html` is generated
- [ ] 构建后检查 `/tags/{tag}.html` 是否生成 / Check if `/tags/{tag}.html` is generated
- [ ] 访问分类页面，验证文章列表 / Visit category page and verify post list
- [ ] 访问标签页面，验证文章列表 / Visit tag page and verify post list

### 6. 多语言支持 / Internationalization

- [ ] 打开 `src/core/config.ts` / Open `src/core/config.ts`
- [ ] 设置 `language: 'en'` 并构建 / Set `language: 'en'` and build
- [ ] 验证页面显示英文 UI / Verify pages show English UI
- [ ] 设置 `language: 'zh'` 并构建 / Set `language: 'zh'` and build
- [ ] 验证页面显示中文 UI / Verify pages show Chinese UI
- [ ] 检查以下元素的翻译：
  - [ ] 导航栏（Home/首页, About/关于, Projects/项目）
  - [ ] "Read article" / "阅读文章"
  - [ ] "Category" / "分类"
  - [ ] "Tag" / "标签"
  - [ ] "All rights reserved" / "保留所有权利"

### 7. 配置系统 / Configuration System

#### 基本配置 / Basic Config
- [ ] 修改 `config.title` / Modify `config.title`
- [ ] 修改 `config.description` / Modify `config.description`
- [ ] 验证更改反映在生成的页面中 / Verify changes reflect in generated pages

#### 主题配置 / Theme Config
- [ ] 修改 `config.themeName` / Modify `config.themeName`
- [ ] 验证主题切换（当前只有 'weave'）/ Verify theme switching (currently only 'weave')

#### 社交链接 / Social Links
- [ ] 修改 `config.social.twitter` / Modify `config.social.twitter`
- [ ] 修改 `config.social.github` / Modify `config.social.github`
- [ ] 验证页脚链接是否更新 / Verify footer links are updated

#### 页脚配置 / Footer Config
- [ ] 修改 `config.footer.copyright` / Modify `config.footer.copyright`
- [ ] 添加 `config.footer.icp` (ICP 备案号) / Add `config.footer.icp`
- [ ] 验证页脚显示正确 / Verify footer displays correctly

### 8. 性能测试 / Performance Testing

#### 小规模测试 (50-500 篇文章) / Small Scale (50-500 posts)
- [ ] 使用基准测试脚本生成 50 篇文章 / Use benchmark script to generate 50 posts
- [ ] 记录构建时间 / Record build time
- [ ] 重复测试 100、250、500 篇 / Repeat for 100, 250, 500 posts

#### 大规模测试 (1000-2000 篇文章) / Large Scale (1000-2000 posts)
- [ ] 生成 1000 篇文章 / Generate 1000 posts
- [ ] 记录构建时间 / Record build time
- [ ] 生成 2000 篇文章 / Generate 2000 posts
- [ ] 记录构建时间 / Record build time

#### 复杂内容测试 / Complex Content Test
- [ ] 生成 300 篇包含代码、表格、图片的文章 / Generate 300 posts with code, tables, images
- [ ] 记录构建时间 / Record build time
- [ ] 验证所有内容正确渲染 / Verify all content renders correctly

### 9. SEO 功能 / SEO Features

- [ ] 检查每个页面的 `<title>` 标签 / Check `<title>` tag on each page
- [ ] 检查 `<meta name="description">` / Check `<meta name="description">`
- [ ] 检查 OpenGraph 标签：
  - [ ] `og:title`
  - [ ] `og:description`
  - [ ] `og:image` (如果提供) / `og:image` (if provided)
- [ ] 验证 HTML 语义化结构 / Verify semantic HTML structure

### 10. 样式和主题 / Styling and Theme

- [ ] 检查响应式设计（移动端、平板、桌面）/ Check responsive design (mobile, tablet, desktop)
- [ ] 验证暗黑模式样式（如果启用）/ Verify dark mode styles (if enabled)
- [ ] 检查 TailwindCSS 样式是否正确应用 / Check if TailwindCSS styles apply correctly
- [ ] 验证自定义字体（Outfit）加载 / Verify custom font (Outfit) loads
- [ ] 检查代码高亮主题（github-dark）/ Check code highlighting theme (github-dark)

## 边缘情况测试 / Edge Case Testing

- [ ] 创建没有 frontmatter 的 Markdown 文件 / Create Markdown file without frontmatter
- [ ] 创建只有 title 的文章 / Create post with only title
- [ ] 创建没有 category 的文章 / Create post without category
- [ ] 创建没有 tags 的文章 / Create post without tags
- [ ] 创建空的 Markdown 文件 / Create empty Markdown file
- [ ] 测试特殊字符在 URL 中的处理 / Test special characters in URLs
- [ ] 测试非常长的文章标题 / Test very long post titles
- [ ] 测试非常长的文章内容 / Test very long post content

## 错误处理 / Error Handling

- [ ] 删除 `src/content/` 目录后构建 / Build after deleting `src/content/` directory
- [ ] 使用无效的 frontmatter 格式 / Use invalid frontmatter format
- [ ] 使用不支持的语言代码 / Use unsupported language code
- [ ] 使用不存在的主题名称 / Use non-existent theme name

## 浏览器兼容性 / Browser Compatibility

- [ ] Chrome / Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## 文档验证 / Documentation Verification

- [ ] 阅读 `README.md` / Read `README.md`
- [ ] 验证快速开始指南 / Verify quick start guide
- [ ] 检查性能基准数据是否准确 / Check if performance benchmark data is accurate
- [ ] 阅读 `Action_Review.md` / Read `Action_Review.md`
- [ ] 验证所有功能都有文档记录 / Verify all features are documented

## 清理 / Cleanup

- [ ] 删除测试文件 / Delete test files
- [ ] 运行 `npm run build` 确保干净构建 / Run `npm run build` for clean build
- [ ] 检查 `dist/` 目录大小 / Check `dist/` directory size
- [ ] 验证没有遗留的调试文件 / Verify no leftover debug files

## 预期结果 / Expected Results

### 构建性能 / Build Performance
- 50 篇文章：~5-6 秒 / 50 posts: ~5-6 seconds
- 500 篇文章：~7 秒 / 500 posts: ~7 seconds
- 1000 篇文章：~10 秒 / 1000 posts: ~10 seconds
- 2000 篇文章：~15 秒 / 2000 posts: ~15 seconds
- 300 篇复杂文章：~7 秒 / 300 complex posts: ~7 seconds

### 生成的页面 / Generated Pages
- 每篇文章生成一个 HTML 文件 / One HTML file per post
- 每个分类生成一个页面 / One page per category
- 每个标签生成一个页面 / One page per tag
- 一个首页 / One index page

### 文件大小 / File Sizes
- CSS 文件应该 < 50KB (压缩后) / CSS file should be < 50KB (minified)
- 每个 HTML 页面应该 < 100KB / Each HTML page should be < 100KB

## 已知问题 / Known Issues

- 暗黑模式切换按钮目前是占位符 / Dark mode toggle is currently a placeholder
- 没有实现搜索功能 / Search functionality not implemented
- 没有实现 RSS feed / RSS feed not implemented

## 下一步 / Next Steps

建议的改进方向 / Suggested improvements:
- [ ] 实现暗黑模式切换 / Implement dark mode toggle
- [ ] 添加搜索功能 / Add search functionality
- [ ] 生成 RSS feed / Generate RSS feed
- [ ] 添加分页功能 / Add pagination
- [ ] 图片优化（WebP 转换）/ Image optimization (WebP conversion)
- [ ] 添加 sitemap.xml / Add sitemap.xml
