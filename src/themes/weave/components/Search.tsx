/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/weave.config';
import { t } from '../../../core/i18n';
import { Layout } from '../layouts/Layout';
import { Header } from './Header';

interface SearchProps {
    posts: Array<{
        title: string;
        slug: string;
        abbrlink?: string;
        date: string;
        excerpt?: string;
        category?: string;
        tags?: string[];
    }>;
}

export function Search({ posts }: SearchProps) {
    const postsJson = JSON.stringify(posts.map(p => ({
        title: p.title,
        slug: p.abbrlink || p.slug,
        date: p.date,
        excerpt: p.excerpt || '',
        category: p.category || '',
        tags: p.tags || []
    })));

    return (
        <Layout title={t('search', config.language)}>
            <Header />
            <main class="max-w-4xl mx-auto animate-fade-in-up">
                <h1 class="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">{t('search', config.language)}</h1>

                {/* Search Input */}
                <div class="relative mb-8">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="search-input"
                        placeholder={t('searchPlaceholder', config.language)}
                        class="w-full pl-12 pr-4 py-4 text-lg rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition shadow-sm"
                        autofocus
                    />
                    <div id="search-clear" class="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer hidden">
                        <svg class="w-5 h-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>

                {/* Search Results */}
                <div id="search-results" class="space-y-6">
                    {/* Results will be rendered by JavaScript */}
                </div>

                {/* No Results Message */}
                <div id="no-results" class="hidden text-center py-12">
                    <svg class="mx-auto w-16 h-16 text-zinc-300 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-zinc-500 dark:text-zinc-400 text-lg">{t('searchNoResults', config.language)}</p>
                </div>

                {/* Initial State - Show All Posts */}
                <div id="initial-posts" class="space-y-6">
                    {posts.slice(0, 10).map(post => (
                        <article key={post.slug} class="group relative flex flex-col items-start p-4 -mx-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                            <h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                <a href={`/posts/${post.abbrlink || post.slug}`}>
                                    <span class="absolute inset-0 z-0" />
                                    {post.title}
                                </a>
                            </h2>
                            <time class="relative z-10 order-first mb-2 flex items-center text-sm text-zinc-400" dateTime={post.date}>
                                <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 mr-3" />
                                {new Date(post.date).toLocaleDateString()}
                            </time>
                            {post.excerpt && (
                                <p class="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">{post.excerpt}</p>
                            )}
                            {post.tags && post.tags.length > 0 && (
                                <div class="relative z-10 mt-3 flex flex-wrap gap-2">
                                    {post.tags.slice(0, 3).map(tag => (
                                        <span class="text-xs px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 rounded-full">#{tag}</span>
                                    ))}
                                </div>
                            )}
                        </article>
                    ))}
                </div>

                {/* Client-side Search Script */}
                <script dangerouslySetInnerHTML={{
                    __html: `
                    (function() {
                        var posts = ${postsJson};
                        var input = document.getElementById('search-input');
                        var results = document.getElementById('search-results');
                        var noResults = document.getElementById('no-results');
                        var initialPosts = document.getElementById('initial-posts');
                        var clearBtn = document.getElementById('search-clear');

                        function renderResults(filteredPosts) {
                            if (filteredPosts.length === 0) {
                                results.innerHTML = '';
                                noResults.classList.remove('hidden');
                                return;
                            }

                            noResults.classList.add('hidden');
                            results.innerHTML = filteredPosts.map(function(post) {
                                var dateStr = new Date(post.date).toLocaleDateString();
                                var tagsHtml = (post.tags || []).slice(0, 3).map(function(tag) {
                                    return '<span class="text-xs px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 rounded-full">#' + tag + '</span>';
                                }).join('');

                                return '<article class="group relative flex flex-col items-start p-4 -mx-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition animate-fade-in">' +
                                    '<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">' +
                                        '<a href="/posts/' + post.slug + '">' +
                                            '<span class="absolute inset-0 z-0"></span>' +
                                            post.title +
                                        '</a>' +
                                    '</h2>' +
                                    '<time class="relative z-10 order-first mb-2 flex items-center text-sm text-zinc-400" datetime="' + post.date + '">' +
                                        '<span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 mr-3"></span>' +
                                        dateStr +
                                    '</time>' +
                                    (post.excerpt ? '<p class="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">' + post.excerpt + '</p>' : '') +
                                    (tagsHtml ? '<div class="relative z-10 mt-3 flex flex-wrap gap-2">' + tagsHtml + '</div>' : '') +
                                '</article>';
                            }).join('');
                        }

                        function search(query) {
                            query = query.toLowerCase().trim();
                            
                            if (!query) {
                                results.innerHTML = '';
                                noResults.classList.add('hidden');
                                initialPosts.classList.remove('hidden');
                                clearBtn.classList.add('hidden');
                                return;
                            }

                            clearBtn.classList.remove('hidden');
                            initialPosts.classList.add('hidden');

                            var filtered = posts.filter(function(post) {
                                var titleMatch = post.title.toLowerCase().indexOf(query) !== -1;
                                var excerptMatch = post.excerpt && post.excerpt.toLowerCase().indexOf(query) !== -1;
                                var tagsMatch = post.tags && post.tags.some(function(tag) { return tag.toLowerCase().indexOf(query) !== -1; });
                                var categoryMatch = post.category && post.category.toLowerCase().indexOf(query) !== -1;
                                return titleMatch || excerptMatch || tagsMatch || categoryMatch;
                            });

                            renderResults(filtered);
                        }

                        var timeout;
                        input.addEventListener('input', function() {
                            clearTimeout(timeout);
                            timeout = setTimeout(function() {
                                search(input.value);
                            }, 200);
                        });

                        clearBtn.addEventListener('click', function() {
                            input.value = '';
                            search('');
                            input.focus();
                        });

                        var urlParams = new URLSearchParams(window.location.search);
                        var q = urlParams.get('q');
                        if (q) {
                            input.value = q;
                            search(q);
                        }
                    })();
                `}} />
            </main>
        </Layout>
    );
}
