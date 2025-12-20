/** @jsx h */
import { h, Fragment } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Pagination } from '../components/Pagination';
import { config } from '../../../core/config';

interface Post {
    title: string;
    date: string;
    excerpt: string;
    slug: string;
    abbrlink?: string;
    tags?: string[];
    category?: string;
    cover?: string; // Assuming we might have cover images later
}

interface PostListProps {
    posts: Post[];
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    title?: string;
    subtitle?: string;
}

function safeSlug(str: string): string {
    if (/^[a-zA-Z0-9-_]+$/.test(str)) {
        return str;
    }
    return Buffer.from(str).toString('hex');
}

export function PostList({ posts, currentPage, totalPages, baseUrl, title, subtitle }: PostListProps) {
    const pageTitle = title || (currentPage === 1 ? config.title : `${config.title} - Page ${currentPage}`);

    return (
        <Layout title={pageTitle}>
            <Header />
            {currentPage === 1 && !title && <Hero />}
            {title && (
                <div class="relative h-[40vh] min-h-[300px] w-full overflow-hidden mb-10">
                    <div
                        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)` }}
                    ></div>
                    <div class="absolute inset-0 bg-black/40"></div>
                    <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                        <h1 class="text-4xl font-bold mb-4 drop-shadow-lg">{title}</h1>
                        {subtitle && <div class="text-xl opacity-90">{subtitle}</div>}
                    </div>
                </div>
            )}

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div class="lg:col-span-3 space-y-8">
                        {posts.map((post, index) => {
                            const postUrl = safeSlug(post.abbrlink || post.slug);
                            // Alternate layout for visual interest if desired, but keeping it simple card for now
                            return (
                                <article key={post.slug} class="bg-white dark:bg-zinc-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col md:flex-row h-full md:h-64 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                    {/* Cover Image Placeholder - Butterfly usually has covers */}
                                    <div class="w-full md:w-5/12 h-48 md:h-full overflow-hidden relative">
                                        <a href={`/posts/${postUrl}`} class="block w-full h-full">
                                            <img
                                                src={`https://source.unsplash.com/random/800x600?sig=${index}`}
                                                alt={post.title}
                                                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=No+Image'; }}
                                            />
                                        </a>
                                    </div>

                                    {/* Content */}
                                    <div class="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                                                <i class="far fa-calendar-alt"></i>
                                                <time datetime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                                                {post.category && (
                                                    <>
                                                        <span class="mx-1">|</span>
                                                        <i class="far fa-folder"></i>
                                                        <span>{post.category}</span>
                                                    </>
                                                )}
                                            </div>
                                            <h2 class="text-2xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-2">
                                                <a href={`/posts/${postUrl}`}>{post.title}</a>
                                            </h2>
                                            <p class="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 text-sm leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                        <div class="flex items-center justify-between mt-auto">
                                            <div class="flex gap-2">
                                                {post.tags?.map(tag => (
                                                    <a href={`/tags/${safeSlug(tag)}`} class="text-xs text-gray-500 hover:text-blue-500 transition-colors">
                                                        #{tag}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}

                        {totalPages > 1 && (
                            <Pagination current={currentPage} total={totalPages} baseUrl={baseUrl} />
                        )}
                    </div>

                    {/* Sidebar (Simplified) */}
                    <div class="hidden lg:block lg:col-span-1 space-y-8">
                        {/* Profile Card */}
                        <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 text-center sticky top-24">
                            <img
                                src={config.hero?.avatar.startsWith('http') ? config.hero.avatar : `/${config.hero?.avatar}`}
                                alt="Avatar"
                                class="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gray-200 dark:border-gray-700 hover:rotate-[360deg] transition-transform duration-700"
                            />
                            <h3 class="text-xl font-bold mb-2 dark:text-white">{config.hero?.name}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">{config.hero?.description}</p>

                            <div class="flex justify-center gap-6 mb-6 text-center">
                                <div>
                                    <div class="font-bold text-lg dark:text-white">12</div>
                                    <div class="text-xs text-gray-500">ARTICLES</div>
                                </div>
                                <div>
                                    <div class="font-bold text-lg dark:text-white">5</div>
                                    <div class="text-xs text-gray-500">TAGS</div>
                                </div>
                                <div>
                                    <div class="font-bold text-lg dark:text-white">3</div>
                                    <div class="text-xs text-gray-500">CATS</div>
                                </div>
                            </div>

                            <a href="https://github.com/xtawa/ReWeave" class="block w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                <i class="fab fa-github mr-2"></i> Follow Me
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
