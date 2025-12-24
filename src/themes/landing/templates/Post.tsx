/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Post as PostType } from '../../../core/markdown';

interface PostProps {
    post: PostType;
    prevPost?: { title: string; url: string };
    nextPost?: { title: string; url: string };
}

export function Post({ post, prevPost, nextPost }: PostProps) {
    return (
        <Layout title={post.title} description={post.excerpt} image={post.image}>
            <Header />
            <main class="pt-24 pb-16">
                <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header class="text-center mb-12">
                        <time class="text-zinc-500 dark:text-zinc-400 mb-4 block">
                            {new Date(post.date).toLocaleDateString()}
                        </time>
                        <h1 class="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                            {post.title}
                        </h1>
                        {post.tags && post.tags.length > 0 && (
                            <div class="flex flex-wrap justify-center gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} class="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1 rounded-full text-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Content */}
                    <div
                        class="prose prose-lg prose-blue dark:prose-invert mx-auto"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Navigation */}
                    <div class="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between gap-4">
                        {prevPost ? (
                            <a href={prevPost.url} class="group flex flex-col items-start">
                                <span class="text-sm text-zinc-500 mb-1">Previous</span>
                                <span class="text-lg font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                                    &larr; {prevPost.title}
                                </span>
                            </a>
                        ) : <div />}
                        {nextPost && (
                            <a href={nextPost.url} class="group flex flex-col items-end text-right">
                                <span class="text-sm text-zinc-500 mb-1">Next</span>
                                <span class="text-lg font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                                    {nextPost.title} &rarr;
                                </span>
                            </a>
                        )}
                    </div>
                </article>
            </main>
        </Layout>
    );
}
