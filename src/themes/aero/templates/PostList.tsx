/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

interface PostListProps {
    posts: any[];
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export function PostList({ posts, currentPage, totalPages, baseUrl }: PostListProps) {
    return (
        <Layout title="首页">
            <Header />
            <div class="flex flex-col md:flex-row gap-6">
                <main class="flex-1 w-full min-w-0 md:mr-[340px]">
                    <div class="flex flex-col gap-6">
                        {posts.map(post => (
                            <article class="glass-card">
                                <div class="glass-header">
                                    <h2 class="text-lg m-0">
                                        <a href={`/posts/${post.slug || post.abbrlink}`} class="hover:text-blue-700 transition">
                                            {post.title}
                                        </a>
                                    </h2>
                                    <span class="text-xs text-slate-500">{new Date(post.date).toLocaleDateString()}</span>
                                </div>
                                <div class="glass-content">
                                    <p class="text-slate-700 text-sm leading-relaxed mb-4">
                                        {post.excerpt}
                                    </p>
                                    <div class="text-right">
                                        <a href={`/posts/${post.slug || post.abbrlink}`} class="aero-btn text-xs px-4 py-1">
                                            Read More...
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div class="flex justify-center gap-2 mt-4">
                                {currentPage > 1 && (
                                    <a href={`${baseUrl}/${currentPage - 1}`} class="aero-btn text-xs px-4 py-2">上一页</a>
                                )}
                                <span class="px-4 py-2 text-slate-600 text-sm font-bold">第 {currentPage} / {totalPages} 页</span>
                                {currentPage < totalPages && (
                                    <a href={`${baseUrl}/${currentPage + 1}`} class="aero-btn text-xs px-4 py-2">下一页</a>
                                )}
                            </div>
                        )}
                    </div>
                </main>

                {/* Fixed sidebar - desktop only */}
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
