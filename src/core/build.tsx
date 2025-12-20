/** @jsx h */
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { render } from 'preact-render-to-string';
import { h } from 'preact';
import { getPosts } from './markdown';
import { config } from './config';

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

    // 1. Get Posts (Parallel)
    const posts = await getPosts(contentDir);

    // Start CSS Build in background
    console.log("Building CSS...");
    const cssBuild = new Promise<void>((resolve, reject) => {
        exec('npx tailwindcss -i ./src/style.css -o ./dist/style.css', (error, stdout, stderr) => {
            if (error) {
                console.error(`CSS Build Error: ${error}`);
                reject(error);
                return;
            }
            if (stderr) console.error(`CSS Build Stderr: ${stderr}`);
            console.log("CSS built successfully.");
            resolve();
        });
    });

    // 2. Build Index Page
    const indexContent = (
        <Layout>
            <Header />
            <main>
                <div class="space-y-10">
                    {posts.map((post) => (
                        <article key={post.slug} class="group relative flex flex-col items-start">
                            <h2 class="text-xl font-semibold text-gray-900 group-hover:text-gray-600">
                                <a href={`/posts/${post.slug}.html`}>
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
                                Read article
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </Layout>
    );

    const indexBuild = fs.writeFile(path.join(distDir, 'index.html'), createHtml(indexContent));

    // 3. Build Post Pages (Parallel)
    const postsDir = path.join(distDir, 'posts');
    await fs.mkdir(postsDir, { recursive: true });

    const postBuilds = posts.map(post => {
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
                            </header>
                            <div class="mt-8 prose prose-zinc dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
                        </article>
                    </div>
                </div>
            </Layout>
        );
        return fs.writeFile(path.join(postsDir, `${post.slug}.html`), createHtml(postContent));
    });

    // Wait for all tasks
    await Promise.all([indexBuild, ...postBuilds, cssBuild]);

    console.log(`Build complete! Generated ${posts.length + 1} pages.`);
}

build().catch(console.error);
