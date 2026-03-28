/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { t } from '../../../core/i18n';
import { config } from '../../../config/theme/terminal.config';

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
    return /^[a-zA-Z0-9-_]+$/.test(str) ? str : Buffer.from(str).toString('hex');
}

export function Archive({ posts, categoriesCount, tagsCount }: ArchiveProps) {
    const postsByYear = new Map<number, Post[]>();
    posts.forEach((post) => {
        const year = new Date(post.date).getFullYear();
        if (!postsByYear.has(year)) postsByYear.set(year, []);
        postsByYear.get(year)!.push(post);
    });
    const years = Array.from(postsByYear.keys()).sort((a, b) => b - a);

    return (
        <Layout title={t('archive', config.language)} url="/archive">
            <Header />
            <main class="bg-black/40 border border-emerald-500/20 p-5 space-y-6">
                <h1 class="text-3xl text-zinc-100"><span class="text-emerald-400 mr-2">&gt;</span>{t('archive', config.language)}</h1>
                <div class="flex flex-wrap gap-3">
                    <a href="/categories" class="border border-emerald-500/30 px-3 py-1 text-zinc-300 no-underline hover:border-emerald-400/70">categories: {categoriesCount}</a>
                    <a href="/tags" class="border border-emerald-500/30 px-3 py-1 text-zinc-300 no-underline hover:border-emerald-400/70">tags: {tagsCount}</a>
                </div>
                {years.map((year) => (
                    <section>
                        <h2 class="text-zinc-200 text-xl mb-3">$ ls {year}/</h2>
                        <ul class="space-y-2">
                            {postsByYear.get(year)!.map((post) => (
                                <li>
                                    <a href={`/posts/${safeSlug(post.abbrlink || post.slug)}`} class="text-zinc-300 no-underline border-b border-transparent hover:border-emerald-400/70 hover:text-emerald-300">
                                        <span class="text-emerald-400 mr-2">-rw-r--r--</span>{post.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </main>
        </Layout>
    );
}
