/** @jsx h */
import fs from 'fs/promises';
import path from 'path';
import { render } from 'preact-render-to-string';
import { h } from 'preact';
import { getPosts } from './markdown';
import { config } from './config';
import { t } from './i18n';

// Helper to create HTML string
function createHtml(content: any) {
    return '<!DOCTYPE html>' + render(content);
}

async function build() {
    const rootDir = process.cwd();
    const contentDir = path.join(rootDir, 'src', 'content');
    const distDir = path.join(rootDir, 'dist');

    // Dynamic Theme Import
    const themePath = `../themes/${config.themeName}`;
    const { Layout } = await import(`${themePath}/layouts/Layout`);
    const { Header } = await import(`${themePath}/components/Header`);

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

    // 2. Build Index Page
    const indexContent = (
        <Layout>
            <Header />
            <main>
                <div class="space-y-10">
                    {posts.map((post) => {
                        const postUrl = post.abbrlink || post.slug;
                        return (
                            <article key={post.slug} class="group relative flex flex-col items-start">
                                <h2 class="text-xl font-semibold text-gray-900 group-hover:text-gray-600">
                                    <a href={`/posts/${postUrl}.html`}>
                                        <span class="absolute inset-0" />
                                        {post.title}
                                    </a>
                                </h2>
                                <time class="relative z-10 order-first mb-3 flex items-center text-sm text-gray-400 pl-3.5" datetime={post.date}>
                                    <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                                        <span class="h-4 w-0.5 rounded-full bg-gray-200" />
                                    </span>
                                    {new Date(post.date).toLocaleDateString()}
                                </time>
                                <p class="relative z-10 mt-2 text-sm text-gray-600">{post.excerpt}</p>
                                <div class="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500">
                                    {t('readMore', config.language)}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </main>
        </Layout>
    );

    const indexBuild = fs.writeFile(path.join(distDir, 'index.html'), createHtml(indexContent));

    // 3. Build Post Pages (Parallel)
    const postsDir = path.join(distDir, 'posts');
    await fs.mkdir(postsDir, { recursive: true });

    const postBuilds = posts.map(post => {
        const postUrl = post.abbrlink || post.slug;
        const postContent = (
            <Layout title={post.title} description={post.excerpt} image={post.image}>
                <Header />
                <div class="xl:relative">
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
                                            <a href={`/tags/${tag}.html`} class="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition">
                                                #{tag}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </header>
                            <div class="mt-8 prose prose-zinc dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
                        </article>
                    </div>
                </div>
            </Layout>
        );
        return fs.writeFile(path.join(postsDir, `${postUrl}.html`), createHtml(postContent));
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
    await fs.mkdir(categoriesDir, { recursive: true });

    const categoryBuilds = Array.from(categories.entries()).map(([category, categoryPosts]) => {
        const categoryContent = (
            <Layout title={`${t('category', config.language)}: ${category}`}>
                <Header />
                <main>
                    <h1 class="text-4xl font-bold mb-8">{t('category', config.language)}: {category}</h1>
                    <div class="space-y-10">
                        {categoryPosts.map((post) => {
                            const postUrl = post.abbrlink || post.slug;
                            return (
                                <article key={post.slug} class="group relative flex flex-col items-start">
                                    <h2 class="text-xl font-semibold text-gray-900 group-hover:text-gray-600">
                                        <a href={`/posts/${postUrl}.html`}>
                                            <span class="absolute inset-0" />
                                            {post.title}
                                        </a>
                                    </h2>
                                    <time class="relative z-10 order-first mb-3 flex items-center text-sm text-gray-400 pl-3.5" datetime={post.date}>
                                        <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                                            <span class="h-4 w-0.5 rounded-full bg-gray-200" />
                                        </span>
                                        {new Date(post.date).toLocaleDateString()}
                                    </time>
                                    <p class="relative z-10 mt-2 text-sm text-gray-600">{post.excerpt}</p>
                                </article>
                            );
                        })}
                    </div>
                </main>
            </Layout>
        );
        return fs.writeFile(path.join(categoriesDir, `${category}.html`), createHtml(categoryContent));
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
    await fs.mkdir(tagsDir, { recursive: true });

    const tagBuilds = Array.from(tags.entries()).map(([tag, tagPosts]) => {
        const tagContent = (
            <Layout title={`${t('tag', config.language)}: ${tag}`}>
                <Header />
                <main>
                    <h1 class="text-4xl font-bold mb-8">{t('tag', config.language)}: {tag}</h1>
                    <div class="space-y-10">
                        {tagPosts.map((post) => {
                            const postUrl = post.abbrlink || post.slug;
                            return (
                                <article key={post.slug} class="group relative flex flex-col items-start">
                                    <h2 class="text-xl font-semibold text-gray-900 group-hover:text-gray-600">
                                        <a href={`/posts/${postUrl}.html`}>
                                            <span class="absolute inset-0" />
                                            {post.title}
                                        </a>
                                    </h2>
                                    <time class="relative z-10 order-first mb-3 flex items-center text-sm text-gray-400 pl-3.5" datetime={post.date}>
                                        <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                                            <span class="h-4 w-0.5 rounded-full bg-gray-200" />
                                        </span>
                                        {new Date(post.date).toLocaleDateString()}
                                    </time>
                                    <p class="relative z-10 mt-2 text-sm text-gray-600">{post.excerpt}</p>
                                </article>
                            );
                        })}
                    </div>
                </main>
            </Layout>
        );
        return fs.writeFile(path.join(tagsDir, `${tag}.html`), createHtml(tagContent));
    });

    // 6. Build Archive Page
    const archiveContent = (
        <Layout title={t('archive', config.language)}>
            <Header />
            <main>
                <h1 class="text-4xl font-bold mb-8">{t('archive', config.language)}</h1>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <a href="/categories.html" class="block p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition">
                        <h2 class="text-2xl font-semibold mb-2">{t('categories', config.language)}</h2>
                        <p class="text-gray-600 dark:text-gray-400">{categories.size} {t('categories', config.language).toLowerCase()}</p>
                    </a>
                    <a href="/tags.html" class="block p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition">
                        <h2 class="text-2xl font-semibold mb-2">{t('tags', config.language)}</h2>
                        <p class="text-gray-600 dark:text-gray-400">{tags.size} {t('tags', config.language).toLowerCase()}</p>
                    </a>
                </div>
            </main>
        </Layout>
    );
    const archiveBuild = fs.writeFile(path.join(distDir, 'archive.html'), createHtml(archiveContent));

    // 7. Build Categories List Page
    const categoriesListContent = (
        <Layout title={t('categories', config.language)}>
            <Header />
            <main>
                <h1 class="text-4xl font-bold mb-8">{t('categories', config.language)}</h1>
                <div class="flex flex-wrap gap-4">
                    {Array.from(categories.entries()).map(([category, categoryPosts]) => (
                        <a href={`/categories/${category}.html`} class="inline-flex items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
                            <span class="font-medium">{category}</span>
                            <span class="ml-2 text-sm text-gray-500">({categoryPosts.length})</span>
                        </a>
                    ))}
                </div>
            </main>
        </Layout>
    );
    const categoriesListBuild = fs.writeFile(path.join(distDir, 'categories.html'), createHtml(categoriesListContent));

    // 8. Build Tags List Page
    const tagsListContent = (
        <Layout title={t('tags', config.language)}>
            <Header />
            <main>
                <h1 class="text-4xl font-bold mb-8">{t('tags', config.language)}</h1>
                <div class="flex flex-wrap gap-3">
                    {Array.from(tags.entries()).map(([tag, tagPosts]) => (
                        <a href={`/tags/${tag}.html`} class="inline-flex items-center px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full hover:bg-teal-200 dark:hover:bg-teal-800 transition text-sm">
                            #{tag}
                            <span class="ml-1 text-xs">({tagPosts.length})</span>
                        </a>
                    ))}
                </div>
            </main>
        </Layout>
    );
    const tagsListBuild = fs.writeFile(path.join(distDir, 'tags.html'), createHtml(tagsListContent));

    // 9. Build About Page
    let aboutBuild: Promise<void> | null = null;
    if (config.about) {
        const { unified } = await import('unified');
        const remarkParse = (await import('remark-parse')).default;
        const remarkRehype = (await import('remark-rehype')).default;
        const rehypeStringify = (await import('rehype-stringify')).default;

        const processedAbout = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeStringify)
            .process(config.about.content);

        const aboutContent = (
            <Layout title={config.about.title || t('about', config.language)}>
                <Header />
                <main>
                    <h1 class="text-4xl font-bold mb-8">{config.about.title || t('about', config.language)}</h1>
                    <div class="prose prose-zinc dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: processedAbout.toString() }} />
                </main>
            </Layout>
        );
        aboutBuild = fs.writeFile(path.join(distDir, 'about.html'), createHtml(aboutContent));
    }

    // 10. Build Projects Page
    let projectsBuild: Promise<void> | null = null;
    if (config.projects) {
        const projectsContent = (
            <Layout title={config.projects.title || t('projects', config.language)}>
                <Header />
                <main>
                    <h1 class="text-4xl font-bold mb-8">{config.projects.title || t('projects', config.language)}</h1>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {config.projects.items.map(project => (
                            <div class="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition">
                                <h2 class="text-2xl font-semibold mb-2">
                                    {project.url ? (
                                        <a href={project.url} class="text-teal-600 dark:text-teal-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                            {project.name}
                                        </a>
                                    ) : (
                                        project.name
                                    )}
                                </h2>
                                <p class="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                                {project.tags && project.tags.length > 0 && (
                                    <div class="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span class="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </Layout>
        );
        projectsBuild = fs.writeFile(path.join(distDir, 'projects.html'), createHtml(projectsContent));
    }

    // Wait for all tasks
    const allBuilds = [indexBuild, ...postBuilds, ...categoryBuilds, ...tagBuilds, archiveBuild, categoriesListBuild, tagsListBuild, cssBuild];
    if (aboutBuild) allBuilds.push(aboutBuild);
    if (projectsBuild) allBuilds.push(projectsBuild);
    await Promise.all(allBuilds);

    const pageCount = posts.length + 1 + categories.size + tags.size + 3 + (config.about ? 1 : 0) + (config.projects ? 1 : 0);
    console.log(`Build complete! Generated ${pageCount} pages.`);
}

build().catch(console.error);
