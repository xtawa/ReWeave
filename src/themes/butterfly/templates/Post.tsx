/** @jsx h */
import { h, Fragment } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Comments } from '../components/Comments';
import { config } from '../config';

interface PostProps {
    post: {
        title: string;
        date: string;
        content: string; // HTML content
        slug: string;
        tags?: string[];
        category?: string;
        toc?: string; // HTML TOC
    };
    prevPost?: { title: string; url: string };
    nextPost?: { title: string; url: string };
}

function safeSlug(str: string): string {
    if (/^[a-zA-Z0-9-_]+$/.test(str)) {
        return str;
    }
    return Buffer.from(str).toString('hex');
}

export function Post({ post, prevPost, nextPost }: PostProps) {
    return (
        <Layout title={post.title}>
            <Header />

            {/* Post Hero */}
            <div class="relative h-[50vh] min-h-[400px] w-full overflow-hidden mb-10">
                <div
                    class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(https://source.unsplash.com/random/1920x1080?sig=${post.slug})` }}
                ></div>
                <div class="absolute inset-0 bg-black/50"></div>
                <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4 animate-fade-in-up">
                    <div class="text-sm mb-4 opacity-80">
                        <time datetime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                        {post.category && (
                            <>
                                <span class="mx-2">|</span>
                                <span>{post.category}</span>
                            </>
                        )}
                    </div>
                    <h1 class="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg max-w-4xl leading-tight">{post.title}</h1>
                    <div class="flex gap-4 text-sm opacity-80">
                        {post.tags?.map(tag => (
                            <span>#{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Article Content */}
                    <div class="lg:col-span-3">
                        <article class="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-8 mb-8 animate-fade-in-up">
                            <div class="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                            {/* Copyright / License Info could go here */}
                            <div class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                                <p>本文由 {config.hero?.name} 创作，采用 CC BY-NC-SA 4.0 协议。</p>
                            </div>
                        </article>

                        {/* Post Navigation */}
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {prevPost ? (
                                <a href={prevPost.url} class="block p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-md hover:shadow-lg transition group">
                                    <div class="text-xs text-gray-500 mb-1">PREVIOUS POST</div>
                                    <div class="font-bold text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors truncate">{prevPost.title}</div>
                                </a>
                            ) : <div></div>}
                            {nextPost ? (
                                <a href={nextPost.url} class="block p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-md hover:shadow-lg transition group text-right">
                                    <div class="text-xs text-gray-500 mb-1">NEXT POST</div>
                                    <div class="font-bold text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors truncate">{nextPost.title}</div>
                                </a>
                            ) : <div></div>}
                        </div>

                        {/* Comments */}
                        <Comments path={`/posts/${safeSlug(post.slug)}`} />
                    </div>

                    {/* Sidebar with TOC */}
                    <div class="hidden lg:block lg:col-span-1 space-y-8">
                        <div class="sticky top-24 space-y-8">
                            {/* Profile Card */}
                            <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 text-center">
                                <img
                                    src={config.hero?.avatar.startsWith('http') ? config.hero.avatar : `/${config.hero?.avatar}`}
                                    alt="Avatar"
                                    class="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-200 dark:border-gray-700"
                                />
                                <h3 class="text-lg font-bold mb-2 dark:text-white">{config.hero?.name}</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{config.hero?.description}</p>
                            </div>

                            {/* TOC */}
                            {post.toc && (
                                <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6">
                                    <h3 class="font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                                        <i class="fas fa-list-ul mr-2"></i> CATALOG
                                    </h3>
                                    <div dangerouslySetInnerHTML={{ __html: post.toc }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
