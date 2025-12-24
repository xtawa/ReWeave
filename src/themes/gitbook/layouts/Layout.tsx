/** @jsx h */
import { h, ComponentChildren } from 'preact';
import { Sidebar, SidebarItem } from '../components/Sidebar';

interface LayoutProps {
    title: string;
    sidebarItems: SidebarItem[];
    children: ComponentChildren;
    siteTitle: string;
    updatedDate?: string;
    prev?: { title: string; url: string };
    next?: { title: string; url: string };
}

export function Layout({ title, sidebarItems, children, siteTitle, updatedDate, prev, next }: LayoutProps) {
    return (
        <html lang="zh-CN">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <link rel="stylesheet" href="/style.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous" />
                <style>{`
                    /* Override Tailwind Typography for code blocks to fix highlighting */
                    .prose pre {
                        background-color: #282c34 !important;
                        color: #abb2bf !important;
                        padding: 1em !important;
                        margin-top: 1.5em !important;
                        margin-bottom: 1.5em !important;
                        border-radius: 0.5rem;
                        overflow-x: auto;
                    }
                    .prose pre code {
                        background-color: transparent !important;
                        color: inherit !important;
                        padding: 0 !important;
                        font-size: 0.875em !important;
                        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
                    }
                    /* Ensure hljs classes work */
                    .hljs {
                        background: transparent !important;
                        padding: 0 !important;
                    }
                `}</style>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                        document.documentElement.classList.add('dark')
                    } else {
                        document.documentElement.classList.remove('dark')
                    }
                `}} />
            </head>
            <body class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                <Sidebar items={sidebarItems} title={siteTitle} />

                {/* Mobile Header */}
                <div class="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:bg-gray-900 dark:border-gray-800">
                    <button
                        id="sidebar-toggle"
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Toggle Sidebar"
                    >
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span class="font-semibold">{siteTitle}</span>
                </div>

                <main class="min-h-screen lg:pl-64 pt-16 lg:pt-0">
                    <div class="mx-auto max-w-4xl px-6 py-12">
                        <div class="prose prose-blue max-w-none dark:prose-invert">
                            {children}
                        </div>

                        {/* Footer Info */}
                        <div class="mt-12 border-t border-gray-200 pt-6 dark:border-gray-800">
                            {updatedDate && (
                                <div class="mb-6 text-sm text-gray-500 dark:text-gray-400">
                                    最后更新于: {new Date(updatedDate).toLocaleDateString()}
                                </div>
                            )}

                            <div class="flex justify-between">
                                {prev ? (
                                    <a href={prev.url} class="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        {prev.title}
                                    </a>
                                ) : <div />}

                                {next && (
                                    <a href={next.url} class="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                        {next.title}
                                        <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <script dangerouslySetInnerHTML={{
                    __html: `
                    const toggle = document.getElementById('sidebar-toggle');
                    const sidebar = document.getElementById('sidebar');
                    const overlay = document.createElement('div');
                    overlay.className = 'fixed inset-0 z-40 bg-black/50 lg:hidden hidden';
                    document.body.appendChild(overlay);

                    function toggleSidebar() {
                        const isClosed = sidebar.classList.contains('-translate-x-full');
                        if (isClosed) {
                            sidebar.classList.remove('-translate-x-full');
                            overlay.classList.remove('hidden');
                            document.body.style.overflow = 'hidden';
                        } else {
                            sidebar.classList.add('-translate-x-full');
                            overlay.classList.add('hidden');
                            document.body.style.overflow = '';
                        }
                    }

                    if (toggle) {
                        toggle.addEventListener('click', toggleSidebar);
                        overlay.addEventListener('click', toggleSidebar);
                    }

                    // Copy Code Button
                    document.querySelectorAll('pre').forEach(pre => {
                        pre.style.position = 'relative';
                        pre.classList.add('group');
                        
                        const button = document.createElement('button');
                        button.className = 'absolute top-2 right-2 p-2 text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-600 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100';
                        button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>';
                        button.setAttribute('aria-label', 'Copy code');
                        
                        button.addEventListener('click', () => {
                            const code = pre.querySelector('code')?.innerText || pre.innerText;
                            navigator.clipboard.writeText(code).then(() => {
                                const originalHtml = button.innerHTML;
                                button.innerHTML = '<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                                setTimeout(() => {
                                    button.innerHTML = originalHtml;
                                }, 2000);
                            });
                        });
                        
                        pre.appendChild(button);
                    });
                    `
                }} />
            </body>
        </html>
    );
}
