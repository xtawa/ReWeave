/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Comments } from '../components/Comments';

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
}

function safeSlug(str: string): string {
    return /^[a-zA-Z0-9-_]+$/.test(str) ? str : Buffer.from(str).toString('hex');
}

export function Post({ post, prevPost, nextPost }: PostProps) {
    return (
        <Layout title={post.title} url={`/posts/${safeSlug(post.slug)}`}>
            <Header />
            <main class="space-y-6">
                <article class="bg-black/40 border border-emerald-500/20 rounded-none p-5 md:p-8">
                    <p class="text-zinc-400 mb-2"><span class="text-emerald-400">$ cat</span> {post.title}</p>
                    <h1 class="text-3xl text-zinc-100 mb-3">{post.title}</h1>
                    <p class="text-zinc-400 text-sm mb-6">{new Date(post.date).toLocaleDateString()}</p>
                    <div class="prose prose-invert prose-zinc max-w-none font-mono prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-code:text-emerald-300 prose-strong:text-zinc-200" dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                {(prevPost || nextPost) && (
                    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            {prevPost && <a href={prevPost.url} class="block bg-black/40 border border-emerald-500/20 p-4 text-zinc-300 no-underline hover:border-emerald-400/70"><span class="text-emerald-400">&lt;</span> {prevPost.title}</a>}
                        </div>
                        <div>
                            {nextPost && <a href={nextPost.url} class="block bg-black/40 border border-emerald-500/20 p-4 text-zinc-300 no-underline hover:border-emerald-400/70 text-right">{nextPost.title} <span class="text-emerald-400">&gt;</span></a>}
                        </div>
                    </section>
                )}

                <Comments path={`/posts/${safeSlug(post.slug)}`} />
            </main>
        </Layout>
    );
}
