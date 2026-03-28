/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { t } from '../../../core/i18n';
import { config } from '../../../config/theme/terminal.config';

interface TagListProps {
    tags: Map<string, any[]>;
}

function safeSlug(str: string): string {
    return /^[a-zA-Z0-9-_]+$/.test(str) ? str : Buffer.from(str).toString('hex');
}

export function TagList({ tags }: TagListProps) {
    return (
        <Layout title={t('tags', config.language)} url="/tags">
            <Header />
            <main class="bg-black/40 border border-emerald-500/20 p-5">
                <h1 class="text-3xl text-zinc-100 mb-4"><span class="text-emerald-400 mr-2">&gt;</span>{t('tags', config.language)}</h1>
                <div class="flex flex-wrap gap-2">
                    {Array.from(tags.entries()).map(([tag, posts]) => (
                        <a href={`/tags/${safeSlug(tag)}`} class="border border-emerald-500/30 px-3 py-1 text-zinc-300 no-underline hover:border-cyan-400 hover:text-cyan-300">
                            #{tag} <span class="text-zinc-500">({posts.length})</span>
                        </a>
                    ))}
                </div>
            </main>
        </Layout>
    );
}
