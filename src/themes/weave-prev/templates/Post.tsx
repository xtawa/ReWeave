/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Comments } from '../components/Comments';
import { reweaveConfig } from '../../../config/reweave.config';
import { t } from '../../../core/i18n';
import { safeSlug } from '../../../core/utils/sanitize';

interface PostProps {
    post: {
        title: string;
        date: string;
        content: string;
        slug: string;
        tags?: string[];
        toc?: string;
    };
    prevPost?: { title: string; url: string };
    nextPost?: { title: string; url: string };
    hasCode?: boolean;
    hasMath?: boolean;
    hasMermaid?: boolean;
}

export function Post({ post, prevPost, nextPost, hasCode, hasMath, hasMermaid }: PostProps) {
    const postUrl = safeSlug(post.slug);

    return (
        <Layout
            title={post.title}
            url={`/posts/${postUrl}`}
            hasCode={hasCode}
            hasMath={hasMath}
            hasMermaid={hasMermaid}
        >
            <Header />

            <article>
                <header class="flex flex-col">
                    <time
                        datetime={post.date}
                        class="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
                    >
                        <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                        <span class="ml-3">
                            {new Date(post.date).toLocaleDateString(
                                reweaveConfig.language === 'zh' ? 'zh-CN' : 'en-US',
                                { year: 'numeric', month: 'long', day: 'numeric' }
                            )}
                        </span>
                    </time>
                    <h1 class="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                        {post.title}
                    </h1>
                    {post.tags && post.tags.length > 0 && (
                        <div class="mt-4 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <a
                                    href={`/tags/${safeSlug(tag)}`}
                                    class="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
                                >
                                    #{tag}
                                </a>
                            ))}
                        </div>
                    )}
                </header>

                <div
                    class="mt-8 prose prose-zinc dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>

            {/* Prev/Next navigation */}
            {(prevPost || nextPost) && (
                <nav class="mt-12 border-t border-zinc-200 dark:border-zinc-700/50 pt-8">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {prevPost ? (
                            <a
                                href={prevPost.url}
                                class="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-700/50 p-5 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition"
                            >
                                <span class="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">
                                    {t('articles', reweaveConfig.language) === 'Articles' ? 'Previous' : '上一篇'}
                                </span>
                                <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                                    {prevPost.title}
                                </span>
                            </a>
                        ) : (
                            <div />
                        )}
                        {nextPost ? (
                            <a
                                href={nextPost.url}
                                class="group flex flex-col items-end text-right rounded-2xl border border-zinc-200 dark:border-zinc-700/50 p-5 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition"
                            >
                                <span class="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">
                                    {t('articles', reweaveConfig.language) === 'Articles' ? 'Next' : '下一篇'}
                                </span>
                                <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                                    {nextPost.title}
                                </span>
                            </a>
                        ) : (
                            <div />
                        )}
                    </div>
                </nav>
            )}

            <Comments path={`/posts/${postUrl}`} />
        </Layout>
    );
}
