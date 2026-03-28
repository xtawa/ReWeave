/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Pagination } from '../components/Pagination';
import { config } from '../../../config/theme/terminal.config';

interface Post {
    title: string;
    date: string;
    excerpt: string;
    slug: string;
    abbrlink?: string;
    tags?: string[];
}

interface PostListProps {
    posts: Post[];
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    title?: string;
    subtitle?: string;
}

function safeSlug(str: string): string {
    return /^[a-zA-Z0-9-_]+$/.test(str) ? str : Buffer.from(str).toString('hex');
}

export function PostList({ posts, currentPage, totalPages, baseUrl, title, subtitle }: PostListProps) {
    const pageTitle = title || (currentPage === 1 ? config.title : `${config.title} - Page ${currentPage}`);

    return (
        <Layout title={pageTitle} url={baseUrl}>
            <Header />
            {currentPage === 1 && !title && <Hero />}
            {title && (
                <section class="mb-8 bg-black/40 border border-emerald-500/20 p-4">
                    <h1 class="text-zinc-100 text-2xl"><span class="text-emerald-400 mr-2">$</span>{title}</h1>
                    {subtitle && <p class="text-zinc-400 mt-2">{subtitle}</p>}
                </section>
            )}
            <main class="space-y-4">
                {posts.map((post) => {
                    const postUrl = safeSlug(post.abbrlink || post.slug);
                    return (
                        <article class="bg-black/40 border border-emerald-500/20 rounded-none p-4">
                            <p class="text-zinc-400 text-sm mb-1"><span class="text-emerald-400">~/posts</span> {new Date(post.date).toLocaleDateString()}</p>
                            <h2 class="text-xl text-zinc-100 mb-2">
                                <a href={`/posts/${postUrl}`} class="no-underline hover:text-emerald-300 border-b border-transparent hover:border-emerald-400/70"> 
                                    <span class="text-emerald-400 mr-2">&gt;</span>{post.title}
                                </a>
                            </h2>
                            <p class="text-zinc-400">{post.excerpt}</p>
                            {post.tags && post.tags.length > 0 && (
                                <div class="mt-3 flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <a href={`/tags/${safeSlug(tag)}`} class="text-xs border border-emerald-500/30 px-2 py-1 text-zinc-300 no-underline hover:border-emerald-400/70 hover:text-emerald-300">
                                            #{tag}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </article>
                    );
                })}
                {totalPages > 1 && <Pagination current={currentPage} total={totalPages} baseUrl={baseUrl} />}
            </main>
        </Layout>
    );
}
