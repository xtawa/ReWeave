/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

interface PostProps {
    post: {
        title: string;
        content: string;
        date: string;
        toc?: string;
        tags?: string[];
    };
    prevPost?: { title: string; url: string };
    nextPost?: { title: string; url: string };
}

export function Post({ post, prevPost, nextPost }: PostProps) {
    return (
        <Layout title={post.title} updatedDate={post.date}>
            <Header />
            <div class="flex flex-col md:flex-row gap-6">
                {/* Main scrollable content */}
                <main class="flex-1 w-full min-w-0 md:mr-[340px]">
                    <article class="glass-card">
                        <div class="glass-header -mx-0 -mt-0 rounded-t-lg px-6 py-4 border-b border-white/50">
                            <div class="flex flex-col">
                                <h1 class="text-3xl font-bold m-0 text-slate-800 drop-shadow-sm">{post.title}</h1>
                                <div class="mt-2 text-sm text-slate-600 flex gap-4">
                                    <span>📅 {new Date(post.date).toLocaleDateString()}</span>
                                    {post.tags && <span>🏷️ {post.tags.join(', ')}</span>}
                                </div>
                            </div>
                        </div>

                        <div class="glass-content p-6">
                            {/* Content */}
                            <div
                                class="prose prose-slate max-w-none prose-img:rounded-lg prose-img:shadow-md prose-headings:text-slate-800"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>

                        {/* Navigation */}
                        <div class="p-4 border-t border-white/50 bg-white/30 flex justify-between rounded-b-lg">
                            {prevPost ? (
                                <a href={prevPost.url} class="text-sm font-semibold text-blue-700 hover:text-blue-900 flex items-center">
                                    &larr; {prevPost.title}
                                </a>
                            ) : <div></div>}

                            {nextPost ? (
                                <a href={nextPost.url} class="text-sm font-semibold text-blue-700 hover:text-blue-900 flex items-center">
                                    {nextPost.title} &rarr;
                                </a>
                            ) : <div></div>}
                        </div>
                    </article>
                </main>

                {/* Fixed sidebar - hidden on mobile, fixed on desktop */}
                <div class="hidden md:block fixed right-4 top-20 w-80 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
                    {post.toc && (
                        <div class="glass-card p-4">
                            <div class="glass-header -mx-4 -mt-4 mb-2 rounded-t text-sm font-bold px-4 py-2">
                                目录
                            </div>
                            <div
                                class="text-sm space-y-1 max-h-[35vh] overflow-y-auto custom-scrollbar"
                                dangerouslySetInnerHTML={{ __html: post.toc }}
                            />
                        </div>
                    )}
                    <Sidebar />
                </div>

                {/* Mobile sidebar - shows at bottom on mobile */}
                <div class="md:hidden w-full space-y-4">
                    <Sidebar />
                </div>
            </div>
        </Layout>
    );
}
