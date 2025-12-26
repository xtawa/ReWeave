/** @jsx h */
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { render } from 'preact-render-to-string';
import { h, Fragment } from 'preact';
import { getPosts } from './markdown';
import { reweaveConfig as config } from '../config/reweave.config';
import { t } from './i18n';
import matter from 'gray-matter';
import { DefaultLayout } from './defaults/DefaultLayout';
import { NotFound } from './defaults/NotFound';

const execAsync = promisify(exec);

// Helper to generate safe filenames/URLs for non-ASCII strings
function safeSlug(str: string): string {
    // If strictly ASCII alphanumeric (plus - and _), return as is
    if (/^[a-zA-Z0-9-_]+$/.test(str)) {
        return str;
    }
    // Otherwise use hex encoding to ensure safe filename
    return Buffer.from(str).toString('hex');
}

// Helper to get Git version
async function getVersion(): Promise<string> {
    // First try Vercel environment variable
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
        return process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7);
    }

    // Fall back to local git command
    try {
        const { stdout } = await execAsync('git rev-parse --short HEAD');
        return stdout.trim();
    } catch {
        return 'dev';
    }
}

// Helper to create HTML string
function createHtml(content: any) {
    return '<!DOCTYPE html>' + render(content);
}

// Helper to write file to folder/index.html structure
async function writeHtml(filePath: string, content: string) {
    // filePath is like 'dist/posts/slug.html' or 'dist/index.html'
    // We want to convert 'dist/posts/slug.html' to 'dist/posts/slug/index.html'
    // But 'dist/index.html' stays 'dist/index.html'

    const parsed = path.parse(filePath);
    if (parsed.name === 'index' || parsed.name === '404') {
        await fs.mkdir(parsed.dir, { recursive: true });
        await fs.writeFile(filePath, content);
    } else {
        const dir = path.join(parsed.dir, parsed.name);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'index.html'), content);
    }
}

interface DocItem {
    title: string;
    path: string;
    url: string;
    children?: DocItem[];
    content?: string;
    frontmatter?: any;
    isIndex?: boolean;
}

async function getDocs(dir: string, baseDir: string = ''): Promise<DocItem[]> {
    let entries;
    try {
        entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (e) {
        return [];
    }

    const items: DocItem[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(baseDir, entry.name);

        if (entry.isDirectory()) {
            const indexMdPath = path.join(fullPath, 'index.md');
            let title = entry.name;
            let content = '';
            let frontmatter: any = {};
            let hasIndex = false;

            try {
                const fileContent = await fs.readFile(indexMdPath, 'utf-8');
                const parsed = matter(fileContent);
                content = parsed.content;
                frontmatter = parsed.data;
                title = parsed.data.title || title;
                hasIndex = true;
            } catch (e) {
                // No index.md
            }

            const children = await getDocs(fullPath, relativePath);

            if (hasIndex || children.length > 0) {
                items.push({
                    title,
                    path: hasIndex ? path.join(relativePath, 'index.md') : relativePath,
                    url: `/${relativePath.replace(/\\/g, '/')}/`,
                    children,
                    content: hasIndex ? content : '',
                    frontmatter,
                    isIndex: true
                });
            }
        } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
            const fileContent = await fs.readFile(fullPath, 'utf-8');
            const parsed = matter(fileContent);
            const name = path.parse(entry.name).name;

            items.push({
                title: parsed.data.title || name,
                path: relativePath,
                url: `/${baseDir.replace(/\\/g, '/')}/${name}/`,
                content: parsed.content,
                frontmatter: parsed.data,
                isIndex: false
            });
        }
    }

    // Sort items
    items.sort((a, b) => {
        const orderA = a.frontmatter?.order ?? 999;
        const orderB = b.frontmatter?.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title);
    });

    return items;
}

function generateSidebar(docs: DocItem[], currentUrl: string): any[] {
    return docs.map(doc => ({
        title: doc.title,
        url: doc.content ? doc.url : undefined,
        children: doc.children ? generateSidebar(doc.children, currentUrl) : undefined,
        isActive: currentUrl === doc.url || (doc.children && doc.children.some(c => currentUrl.startsWith(c.url)))
    }));
}

function flattenDocs(docs: DocItem[]): DocItem[] {
    let flat: DocItem[] = [];
    for (const doc of docs) {
        if (doc.content) {
            flat.push(doc);
        }
        if (doc.children) {
            flat = flat.concat(flattenDocs(doc.children));
        }
    }
    return flat;
}

async function build() {
    const rootDir = process.cwd();
    const contentDir = path.join(rootDir, 'src', 'content');
    const distDir = path.join(rootDir, 'dist');

    // Get Git version
    const version = await getVersion();
    (config as any).version = version;

    // GitBook Mode
    if (config.themeName === 'gitbook') {
        console.log("Building in GitBook mode...");
        const docsDir = path.join(rootDir, 'src', 'docs');
        const docs = await getDocs(docsDir);
        const flatDocs = flattenDocs(docs);

        // Import Layout
        const { Layout } = await import(`../themes/${config.themeName}/layouts/Layout`);
        const { renderMarkdown } = await import('./markdown');

        // Recursive render function
        const renderDocs = async (items: DocItem[]) => {
            for (const item of items) {
                if (item.content) {
                    const sidebarItems = generateSidebar(docs, item.url);
                    const htmlContent = await renderMarkdown(item.content);

                    // Find prev/next
                    const currentIndex = flatDocs.findIndex(d => d.url === item.url);
                    const prev = currentIndex > 0 ? flatDocs[currentIndex - 1] : undefined;
                    const next = currentIndex < flatDocs.length - 1 ? flatDocs[currentIndex + 1] : undefined;

                    const pageContent = (
                        <Layout
                            title={item.title}
                            sidebarItems={sidebarItems}
                            siteTitle={config.title}
                            updatedDate={item.frontmatter?.updatedDate}
                            prev={prev ? { title: prev.title, url: prev.url } : undefined}
                            next={next ? { title: next.title, url: next.url } : undefined}
                        >
                            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                        </Layout>
                    );

                    const outputHtml = createHtml(pageContent);
                    // Remove leading slash for writeHtml
                    const writePath = item.url.startsWith('/') ? item.url.substring(1) : item.url;
                    await writeHtml(path.join(distDir, writePath.endsWith('/') ? writePath + 'index.html' : writePath + '.html'), outputHtml);
                }

                if (item.children) {
                    await renderDocs(item.children);
                }
            }
        };

        // Ensure dist exists
        await fs.mkdir(distDir, { recursive: true });

        // Copy public assets
        const publicDir = path.join(process.cwd(), 'public');
        try {
            const publicExists = await fs.access(publicDir).then(() => true).catch(() => false);
            if (publicExists) {
                const files = await fs.readdir(publicDir);
                await Promise.all(files.map(async (file) => {
                    const srcPath = path.join(publicDir, file);
                    const destPath = path.join(distDir, file);
                    const stat = await fs.stat(srcPath);
                    if (stat.isFile()) {
                        await fs.copyFile(srcPath, destPath);
                    }
                }));
            }
        } catch (e) { }

        // Build CSS
        console.log("Building CSS...");
        try {
            const postcss = (await import('postcss')).default;
            const tailwindcss = (await import('tailwindcss')).default;
            const autoprefixer = (await import('autoprefixer')).default;
            const css = await fs.readFile(path.join(rootDir, 'src', 'style.css'), 'utf-8');
            const result = await postcss([
                tailwindcss({ config: path.join(rootDir, 'tailwind.config.js') }),
                autoprefixer
            ]).process(css, { from: path.join(rootDir, 'src', 'style.css'), to: path.join(distDir, 'style.css') });
            await fs.writeFile(path.join(distDir, 'style.css'), result.css);
        } catch (e) {
            console.error("CSS Build Error:", e);
        }

        // Generate Home Page
        const { Home } = await import(`../themes/${config.themeName}/layouts/Home`);
        const homeContent = (
            <Home
                siteTitle={config.title}
                tagline="下一代静态站点生成器"
                description="基于 Preact 和 TypeScript 构建，支持多主题、Markdown 渲染、代码高亮等功能。"
                actions={[
                    { text: '开始阅读', link: '/introduction/', primary: true },
                    { text: '查看源码', link: 'https://github.com/yourusername/reweave' }
                ]}
                features={[
                    { icon: '⚡', title: '极速构建', description: '基于 esbuild 和 Preact，毫秒级构建速度。' },
                    { icon: '🎨', title: '多主题支持', description: '灵活的主题系统，轻松切换博客和文档模式。' },
                    { icon: '📝', title: 'Markdown 原生', description: '支持 GFM、代码高亮、数学公式等扩展语法。' }
                ]}
            />
        );
        const homeHtml = createHtml(homeContent);
        await writeHtml(path.join(distDir, 'index.html'), homeHtml);

        await renderDocs(docs);
        console.log("GitBook build complete.");
        return;
    }

    // Dynamic Theme Import
    // Dynamic Theme Import
    let Layout: any, Header: any, Hero: any, Pagination: any, Comments: any, PostList: any, Archive: any, Post: any, CategoryList: any, TagList: any, Page: any;

    try {
        const themePath = `../themes/${config.themeName}`;
        // We use this weird syntax to make sure we can catch the error if the module doesn't exist
        // and also to assign to the variables declared above
        const LayoutModule = await import(`${themePath}/layouts/Layout`);
        Layout = LayoutModule.Layout;

        const HeaderModule = await import(`${themePath}/components/Header`);
        Header = HeaderModule.Header;

        const HeroModule = await import(`${themePath}/components/Hero`);
        Hero = HeroModule.Hero;

        const PaginationModule = await import(`${themePath}/components/Pagination`);
        Pagination = PaginationModule.Pagination;

        const CommentsModule = await import(`${themePath}/components/Comments`);
        Comments = CommentsModule.Comments;

        // Templates
        PostList = (await import(`${themePath}/templates/PostList`).catch(() => ({ PostList: null }))).PostList;
        Archive = (await import(`${themePath}/templates/Archive`).catch(() => ({ Archive: null }))).Archive;
        Post = (await import(`${themePath}/templates/Post`).catch(() => ({ Post: null }))).Post;
        CategoryList = (await import(`${themePath}/templates/CategoryList`).catch(() => ({ CategoryList: null }))).CategoryList;
        TagList = (await import(`${themePath}/templates/TagList`).catch(() => ({ TagList: null }))).TagList;
        Page = (await import(`${themePath}/templates/Page`).catch(() => ({ Page: null }))).Page;

    } catch (e) {
        console.warn(`Theme '${config.themeName}' not found or failed to load. Using default layout. Error:`, e);
        Layout = DefaultLayout;
        Header = () => null;
        Hero = () => null;
        Pagination = () => null;
        Comments = () => null;
    }

    // Ensure dist exists
    await fs.mkdir(distDir, { recursive: true });

    // Copy public directory if it exists
    const publicDir = path.join(process.cwd(), 'public');
    try {
        const publicExists = await fs.access(publicDir).then(() => true).catch(() => false);
        if (publicExists) {
            const files = await fs.readdir(publicDir);
            await Promise.all(files.map(async (file) => {
                const srcPath = path.join(publicDir, file);
                const destPath = path.join(distDir, file);
                const stat = await fs.stat(srcPath);
                if (stat.isFile()) {
                    await fs.copyFile(srcPath, destPath);
                }
            }));
            console.log("Copied public assets.");
        }
    } catch (e) {
        // Public directory doesn't exist, skip
    }

    // 1. Get Posts (Parallel)
    const allPosts = await getPosts(contentDir);

    // Filter out draft and hidden posts
    const posts = allPosts.filter(post => !post.draft && !post.hide);

    // Start CSS Build in background
    console.log("Building CSS...");
    const cssBuild = (async () => {
        try {
            const postcss = (await import('postcss')).default;
            const tailwindcss = (await import('tailwindcss')).default;
            const autoprefixer = (await import('autoprefixer')).default;

            const css = await fs.readFile(path.join(rootDir, 'src', 'style.css'), 'utf-8');

            const result = await postcss([
                tailwindcss({ config: path.join(rootDir, 'tailwind.config.js') }),
                autoprefixer
            ]).process(css, { from: path.join(rootDir, 'src', 'style.css'), to: path.join(distDir, 'style.css') });

            await fs.writeFile(path.join(distDir, 'style.css'), result.css);
            console.log("CSS built successfully.");
        } catch (e) {
            console.error("CSS Build Error:", e);
            throw e;
        }
    })();

    // Pagination Logic
    const pageSize = config.pagination?.pageSize || 15;
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / pageSize);

    // Helper to generate posts list page content
    const generatePostsPage = (page: number) => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const pagePosts = posts.slice(start, end);

        // Use template if available
        if (PostList) {
            return <PostList posts={pagePosts} currentPage={page} totalPages={totalPages} baseUrl="/articles" />;
        }

        return (
            <Layout contentWidth="normal" title={page === 1 && config.homePage === 'hero' ? t('articles', config.language) : (page === 1 ? undefined : `${t('articles', config.language)} - Page ${page}`)}>
                <Header />
                <main>
                    <div class="space-y-10 animate-fade-in-up">
                        {pagePosts.map((post) => {
                            const postUrl = safeSlug(post.abbrlink || post.slug);
                            return (
                                <article key={post.slug} class="group relative flex flex-col items-start">
                                    <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                        {post.pin && (
                                            <svg class="inline-block w-5 h-5 mr-2 text-teal-500 -mt-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
                                            </svg>
                                        )}
                                        <a href={`/posts/${postUrl}`}>
                                            <span class="absolute inset-0 z-0" />
                                            {post.title}
                                        </a>
                                    </h2>
                                    <time class="relative z-10 order-first mb-3 flex items-center text-sm text-gray-400 pl-3.5" datetime={post.date}>
                                        <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                                            <span class="h-4 w-0.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                                        </span>
                                        {new Date(post.date).toLocaleDateString()}
                                    </time>
                                    <p class="relative z-10 mt-2 text-sm text-gray-600 dark:text-gray-300">{post.excerpt}</p>
                                </article>
                            );
                        })}
                    </div>
                    {totalPages > 1 && (
                        <Pagination current={page} total={totalPages} baseUrl="/articles" />
                    )}
                </main>
            </Layout>
        );
    };

    // 2. Build Index Page
    let indexContent;
    if (config.homePage === 'hero' && config.hero?.enabled) {
        indexContent = (
            <Layout contentWidth="normal">
                <Header />
                <main>
                    <Hero posts={posts.slice(0, 3)} />
                </main>
            </Layout>
        );
    } else {
        indexContent = generatePostsPage(1);
    }
    const indexBuild = writeHtml(path.join(distDir, 'index.html'), createHtml(indexContent));

    // 2.1 Build Articles Page (always available for menu link)
    const articlesBuild = writeHtml(path.join(distDir, 'articles.html'), createHtml(generatePostsPage(1)));

    // 2.2 Build Pagination Pages
    const paginationBuilds = [];
    if (totalPages > 1) {
        for (let i = 2; i <= totalPages; i++) {
            paginationBuilds.push(
                writeHtml(path.join(distDir, 'articles', `${i}.html`), createHtml(generatePostsPage(i)))
            );
        }
    }

    // 3. Build Post Pages (Parallel)
    const postsDir = path.join(distDir, 'posts');

    // Helper function to extract headings from HTML content
    const extractHeadings = (html: string, maxDepth: number = 3): Array<{ level: number; text: string; id: string }> => {
        const headings: Array<{ level: number; text: string; id: string }> = [];
        const regex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[1-6]>/gi;
        let match;
        while ((match = regex.exec(html)) !== null) {
            const level = parseInt(match[1]);
            if (level <= maxDepth) {
                headings.push({
                    level,
                    text: match[3].trim(),
                    id: match[2]
                });
            }
        }
        if (headings.length === 0) {
            const simpleRegex = /<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/gi;
            let simpleMatch;
            while ((simpleMatch = simpleRegex.exec(html)) !== null) {
                const level = parseInt(simpleMatch[1]);
                if (level <= maxDepth) {
                    const text = simpleMatch[2].trim();
                    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                    headings.push({ level, text, id });
                }
            }
        }
        return headings;
    };

    // Helper function to render TOC
    const renderToc = (headings: Array<{ level: number; text: string; id: string }>, position: string = 'top', collapsible: boolean = false) => {
        if (headings.length === 0) return null;
        const minLevel = Math.min(...headings.map(h => h.level));

        const tocId = 'toc-' + Math.random().toString(36).substr(2, 9);
        const contentId = 'toc-content-' + Math.random().toString(36).substr(2, 9);

        const positionClasses: Record<string, string> = {
            'top': 'mb-8 w-full',
            'left': 'sticky top-6 max-h-[calc(100vh-3rem)] overflow-auto',
            'right': 'sticky top-6 max-h-[calc(100vh-3rem)] overflow-auto'
        };

        return (
            <nav id={tocId} class={`toc p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg ${positionClasses[position] || positionClasses['top']}`}>
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t('toc', config.language)}</h2>
                    {collapsible && (
                        <>
                            <button
                                class="toc-toggle p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition"
                                aria-label="Toggle TOC"
                            >
                                <svg class="toc-toggle-icon w-4 h-4 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <script dangerouslySetInnerHTML={{
                                __html: `
                                document.querySelector('#${tocId} .toc-toggle').addEventListener('click', function() {
                                    const content = document.getElementById('${contentId}');
                                    const icon = this.querySelector('.toc-toggle-icon');
                                    content.classList.toggle('collapsed');
                                    icon.classList.toggle('rotated');
                                });
                            ` }}></script>
                        </>
                    )}
                </div>
                <ul id={contentId} class="toc-content space-y-1 text-sm">
                    {headings.map(heading => (
                        <li style={{ paddingLeft: `${(heading.level - minLevel) * 12}px` }}>
                            <a
                                href={`#${heading.id}`}
                                class="text-zinc-600 dark:text-zinc-400 hover:text-teal-500 dark:hover:text-teal-400 transition block py-0.5"
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    (function() {
                        const tocLinks = document.querySelectorAll('#${contentId} a');
                        const headings = Array.from(tocLinks).map(link => {
                            const id = link.getAttribute('href').substring(1);
                            return document.getElementById(id);
                        }).filter(h => h !== null);

                        function highlightTocOnScroll() {
                            const scrollPos = window.scrollY + 100;
                            let currentHeading = null;

                            for (let i = 0; i < headings.length; i++) {
                                if (headings[i] && headings[i].offsetTop <= scrollPos) {
                                    currentHeading = headings[i];
                                } else {
                                    break;
                                }
                            }

                            tocLinks.forEach((link, index) => {
                                if (headings[index] === currentHeading) {
                                    link.classList.add('!text-teal-500', 'dark:!text-teal-400', 'font-semibold');
                                } else {
                                    link.classList.remove('!text-teal-500', 'dark:!text-teal-400', 'font-semibold');
                                }
                            });
                        }

                        window.addEventListener('scroll', highlightTocOnScroll);
                        highlightTocOnScroll();
                    })();
                ` }}></script>
            </nav>
        );
    };



    const postBuilds = posts.map(async (post, index) => {
        const start = performance.now();
        const postUrl = safeSlug(post.abbrlink || post.slug);

        const tocEnabled = config.toc?.enabled ?? false;
        const maxDepth = config.toc?.maxDepth ?? 3;
        const tocPosition = config.toc?.position ?? 'top';
        const tocCollapsible = config.toc?.collapsible ?? false;
        const headings = tocEnabled ? extractHeadings(post.content, maxDepth) : [];

        let postContent;
        if (Post) {
            const prevPost = index < posts.length - 1 ? { title: posts[index + 1].title, url: `/posts/${safeSlug(posts[index + 1].abbrlink || posts[index + 1].slug)}` } : undefined;
            const nextPost = index > 0 ? { title: posts[index - 1].title, url: `/posts/${safeSlug(posts[index - 1].abbrlink || posts[index - 1].slug)}` } : undefined;

            const tocNode = headings.length > 0 ? renderToc(headings, 'left', false) : null;
            const tocHtml = tocNode ? render(tocNode) : '';

            postContent = (
                <Post
                    post={{ ...post, toc: tocHtml }}
                    prevPost={prevPost}
                    nextPost={nextPost}
                />
            );
        } else {
            postContent = (
                <Layout title={post.title} description={post.excerpt} image={post.image}>
                    <Header />
                    {/* Mobile TOC */}


                    <div class="xl:relative">
                        {tocEnabled && headings.length > 0 && (tocPosition === 'left' || tocPosition === 'right') ? (
                            <div class={`lg:flex lg:gap-8 ${tocPosition === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                <aside class="hidden lg:block w-64 flex-shrink-0">
                                    {renderToc(headings, tocPosition, tocCollapsible)}
                                </aside>
                                <div class="flex-1 mx-auto max-w-2xl">
                                    <a href="/" class="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20">
                                        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400">
                                            <path d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </a>
                                    <article>
                                        <header class="flex flex-col">
                                            <time datetime={post.date} class="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500">
                                                <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
                                                <span class="ml-3">{new Date(post.date).toLocaleDateString()}</span>
                                            </time>
                                            <h1 class="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                                                {post.title}
                                            </h1>
                                            {post.tags && post.tags.length > 0 && (
                                                <div class="mt-4 flex flex-wrap gap-2">
                                                    {post.tags.map(tag => (
                                                        <a href={`/tags/${safeSlug(tag)}`} class="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition">
                                                            #{tag}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </header>
                                        {tocEnabled && headings.length > 0 && tocPosition === 'top' && (
                                            <div class="mt-8">
                                                {renderToc(headings, tocPosition, tocCollapsible)}
                                            </div>
                                        )}
                                        <div class="mt-8 prose prose-zinc dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
                                        <Comments path={`/posts/${postUrl}`} />
                                    </article>
                                </div>
                            </div>
                        ) : (
                            <div class="mx-auto max-w-2xl">
                                <a href="/" class="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0">
                                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400">
                                        <path d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </a>
                                <article>
                                    <header class="flex flex-col">
                                        <time datetime={post.date} class="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500">
                                            <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
                                            <span class="ml-3">{new Date(post.date).toLocaleDateString()}</span>
                                        </time>
                                        <h1 class="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                                            {post.title}
                                        </h1>
                                        {post.tags && post.tags.length > 0 && (
                                            <div class="mt-4 flex flex-wrap gap-2">
                                                {post.tags.map(tag => (
                                                    <a href={`/tags/${safeSlug(tag)}`} class="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition">
                                                        #{tag}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </header>
                                    {tocEnabled && headings.length > 0 && tocPosition === 'top' && (
                                        <div class="mt-8">
                                            {renderToc(headings, tocPosition, tocCollapsible)}
                                        </div>
                                    )}
                                    <div class="mt-8 prose prose-zinc dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
                                    <Comments path={`/posts/${postUrl}`} />
                                </article>
                            </div>
                        )}
                    </div>
                </Layout>
            );
        }
        await writeHtml(path.join(postsDir, `${postUrl}.html`), createHtml(postContent));
        const end = performance.now();
        console.log(`Built page: ${postUrl} (${(end - start).toFixed(2)}ms)`);
    });

    // 4. Build Category Pages
    const categories = new Map<string, typeof posts>();
    posts.forEach(post => {
        if (post.category) {
            if (!categories.has(post.category)) {
                categories.set(post.category, []);
            }
            categories.get(post.category)!.push(post);
        }
    });

    const categoriesDir = path.join(distDir, 'categories');

    const categoryBuilds = Array.from(categories.entries()).map(([category, categoryPosts]) => {
        let categoryContent;
        if (PostList) {
            categoryContent = (
                <PostList
                    posts={categoryPosts}
                    currentPage={1}
                    totalPages={1}
                    baseUrl={`/categories/${safeSlug(category)}`}
                    title={`${t('category', config.language)}: ${category}`}
                    subtitle={`${categoryPosts.length} articles`}
                />
            );
        } else {
            categoryContent = (
                <Layout title={`${t('category', config.language)}: ${category}`}>
                    <Header />
                    <main>
                        <h1 class="text-4xl font-bold mb-8 text-zinc-900 dark:!text-white">{t('category', config.language)}: {category}</h1>
                        <div class="space-y-10">
                            {categoryPosts.map((post) => {
                                const postUrl = safeSlug(post.abbrlink || post.slug);
                                return (
                                    <article key={post.slug} class="group relative flex flex-col items-start">
                                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-zinc-300">
                                            <a href={`/posts/${postUrl}`}>
                                                <span class="absolute inset-0" />
                                                {post.title}
                                            </a>
                                        </h2>
                                        <time class="relative z-10 order-first mb-3 flex items-center text-sm text-gray-400 pl-3.5" datetime={post.date}>
                                            <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                                                <span class="h-4 w-0.5 rounded-full bg-gray-200 dark:bg-zinc-700" />
                                            </span>
                                            {new Date(post.date).toLocaleDateString()}
                                        </time>
                                        <p class="relative z-10 mt-2 text-sm text-gray-600 dark:text-zinc-300">{post.excerpt}</p>
                                    </article>
                                );
                            })}
                        </div>
                    </main>
                </Layout>
            );
        }
        return writeHtml(path.join(categoriesDir, `${safeSlug(category)}.html`), createHtml(categoryContent));
    });

    // 5. Build Tag Pages
    const tags = new Map<string, typeof posts>();
    posts.forEach(post => {
        post.tags?.forEach(tag => {
            if (!tags.has(tag)) {
                tags.set(tag, []);
            }
            tags.get(tag)!.push(post);
        });
    });

    const tagsDir = path.join(distDir, 'tags');

    const tagBuilds = Array.from(tags.entries()).map(([tag, tagPosts]) => {
        let tagContent;
        if (PostList) {
            tagContent = (
                <PostList
                    posts={tagPosts}
                    currentPage={1}
                    totalPages={1}
                    baseUrl={`/tags/${safeSlug(tag)}`}
                    title={`${t('tag', config.language)}: ${tag}`}
                    subtitle={`${tagPosts.length} articles`}
                />
            );
        } else {
            tagContent = (
                <Layout title={`${t('tag', config.language)}: ${tag}`}>
                    <Header />
                    <main>
                        <h1 class="text-4xl font-bold mb-8 text-zinc-900 dark:!text-white">{t('tag', config.language)}: {tag}</h1>
                        <div class="space-y-10">
                            {tagPosts.map((post) => {
                                const postUrl = safeSlug(post.abbrlink || post.slug);
                                return (
                                    <article key={post.slug} class="group relative flex flex-col items-start">
                                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-zinc-300">
                                            <a href={`/posts/${postUrl}`}>
                                                <span class="absolute inset-0" />
                                                {post.title}
                                            </a>
                                        </h2>
                                        <time class="relative z-10 order-first mb-3 flex items-center text-sm text-gray-400 pl-3.5" datetime={post.date}>
                                            <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                                                <span class="h-4 w-0.5 rounded-full bg-gray-200 dark:bg-zinc-700" />
                                            </span>
                                            {new Date(post.date).toLocaleDateString()}
                                        </time>
                                        <p class="relative z-10 mt-2 text-sm text-gray-600 dark:text-zinc-300">{post.excerpt}</p>
                                    </article>
                                );
                            })}
                        </div>
                    </main>
                </Layout>
            );
        }
        return writeHtml(path.join(tagsDir, `${safeSlug(tag)}.html`), createHtml(tagContent));
    });

    // 6. Build Archive Page
    const postsByYear = new Map<number, typeof posts>();
    posts.forEach(post => {
        const year = new Date(post.date).getFullYear();
        if (!postsByYear.has(year)) {
            postsByYear.set(year, []);
        }
        postsByYear.get(year)!.push(post);
    });
    const years = Array.from(postsByYear.keys()).sort((a, b) => b - a);

    let archiveContent;
    if (Archive) {
        archiveContent = <Archive posts={posts} categoriesCount={categories.size} tagsCount={tags.size} />;
    } else {
        archiveContent = (
            <Layout title={t('archive', config.language)}>
                <Header />
                <main>
                    <h1 class="text-4xl font-bold mb-8 text-zinc-900 dark:!text-white">{t('archive', config.language)}</h1>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <a href="/categories" class="block p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition">
                            <h2 class="text-2xl font-semibold mb-2 text-zinc-900 dark:!text-white">{t('categories', config.language)}</h2>
                            <p class="text-gray-600 dark:text-zinc-300">{categories.size} {t('categories', config.language).toLowerCase()}</p>
                        </a>
                        <a href="/tags" class="block p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition">
                            <h2 class="text-2xl font-semibold mb-2 text-zinc-900 dark:!text-white">{t('tags', config.language)}</h2>
                            <p class="text-gray-600 dark:text-zinc-300">{tags.size} {t('tags', config.language).toLowerCase()}</p>
                        </a>
                    </div>

                    <div class="space-y-12">
                        {years.map(year => (
                            <section key={year}>
                                <h2 class="text-3xl font-bold mb-6 text-zinc-900 dark:!text-white border-b border-zinc-200 dark:border-zinc-700 pb-2">{year}</h2>
                                <div class="space-y-6">
                                    {postsByYear.get(year)!.map(post => (
                                        <article key={post.slug} class="flex items-baseline gap-4 group">
                                            <time datetime={post.date} class="text-sm text-zinc-500 dark:text-zinc-400 w-24 flex-shrink-0 text-right">
                                                {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </time>
                                            <h3 class="text-lg font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                                                <a href={`/posts/${safeSlug(post.abbrlink || post.slug)}`}>
                                                    {post.title}
                                                </a>
                                            </h3>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </main>
            </Layout>
        );
    }
    const archiveBuild = writeHtml(path.join(distDir, 'archive.html'), createHtml(archiveContent));

    // 7. Build Categories List Page
    let categoriesListContent;
    if (CategoryList) {
        categoriesListContent = <CategoryList categories={categories} />;
    } else {
        categoriesListContent = (
            <Layout title={t('categories', config.language)}>
                <Header />
                <main>
                    <h1 class="text-4xl font-bold mb-8 text-zinc-900 dark:!text-white">{t('categories', config.language)}</h1>
                    <div class="flex flex-wrap gap-4">
                        {Array.from(categories.entries()).map(([category, categoryPosts]) => (
                            <a href={`/categories/${safeSlug(category)}`} class="inline-flex items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition group border border-transparent dark:border-zinc-700/50">
                                <span class="font-medium text-zinc-700 dark:text-zinc-200">{category}</span>
                                <span class="ml-2 text-sm text-gray-500 dark:text-zinc-400">({categoryPosts.length})</span>
                            </a>
                        ))}
                    </div>
                </main>
            </Layout>
        );
    }
    const categoriesListBuild = writeHtml(path.join(distDir, 'categories.html'), createHtml(categoriesListContent));

    // 8. Build Tags List Page
    let tagsListContent;
    if (TagList) {
        tagsListContent = <TagList tags={tags} />;
    } else {
        tagsListContent = (
            <Layout title={t('tags', config.language)}>
                <Header />
                <main>
                    <h1 class="text-4xl font-bold mb-8 text-zinc-900 dark:!text-white">{t('tags', config.language)}</h1>
                    <div class="flex flex-wrap gap-3">
                        {Array.from(tags.entries()).map(([tag, tagPosts]) => (
                            <a href={`/tags/${safeSlug(tag)}`} class="inline-flex items-center px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-200 rounded-full hover:bg-teal-100 dark:hover:bg-teal-900/50 transition text-sm border border-teal-100 dark:border-teal-800/50">
                                #{tag}
                                <span class="ml-1 text-xs opacity-70">({tagPosts.length})</span>
                            </a>
                        ))}
                    </div>
                </main>
            </Layout>
        );
    }
    const tagsListBuild = writeHtml(path.join(distDir, 'tags.html'), createHtml(tagsListContent));

    // 9. Build About Page
    let aboutBuild: Promise<void> | null = null;
    if (config.about) {
        const { unified } = await import('unified');
        const remarkParse = (await import('remark-parse')).default;
        const remarkRehype = (await import('remark-rehype')).default;
        const rehypeStringify = (await import('rehype-stringify')).default;

        const pagesDir = path.join(process.cwd(), 'src', 'pages');
        const aboutFilePath = path.join(pagesDir, config.about.file);
        const aboutMarkdown = await fs.readFile(aboutFilePath, 'utf-8');

        const processedAbout = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeStringify)
            .process(aboutMarkdown);

        let aboutContent;
        if (Page) {
            aboutContent = <Page title={config.about.title || t('about', config.language)} content={processedAbout.toString()} slug="about" />;
        } else {
            aboutContent = (
                <Layout title={config.about.title || t('about', config.language)}>
                    <Header />
                    <main>
                        <div class="prose prose-zinc dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: processedAbout.toString() }} />
                    </main>
                </Layout>
            );
        }
        aboutBuild = writeHtml(path.join(distDir, 'about.html'), createHtml(aboutContent));
    }

    // 10. Build Projects Page
    let projectsBuild: Promise<void> | null = null;
    if (config.projects) {
        const { unified } = await import('unified');
        const remarkParse = (await import('remark-parse')).default;
        const remarkRehype = (await import('remark-rehype')).default;
        const rehypeStringify = (await import('rehype-stringify')).default;

        const pagesDir = path.join(process.cwd(), 'src', 'pages');
        const projectsFilePath = path.join(pagesDir, config.projects.file);
        const projectsMarkdown = await fs.readFile(projectsFilePath, 'utf-8');

        const processedProjects = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeStringify)
            .process(projectsMarkdown);

        let projectsContent;
        if (Page) {
            projectsContent = <Page title={config.projects.title || t('projects', config.language)} content={processedProjects.toString()} slug="projects" />;
        } else {
            projectsContent = (
                <Layout title={config.projects.title || t('projects', config.language)}>
                    <Header />
                    <main>
                        <div class="prose prose-zinc dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: processedProjects.toString() }} />
                    </main>
                </Layout>
            );
        }
        projectsBuild = writeHtml(path.join(distDir, 'projects.html'), createHtml(projectsContent));
    }

    // 10. Build Stats Page
    const totalWords = posts.reduce((sum, post) => {
        const text = post.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
        return sum + text.length;
    }, 0);

    const tagCounts = new Map<string, number>();
    posts.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        }
    });
    const topTags = Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const timeline = new Map<string, typeof posts>();
    posts.forEach(post => {
        const date = new Date(post.date);
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!timeline.has(yearMonth)) {
            timeline.set(yearMonth, []);
        }
        timeline.get(yearMonth)!.push(post);
    });
    const sortedTimeline = Array.from(timeline.entries()).sort((a, b) => b[0].localeCompare(a[0]));

    const statsContent = (
        <Layout title={t('stats', config.language)}>
            <Header />
            <main class="max-w-4xl mx-auto">
                <h1 class="text-4xl font-bold text-zinc-800 dark:!text-white mb-8">{t('stats', config.language)}</h1>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div class="p-6 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                        <div class="text-sm text-teal-600 dark:text-teal-400 font-medium mb-2">{t('totalPosts', config.language)}</div>
                        <div class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{totalPosts}</div>
                    </div>
                    <div class="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div class="text-sm text-purple-600 dark:text-purple-400 font-medium mb-2">{t('totalWords', config.language)}</div>
                        <div class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{totalWords.toLocaleString()}</div>
                    </div>
                </div>

                <div class="mb-12">
                    <h2 class="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">{t('topTags', config.language)}</h2>
                    <div class="flex flex-wrap gap-3">
                        {topTags.map(([tag, count]) => (
                            <a
                                href={`/tags/${safeSlug(tag)}`}
                                class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-teal-100 dark:hover:bg-teal-900/30 rounded-full transition"
                            >
                                <span class="text-zinc-700 dark:text-zinc-300 font-medium">#{tag}</span>
                                <span class="text-xs px-2 py-0.5 bg-teal-500 text-white rounded-full">{count}</span>
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">{t('timeline', config.language)}</h2>
                    <div class="space-y-8">
                        {sortedTimeline.map(([yearMonth, monthPosts]) => {
                            const [year, month] = yearMonth.split('-');
                            const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(config.language === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long' });
                            return (
                                <div class="border-l-2 border-teal-500 pl-6">
                                    <h3 class="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-3">{monthName}</h3>
                                    <ul class="space-y-2">
                                        {monthPosts.map(post => {
                                            const postUrl = safeSlug(post.abbrlink || post.slug);
                                            return (
                                                <li>
                                                    <a href={`/posts/${postUrl}`} class="text-zinc-600 dark:text-zinc-400 hover:text-teal-500 dark:hover:text-teal-400 transition">
                                                        {post.title}
                                                    </a>
                                                    <span class="text-xs text-zinc-400 dark:text-zinc-600 ml-2">
                                                        {new Date(post.date).toLocaleDateString()}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </Layout>
    );
    const statsBuild = writeHtml(path.join(distDir, 'stats.html'), createHtml(statsContent));

    // 11. Generate RSS Feed
    const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title><![CDATA[${config.title}]]></title>
    <link>${config.siteUrl}</link>
    <description><![CDATA[${config.description}]]></description>
    <language>${config.language}</language>
    <atom:link href="${config.siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts.slice(0, 20).map(post => {
        const postUrl = safeSlug(post.abbrlink || post.slug);
        const fullPostUrl = `${config.siteUrl}/posts/${postUrl}`;
        return `
    <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${fullPostUrl}</link>
        <guid>${fullPostUrl}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description><![CDATA[${post.excerpt || post.content.substring(0, 200)}]]></description>
    </item>`;
    }).join('')}
</channel>
</rss>`;
    const rssBuild = fs.writeFile(path.join(distDir, 'rss.xml'), rssContent);

    // 12. Generate Sitemap
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${config.siteUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${config.siteUrl}/archive</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${config.siteUrl}/categories</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${config.siteUrl}/tags</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    ${config.about ? `
    <url>
        <loc>${config.siteUrl}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>` : ''}
    ${config.projects ? `
    <url>
        <loc>${config.siteUrl}/projects</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>` : ''}
    ${posts.map(post => `
    <url>
        <loc>${config.siteUrl}/posts/${safeSlug(post.abbrlink || post.slug)}</loc>
        <lastmod>${new Date(post.date).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`).join('')}
</urlset>`;
    const sitemapBuild = fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemapContent);

    // Wait for all tasks
    const allBuilds = [indexBuild, ...postBuilds, ...categoryBuilds, ...tagBuilds, archiveBuild, categoriesListBuild, tagsListBuild, cssBuild];
    if (aboutBuild) allBuilds.push(aboutBuild);
    if (projectsBuild) allBuilds.push(projectsBuild);
    allBuilds.push(statsBuild);
    allBuilds.push(rssBuild);
    allBuilds.push(sitemapBuild);
    allBuilds.push(articlesBuild);
    allBuilds.push(...paginationBuilds);
    // 13. Generate 404 Page
    const notFoundContent = (
        <Layout title="404 Not Found">
            <Header />
            <main>
                <NotFound />
            </main>
        </Layout>
    );
    const notFoundBuild = writeHtml(path.join(distDir, '404.html'), createHtml(notFoundContent));
    allBuilds.push(notFoundBuild);

    await Promise.all(allBuilds);

    const pageCount = posts.length + 1 + categories.size + tags.size + 3 + (config.about ? 1 : 0) + (config.projects ? 1 : 0) + 1 + 2 + 1; // +2 for RSS/Sitemap, +1 for Articles
    console.log(`Build complete! Generated ${pageCount} pages.`);
    console.log("Thanks for using ReWeave!ヾ(≧▽≦*)o -Powered By ReWeave Labs");
    console.log(`Content Version ${version}. Feel free to start an issue on Github!( •̀ ω •́ )✧ (https://github.com/xtawa/ReWeave)`);
}

build().catch(console.error);
