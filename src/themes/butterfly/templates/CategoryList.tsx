/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { config } from '../../../core/config';
import { t } from '../../../core/i18n';

interface CategoryListProps {
    categories: Map<string, any[]>;
}

function safeSlug(str: string): string {
    if (/^[a-zA-Z0-9-_]+$/.test(str)) {
        return str;
    }
    return Buffer.from(str).toString('hex');
}

export function CategoryList({ categories }: CategoryListProps) {
    return (
        <Layout title={t('categories', config.language)}>
            <Header />

            {/* Hero */}
            <div class="relative h-[40vh] min-h-[300px] w-full overflow-hidden mb-10">
                <div
                    class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)` }}
                ></div>
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                    <h1 class="text-4xl font-bold mb-4 drop-shadow-lg">{t('categories', config.language)}</h1>
                    <div class="text-xl opacity-90">{categories.size} {t('categories', config.language).toLowerCase()}</div>
                </div>
            </div>

            <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-8 animate-fade-in-up">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {Array.from(categories.entries()).map(([category, posts]) => (
                            <a
                                href={`/categories/${safeSlug(category)}`}
                                class="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-zinc-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-100 dark:border-zinc-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 group"
                            >
                                <span class="font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate mr-2">
                                    <i class="far fa-folder mr-2 opacity-70"></i>
                                    {category}
                                </span>
                                <span class="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-zinc-600 text-gray-600 dark:text-gray-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {posts.length}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </main>
        </Layout>
    );
}
