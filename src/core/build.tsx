/** @jsx h */
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { render } from 'preact-render-to-string';
import { h, Fragment } from 'preact';
import { getPosts } from './markdown';
import { config } from './config';
import { t } from './i18n';

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
    if (parsed.name === 'index') {
        await fs.mkdir(parsed.dir, { recursive: true });
        await fs.writeFile(filePath, content);
    } else {
        const dir = path.join(parsed.dir, parsed.name);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'index.html'), content);
    }
}

async function build() {
    const rootDir = process.cwd();
    const contentDir = path.join(rootDir, 'src', 'content');
    const distDir = path.join(rootDir, 'dist');

    // Get Git version
    const version = await getVersion();
    (config as any).version = version;

    // Dynamic Theme Import
    const themePath = `../themes/${config.themeName}`;
    const { Layout } = await import(`${themePath}/layouts/Layout`);
    const { Header } = await import(`${themePath}/components/Header`);
    const { Hero } = await import(`${themePath}/components/Hero`);
    const { Pagination } = await import(`${themePath}/components/Pagination`);

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
                    <Hero />
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

    const postBuilds = posts.map(post => {
        const postUrl = safeSlug(post.abbrlink || post.slug);

        const tocEnabled = config.toc?.enabled ?? false;
        const maxDepth = config.toc?.maxDepth ?? 3;
        const tocPosition = config.toc?.position ?? 'top';
        const tocCollapsible = config.toc?.collapsible ?? false;
        const headings = tocEnabled ? extractHeadings(post.content, maxDepth) : [];

        const postContent = (
            <Layout title={post.title} description={post.excerpt} image={post.image}>
                <Header />
                <div class="xl:relative">
                    {tocEnabled && headings.length > 0 && (tocPosition === 'left' || tocPosition === 'right') ? (
                        <div class={`flex gap-8 ${tocPosition === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
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
                            </article>
                        </div>
                    )}
                </div>
            </Layout>
        );
        return writeHtml(path.join(postsDir, `${postUrl}.html`), createHtml(postContent));
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
        const categoryContent = (
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
        const tagContent = (
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

    const archiveContent = (
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
    const archiveBuild = writeHtml(path.join(distDir, 'archive.html'), createHtml(archiveContent));

    // 7. Build Categories List Page
    const categoriesListContent = (
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
    const categoriesListBuild = writeHtml(path.join(distDir, 'categories.html'), createHtml(categoriesListContent));

    // 8. Build Tags List Page
    const tagsListContent = (
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
    const tagsListBuild = writeHtml(path.join(distDir, 'tags.html'), createHtml(tagsListContent));

    // 8.1 Build Moments Page
    let momentsBuild: Promise<void> | null = null;
    if (config.moments?.enabled) {
        const channelId = process.env.TELEGRAM_CHANNEL_ID || config.moments.channelId;

        async function fetchTelegramMessages(id: string) {
            try {
                const response = await fetch(`https://t.me/s/${id}`);
                const html = await response.text();

                // Parse Telegram web preview HTML
                const messages: Array<{ text: string, date: string, id: string }> = [];

                // Match message text and datetime separately
                const messageBlocks = html.match(/<div class="tgme_widget_message_wrap[^>]*>[\s\S]*?<\/div><\/div>/g) || [];

                for (const block of messageBlocks) {
                    // Skip service messages (like "Channel created")
                    if (block.includes('service_message')) continue;

                    // Extract text content
                    const textMatch = block.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
                    // Extract datetime
                    const dateMatch = block.match(/<time[^>]*datetime="([^"]*)"[^>]*>/);

                    if (textMatch && dateMatch) {
                        // Clean HTML tags and entities
                        let text = textMatch[1]
                            .replace(/<br\s*\/?>/gi, '\n')
                            .replace(/<a[^>]*>([^<]*)<\/a>/g, '$1')  // Keep link text
                            .replace(/<i class="emoji"[^>]*><b>([^<]*)<\/b><\/i>/g, '$1')  // Keep emoji
                            .replace(/<[^>]*>/g, '')  // Remove remaining tags
                            .replace(/&nbsp;/g, ' ')
                            .replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&quot;/g, '"')
                            .trim();

                        if (text && text !== 'Channel created') {
                            messages.push({
                                text,
                                date: dateMatch[1],
                                id: Math.random().toString(36).substr(2, 9)
                            });
                        }
                    }
                }

                console.log(`Fetched ${messages.length} messages from Telegram channel: ${id}`);
                return messages.reverse(); // Newest first
            } catch (e) {
                console.error("Error fetching Telegram messages:", e);
                return [];
            }
        }

        const messages = await fetchTelegramMessages(channelId);

        const momentsContent = (
            <Layout title={t('moments', config.language)}>
                <Header />
                <main class="max-w-4xl mx-auto px-4 py-8">
                    {/* Page Header */}
                    <div class="text-center mb-12">
                        <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                            {t('moments', config.language)}
                        </h1>
                        <p class="text-zinc-600 dark:text-zinc-400 text-lg">
                            分享生活的点点滴滴 ✨
                        </p>
                    </div>

                    {messages.length > 0 ? (
                        <div class="space-y-6">
                            {messages.map((msg, idx) => (
                                <article
                                    key={msg.id}
                                    class="group relative bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-200/50 dark:border-zinc-700/50 hover:scale-[1.02] animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    {/* Decorative gradient overlay */}
                                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Time badge */}
                                    <div class="flex items-center gap-2 mb-4">
                                        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 shadow-md">
                                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                            </svg>
                                        </div>
                                        <time class="text-sm font-semibold text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text">
                                            {new Date(msg.date).toLocaleDateString('zh-CN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </time>
                                    </div>

                                    {/* Content */}
                                    <div class="relative">
                                        <div class="text-base leading-relaxed text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap break-words">
                                            {msg.text}
                                        </div>

                                        {/* Decorative quote mark */}
                                        <div class="absolute -left-2 -top-2 text-6xl text-teal-200 dark:text-teal-900/30 font-serif leading-none select-none pointer-events-none">
                                            "
                                        </div>
                                    </div>

                                    {/* Interaction hint */}
                                    <div class="mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div class="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
                                            <span class="flex items-center gap-1">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </span>
                                            <span class="flex items-center gap-1">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div class="text-xs text-zinc-400 dark:text-zinc-500">
                                            #{idx + 1}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div class="text-center py-20">
                            <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/20 dark:to-blue-900/20 mb-6">
                                <svg class="w-12 h-12 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 class="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">暂无说说内容</h3>
                            <p class="text-zinc-500 dark:text-zinc-400 mb-1">还没有发布任何动态</p>
                            <p class="text-sm text-zinc-400 dark:text-zinc-500">请检查 Telegram 频道 ID 是否正确且频道为公开状态</p>
                        </div>
                    )}

                    {/* Animations */}
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes fade-in-up {
                            from {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        .animate-fade-in-up {
                            animation: fade-in-up 0.6s ease-out forwards;
                            opacity: 0;
                        }
                        `
                    }} />

                    {/* Client-side Script */}
                    <script dangerouslySetInnerHTML={{
                        __html: `
                        (function() {
                            console.log("Moments page loaded with enhanced design ✨");
                            
                            // Add smooth scroll behavior
                            document.querySelectorAll('article').forEach((article, index) => {
                                article.style.setProperty('--delay', index * 0.1 + 's');
                            });
                        })();
                        `
                    }} />
                </main>
            </Layout>
        );
        momentsBuild = writeHtml(path.join(distDir, 'moments.html'), createHtml(momentsContent));
    }

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

        const aboutContent = (
            <Layout title={config.about.title || t('about', config.language)}>
                <Header />
                <main>
                    <div class="prose prose-zinc dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: processedAbout.toString() }} />
                </main>
            </Layout>
        );
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

        const projectsContent = (
            <Layout title={config.projects.title || t('projects', config.language)}>
                <Header />
                <main>
                    <div class="prose prose-zinc dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: processedProjects.toString() }} />
                </main>
            </Layout>
        );
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
    if (momentsBuild) allBuilds.push(momentsBuild);
    allBuilds.push(statsBuild);
    allBuilds.push(rssBuild);
    allBuilds.push(sitemapBuild);
    allBuilds.push(articlesBuild);
    allBuilds.push(...paginationBuilds);
    await Promise.all(allBuilds);

    const pageCount = posts.length + 1 + categories.size + tags.size + 3 + (config.about ? 1 : 0) + (config.projects ? 1 : 0) + 1 + 2 + 1; // +2 for RSS/Sitemap, +1 for Articles
    console.log(`Build complete! Generated ${pageCount} pages.`);
    console.log("Thanks for using ReWeave!ヾ(≧▽≦*)o -Powered By ReWeave Labs");
    console.log(`Content Version ${version}. Feel free to start an issue on Github!( •̀ ω •́ )✧ (https://github.com/xtawa/ReWeave)`);
}

build().catch(console.error);
