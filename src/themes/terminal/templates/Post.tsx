/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Comments } from '../components/Comments';
import { reweaveConfig } from '../../../config/reweave.config';
import { t } from '../../../core/i18n';

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

function safeSlug(str: string): string {
    if (/^[a-zA-Z0-9-_]+$/.test(str)) return str;
    return encodeURIComponent(str);
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
                        class="order-first flex items-center text-base"
                        style="color: var(--terminal-fg-dim);"
                    >
                        <span class="h-4 w-0.5 rounded-full" style="background: var(--terminal-accent);" />
                        <span class="ml-3">
                            {new Date(post.date).toLocaleDateString(
                                reweaveConfig.language === 'zh' ? 'zh-CN' : 'en-US',
                                { year: 'numeric', month: 'long', day: 'numeric' }
                            )}
                        </span>
                    </time>
                    <h1 class="mt-6 text-3xl md:text-4xl font-bold tracking-tight pb-4 relative" style="color: var(--terminal-accent); border-bottom: 3px dotted var(--terminal-accent);">
                        {post.title}
                        <span class="absolute bottom-[2px] left-0 w-full" style="border-bottom: 3px dotted var(--terminal-accent);" />
                    </h1>
                    {post.tags && post.tags.length > 0 && (
                        <div class="mt-4 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <a
                                    href={`/tags/${safeSlug(tag)}`}
                                    class="inline-flex items-center px-3 py-1 text-sm font-medium no-underline transition"
                                    style="color: var(--terminal-accent); border: 1px solid var(--terminal-border);"
                                    onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = 'var(--terminal-accent)'; }}
                                    onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = 'var(--terminal-border)'; }}
                                >
                                    #{tag}
                                </a>
                            ))}
                        </div>
                    )}
                </header>

                {/* TOC */}
                {post.toc && (
                    <div class="mt-8" dangerouslySetInnerHTML={{ __html: post.toc }} />
                )}

                <div
                    class="mt-8 prose prose-zinc dark:prose-invert max-w-none"
                    style="color: var(--terminal-fg);"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>

            {/* Prev/Next navigation */}
            {(prevPost || nextPost) && (
                <nav class="mt-12 pt-8" style="border-top: 1px solid var(--terminal-border);">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {prevPost ? (
                            <a
                                href={prevPost.url}
                                class="group flex flex-col p-5 transition no-underline"
                                style="border: 1px solid var(--terminal-border);"
                                onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = 'var(--terminal-accent)'; }}
                                onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = 'var(--terminal-border)'; }}
                            >
                                <span class="text-xs font-medium mb-1" style="color: var(--terminal-fg-dim);">
                                    {t('articles', reweaveConfig.language) === 'Articles' ? 'Previous' : '上一篇'}
                                </span>
                                <span class="text-sm font-medium transition" style="color: var(--terminal-fg);">
                                    {prevPost.title}
                                </span>
                            </a>
                        ) : (
                            <div />
                        )}
                        {nextPost ? (
                            <a
                                href={nextPost.url}
                                class="group flex flex-col items-end text-right p-5 transition no-underline"
                                style="border: 1px solid var(--terminal-border);"
                                onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = 'var(--terminal-accent)'; }}
                                onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = 'var(--terminal-border)'; }}
                            >
                                <span class="text-xs font-medium mb-1" style="color: var(--terminal-fg-dim);">
                                    {t('articles', reweaveConfig.language) === 'Articles' ? 'Next' : '下一篇'}
                                </span>
                                <span class="text-sm font-medium transition" style="color: var(--terminal-fg);">
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
