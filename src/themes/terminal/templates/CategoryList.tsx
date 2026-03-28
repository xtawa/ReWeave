/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { t } from '../../../core/i18n';
import { config } from '../../../config/theme/terminal.config';

interface CategoryListProps {
    categories: Map<string, any[]>;
}

function safeSlug(str: string): string {
    return /^[a-zA-Z0-9-_]+$/.test(str) ? str : Buffer.from(str).toString('hex');
}

export function CategoryList({ categories }: CategoryListProps) {
    return (
        <Layout title={t('categories', config.language)} url="/categories">
            <Header />
            <main class="bg-black/40 border border-emerald-500/20 p-5">
                <h1 class="text-3xl text-zinc-100 mb-4"><span class="text-emerald-400 mr-2">&gt;</span>{t('categories', config.language)}</h1>
                <div class="space-y-2">
                    {Array.from(categories.entries()).map(([category, posts]) => (
                        <a href={`/categories/${safeSlug(category)}`} class="flex items-center justify-between border border-emerald-500/30 px-3 py-2 text-zinc-300 no-underline hover:border-cyan-400 hover:text-cyan-300">
                            <span>~/{category}</span>
                            <span class="text-zinc-500">{posts.length}</span>
                        </a>
                    ))}
                </div>
            </main>
        </Layout>
    );
}
