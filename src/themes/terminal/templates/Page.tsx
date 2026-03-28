/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Comments } from '../components/Comments';

interface PageProps {
    title: string;
    content: string;
    slug?: string;
}

export function Page({ title, content, slug }: PageProps) {
    return (
        <Layout title={title} url={slug ? `/${slug}` : undefined}>
            <Header />
            <main class="space-y-6">
                <section class="bg-black/40 border border-emerald-500/20 rounded-none p-5 md:p-8">
                    <h1 class="text-zinc-100 text-3xl mb-4"><span class="text-emerald-400 mr-2">$</span>{title}</h1>
                    <div class="prose prose-invert prose-zinc max-w-none font-mono prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-a:text-emerald-400 hover:prose-a:text-emerald-300" dangerouslySetInnerHTML={{ __html: content }} />
                </section>
                {slug && <Comments path={`/${slug}`} />}
            </main>
        </Layout>
    );
}
