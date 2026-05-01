/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/theme/terminal.config';
import { t } from '../../../core/i18n';
import { sanitizePostSlug } from '../../../core/utils/sanitize';
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
        <Layout title={t('search', config.language)} url="/search">
            <Header />
            <main class="max-w-4xl mx-auto">
                <h1 class="text-2xl font-bold mb-8" style="color: var(--terminal-accent); border-bottom: 3px dotted var(--terminal-accent); padding-bottom: 15px;">
                    {t('search', config.language)}
                </h1>

                {/* Search Input */}
                <div class="relative mb-8">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <span style="color: var(--terminal-accent);">$</span>
                    </div>
                    <input
                        type="text"
                        id="search-input"
                        placeholder={t('searchPlaceholder', config.language)}
                        class="w-full pl-10 pr-4 py-3 text-base font-mono"
                        style="background: transparent; color: var(--terminal-fg); border: 2px solid var(--terminal-accent); outline: none;"
                        autofocus
                    />
                    <div id="search-clear" class="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer hidden">
                        <svg class="w-5 h-5" style="color: var(--terminal-fg-dim);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>

                {/* Search Results */}
                <div id="search-results" class="space-y-6">
                </div>

                {/* No Results Message */}
                <div id="no-results" class="hidden text-center py-12">
                    <p style="color: var(--terminal-fg-dim);">{t('searchNoResults', config.language)}</p>
                </div>

                {/* Initial State - Show All Posts */}
                <div id="initial-posts" class="space-y-6">
                    {posts.slice(0, 10).map(post => (
                        <article key={post.slug} class="group py-4" style="border-bottom: 1px solid var(--terminal-border);">
                            <h2 class="text-lg font-semibold" style="color: var(--terminal-accent);">
                                <a href={`/posts/${post.abbrlink || post.slug}`} class="no-underline" style="color: var(--terminal-accent);">
                                    {post.title}
                                </a>
                            </h2>
                            <time class="text-sm" style="color: var(--terminal-fg-dim);" dateTime={post.date}>
                                {new Date(post.date).toLocaleDateString()}
                            </time>
                            {post.excerpt && (
                                <p class="mt-2 text-sm line-clamp-2" style="color: var(--terminal-fg-dim);">{post.excerpt}</p>
                            )}
                            {post.tags && post.tags.length > 0 && (
                                <div class="mt-3 flex flex-wrap gap-2">
                                    {post.tags.slice(0, 3).map(tag => (
                                        <span class="text-xs px-2 py-1" style="color: var(--terminal-accent); border: 1px solid var(--terminal-border);">#{tag}</span>
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
                        const sanitizePostSlug = ${sanitizePostSlug.toString()};
                        var posts = ${postsJson};
                        var input = document.getElementById('search-input');
                        var results = document.getElementById('search-results');
                        var noResults = document.getElementById('no-results');
                        var initialPosts = document.getElementById('initial-posts');
                        var clearBtn = document.getElementById('search-clear');

                        function renderResults(filteredPosts) {
                            results.replaceChildren();

                            if (filteredPosts.length === 0) {
                                noResults.classList.remove('hidden');
                                return;
                            }

                            noResults.classList.add('hidden');
                            filteredPosts.forEach(function(post) {
                                var dateStr = new Date(post.date).toLocaleDateString();
                                var article = document.createElement('article');
                                article.className = 'group py-4';
                                article.style.borderBottom = '1px solid var(--terminal-border)';

                                var title = document.createElement('h2');
                                title.className = 'text-lg font-semibold';
                                title.style.color = 'var(--terminal-accent)';

                                var link = document.createElement('a');
                                link.href = '/posts/' + sanitizePostSlug(post.slug || '');
                                link.className = 'no-underline';
                                link.style.color = 'var(--terminal-accent)';
                                link.textContent = post.title || '';
                                title.appendChild(link);
                                article.appendChild(title);

                                var time = document.createElement('time');
                                time.className = 'text-sm';
                                time.style.color = 'var(--terminal-fg-dim)';
                                time.dateTime = post.date || '';
                                time.textContent = dateStr;
                                article.appendChild(time);

                                if (post.excerpt) {
                                    var excerpt = document.createElement('p');
                                    excerpt.className = 'mt-2 text-sm line-clamp-2';
                                    excerpt.style.color = 'var(--terminal-fg-dim)';
                                    excerpt.textContent = post.excerpt;
                                    article.appendChild(excerpt);
                                }

                                var tags = (post.tags || []).slice(0, 3);
                                if (tags.length > 0) {
                                    var tagsWrap = document.createElement('div');
                                    tagsWrap.className = 'mt-3 flex flex-wrap gap-2';
                                    tags.forEach(function(tag) {
                                        var tagNode = document.createElement('span');
                                        tagNode.className = 'text-xs px-2 py-1';
                                        tagNode.style.color = 'var(--terminal-accent)';
                                        tagNode.style.border = '1px solid var(--terminal-border)';
                                        tagNode.textContent = '#' + tag;
                                        tagsWrap.appendChild(tagNode);
                                    });
                                    article.appendChild(tagsWrap);
                                }

                                results.appendChild(article);
                            });
                        }

                        function search(query) {
                            query = query.toLowerCase().trim();

                            if (!query) {
                                results.replaceChildren();
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
                ` }} />
            </main>
        </Layout>
    );
}
