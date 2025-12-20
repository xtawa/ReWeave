/** @jsx h */
import { h, Fragment } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { config } from '../../../core/config';
import { t } from '../../../core/i18n';

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
    if (/^[a-zA-Z0-9-_]+$/.test(str)) {
        return str;
    }
    return Buffer.from(str).toString('hex');
}

export function Archive({ posts, categoriesCount, tagsCount }: ArchiveProps) {
    // Group posts by year
    const postsByYear = new Map<number, Post[]>();
    posts.forEach(post => {
        const year = new Date(post.date).getFullYear();
        if (!postsByYear.has(year)) {
            postsByYear.set(year, []);
        }
        postsByYear.get(year)!.push(post);
    });
    const years = Array.from(postsByYear.keys()).sort((a, b) => b - a);

    return (
        <Layout title={t('archive', config.language)}>
            <Header />

            {/* Hero for Archive */}
            <div class="relative h-[40vh] min-h-[300px] w-full overflow-hidden mb-10">
                <div
                    class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)` }}
                ></div>
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                    <h1 class="text-4xl font-bold mb-4 drop-shadow-lg">{t('archive', config.language)}</h1>
                </div>
            </div>

            <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-8">
                    {/* Stats Cards */}
                    <div class="grid grid-cols-2 gap-4 mb-12">
                        <a href="/categories" class="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition">
                            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{categoriesCount}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">{t('categories', config.language)}</div>
                        </a>
                        <a href="/tags" class="block p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-center hover:bg-teal-100 dark:hover:bg-teal-900/30 transition">
                            <div class="text-2xl font-bold text-teal-600 dark:text-teal-400">{tagsCount}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">{t('tags', config.language)}</div>
                        </a>
                    </div>

                    {/* Timeline */}
                    <div class="relative border-l-2 border-blue-400 ml-3 space-y-12 pb-8">
                        {years.map(year => (
                            <div key={year} class="relative">
                                <div class="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-400"></div>
                                <h2 class="text-2xl font-bold mb-6 pl-6 text-gray-800 dark:text-white">{year}</h2>
                                <div class="space-y-6 pl-6">
                                    {postsByYear.get(year)!.map(post => (
                                        <article key={post.slug} class="flex items-center gap-4 group hover:pl-2 transition-all duration-300">
                                            <time datetime={post.date} class="text-sm text-gray-500 dark:text-gray-400 w-24 flex-shrink-0">
                                                {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </time>
                                            <h3 class="text-lg text-gray-700 dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                                                <a href={`/posts/${safeSlug(post.abbrlink || post.slug)}`}>
                                                    {post.title}
                                                </a>
                                            </h3>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </Layout>
    );
}
