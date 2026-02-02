/** @jsx h */
import { h, Fragment } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

interface Post {
    title: string;
    date: string;
    slug: string;
    abbrlink?: string;
}

interface ArchiveProps {
    posts: Post[];
    categoriesCount: number;
    tagsCount: number;
}

function safeSlug(str: string): string {
    if (/^[a-zA-Z0-9-_]+$/.test(str)) {
        return str;
    }
    return Buffer.from(str).toString('hex');
}

export function Archive({ posts, categoriesCount, tagsCount }: ArchiveProps) {
    const postsByYear = new Map<number, Post[]>();
    posts.forEach(post => {
        const year = new Date(post.date).getFullYear();
        if (!postsByYear.has(year)) {
            postsByYear.set(year, []);
        }
        postsByYear.get(year)!.push(post);
    });
    const years = Array.from(postsByYear.keys()).sort((a, b) => b - a);

    return (
        <Layout title="归档">
            <Header />
            <div class="flex flex-col md:flex-row gap-6">
                <main class="flex-1 w-full min-w-0 md:mr-[340px]">
                    <div class="glass-card">
                        <div class="glass-header">
                            <h1 class="text-2xl font-bold m-0">📚 归档</h1>
                        </div>
                        <div class="glass-content">
                            {/* Stats Cards */}
                            <div class="grid grid-cols-2 gap-4 mb-8">
                                <a href="/categories" class="glass-panel p-4 text-center hover:scale-105 transition-transform">
                                    <div class="text-3xl font-bold text-blue-600">{categoriesCount}</div>
                                    <div class="text-sm text-slate-600">分类</div>
                                </a>
                                <a href="/tags" class="glass-panel p-4 text-center hover:scale-105 transition-transform">
                                    <div class="text-3xl font-bold text-teal-600">{tagsCount}</div>
                                    <div class="text-sm text-slate-600">标签</div>
                                </a>
                            </div>

                            {/* Timeline */}
                            <div class="relative border-l-2 border-blue-400/50 ml-3 space-y-8 pb-4">
                                {years.map(year => (
                                    <div key={year} class="relative">
                                        <div class="absolute -left-[21px] top-0 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-sm font-bold text-blue-600">
                                            {year}
                                        </div>
                                        <div class="space-y-3 pl-10">
                                            {postsByYear.get(year)!.map(post => (
                                                <article key={post.slug} class="archive-item rounded-lg hover:bg-blue-100/30 transition-all duration-300 p-3 -ml-3">
                                                    <div class="flex items-center gap-4">
                                                        <time datetime={post.date} class="text-xs text-slate-500 w-16 flex-shrink-0">
                                                            {new Date(post.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                                                        </time>
                                                        <h3 class="text-base text-slate-700 hover:text-blue-600 transition-colors">
                                                            <a href={`/posts/${safeSlug(post.abbrlink || post.slug)}`}>
                                                                {post.title}
                                                            </a>
                                                        </h3>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Fixed sidebar */}
                <div class="hidden md:block fixed right-4 top-20 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto">
                    <Sidebar />
                </div>

                {/* Mobile sidebar */}
                <div class="md:hidden w-full">
                    <Sidebar />
                </div>
            </div>
        </Layout>
    );
}
