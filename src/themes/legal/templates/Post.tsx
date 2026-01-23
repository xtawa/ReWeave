/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';

interface PostProps {
    post: {
        title: string;
        content: string;
        date: string;
        toc?: string;
    };
    prevPost?: { title: string; url: string };
    nextPost?: { title: string; url: string };
}

export function Post({ post, prevPost, nextPost }: PostProps) {
    return (
        <Layout title={post.title} siteTitle="Legal Docs" updatedDate={post.date}>
            {post.toc && (
                <div class="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div dangerouslySetInnerHTML={{ __html: post.toc }} />

                    <script dangerouslySetInnerHTML={{
                        __html: `
                        (function() {
                            function initToc(nav) {
                                const tocLinks = nav.querySelectorAll('.toc-content a');
                                if (!tocLinks.length) return;

                                const headings = Array.from(tocLinks).map(link => {
                                    const id = link.getAttribute('href').substring(1);
                                    return document.getElementById(id);
                                }).filter(h => h !== null);

                                const percentEl = nav.querySelector('[id$="-percent"]');
                                const progressEl = nav.querySelector('[id$="-progress"]');
                                const toggleBtn = nav.querySelector('.toc-toggle');

                                if (toggleBtn) {
                                    toggleBtn.addEventListener('click', function() {
                                        const content = nav.querySelector('.toc-content');
                                        const icon = this.querySelector('.toc-toggle-icon');
                                        if (content) content.classList.toggle('collapsed');
                                        if (icon) icon.classList.toggle('rotated');
                                    });
                                }

                                function updateToc() {
                                    const scrollPos = window.scrollY + 100;
                                    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                                    const scrollTop = window.scrollY;
                                    let percent = 0;

                                    if (docHeight > 0) {
                                        percent = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
                                    }

                                    if (percentEl) percentEl.textContent = percent + '%';
                                    if (progressEl) progressEl.style.width = percent + '%';

                                    let currentHeading = null;
                                    for (let i = 0; i < headings.length; i++) {
                                        if (headings[i] && headings[i].offsetTop <= scrollPos) {
                                            currentHeading = headings[i];
                                        } else {
                                            break;
                                        }
                                    }

                                    tocLinks.forEach((link, index) => {
                                        if (headings[index] === currentHeading) {
                                            link.classList.add('text-teal-600', 'dark:text-teal-400', 'font-medium');
                                            link.classList.remove('text-zinc-600', 'dark:text-zinc-400');
                                        } else {
                                            link.classList.remove('text-teal-600', 'dark:text-teal-400', 'font-medium');
                                            link.classList.add('text-zinc-600', 'dark:text-zinc-400');
                                        }
                                    });
                                }

                                window.addEventListener('scroll', updateToc, { passive: true });
                                updateToc();
                            }

                            document.querySelectorAll('nav.toc').forEach(initToc);
                        })();
                        `
                    }}></script>
                </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
                {prevPost ? (
                    <a href={prevPost.url} class="text-blue-600 dark:text-blue-400 hover:underline">
                        &larr; {prevPost.title}
                    </a>
                ) : <div />}
                {nextPost ? (
                    <a href={nextPost.url} class="text-blue-600 dark:text-blue-400 hover:underline">
                        {nextPost.title} &rarr;
                    </a>
                ) : <div />}
            </div>
        </Layout>
    );
}
