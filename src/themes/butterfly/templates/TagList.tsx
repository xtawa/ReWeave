/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { config } from '../../../core/config';
import { t } from '../../../core/i18n';

interface TagListProps {
    tags: Map<string, any[]>;
}

function safeSlug(str: string): string {
    if (/^[a-zA-Z0-9-_]+$/.test(str)) {
        return str;
    }
    return Buffer.from(str).toString('hex');
}

export function TagList({ tags }: TagListProps) {
    // Generate random colors for tags
    const colors = [
        'text-blue-500 hover:text-blue-600',
        'text-green-500 hover:text-green-600',
        'text-purple-500 hover:text-purple-600',
        'text-red-500 hover:text-red-600',
        'text-yellow-500 hover:text-yellow-600',
        'text-pink-500 hover:text-pink-600',
        'text-indigo-500 hover:text-indigo-600',
        'text-teal-500 hover:text-teal-600',
    ];

    return (
        <Layout title={t('tags', config.language)}>
            <Header />

            {/* Hero */}
            <div class="relative h-[40vh] min-h-[300px] w-full overflow-hidden mb-10">
                <div
                    class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)` }}
                ></div>
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                    <h1 class="text-4xl font-bold mb-4 drop-shadow-lg">{t('tags', config.language)}</h1>
                    <div class="text-xl opacity-90">{tags.size} {t('tags', config.language).toLowerCase()}</div>
                </div>
            </div>

            <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-8 animate-fade-in-up text-center">
                    <div class="flex flex-wrap justify-center gap-6">
                        {Array.from(tags.entries()).map(([tag, posts], index) => {
                            const fontSize = Math.min(1.5 + posts.length * 0.1, 3); // Dynamic font size
                            const colorClass = colors[index % colors.length];

                            return (
                                <a
                                    href={`/tags/${safeSlug(tag)}`}
                                    class={`inline-block transition-transform hover:scale-110 duration-200 ${colorClass}`}
                                    style={{ fontSize: `${fontSize}rem` }}
                                >
                                    {tag}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </main>
        </Layout>
    );
}
