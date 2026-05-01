/** @jsx h */
import { h, ComponentChildren, Fragment } from 'preact';
import { config } from '../../../config/theme/terminal.config';
import { Footer } from '../components/Footer';

interface LayoutProps {
    title?: string;
    description?: string;
    image?: string;
    children: ComponentChildren;
    contentWidth?: 'normal' | 'wide' | 'full';
    hasCode?: boolean;
    hasMath?: boolean;
    hasMermaid?: boolean;
    url?: string;
}

export function Layout({ title, description, image, children, contentWidth, hasCode, hasMath, hasMermaid, url }: LayoutProps) {
    const pageTitle = title ? `${title} | ${config.title}` : config.title;
    const pageDescription = description || config.description;
    const siteUrl = config.siteUrl || '';
    const fullUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;

    let imageUrl = image;
    if (!imageUrl && config.logo?.path) {
        imageUrl = config.logo.path;
    }
    if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    return (
        <html lang={config.language} class="h-full">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />

                <meta property="og:type" content={url?.includes('/posts/') ? 'article' : 'website'} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                {imageUrl && <meta property="og:image" content={imageUrl} />}

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={fullUrl} />
                <meta property="twitter:title" content={pageTitle} />
                <meta property="twitter:description" content={pageDescription} />
                {imageUrl && <meta property="twitter:image" content={imageUrl} />}

                <link id="favicon" rel="icon" type="image/png" href="/favicon.png" />
                <link id="apple-touch-icon" rel="apple-touch-icon" href="/favicon-48.png" />
                <link rel="stylesheet" href="/style.css" />
                <link rel="stylesheet" href="/fonts/fonts.css" />

                {/* Fira Code font */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap" rel="stylesheet" />

                <style dangerouslySetInnerHTML={{
                    __html: `
                    :root {
                        --terminal-bg: #1a170f;
                        --terminal-fg: #eceae5;
                        --terminal-accent: ${config.theme.primaryColor || '#eec35e'};
                        --terminal-border: color-mix(in srgb, var(--terminal-accent) 10%, transparent);
                        --terminal-fg-dim: color-mix(in srgb, var(--terminal-fg) 65%, transparent);
                    }

                    html, body {
                        background-color: var(--terminal-bg);
                        color: var(--terminal-fg);
                        font-family: "Fira Code", "JetBrains Mono", Monaco, Consolas, "Ubuntu Mono", monospace;
                        font-variant-ligatures: contextual;
                        -webkit-font-smoothing: antialiased;
                    }

                    /* Terminal list style */
                    .terminal-content ul {
                        list-style: none;
                        padding-left: 20px;
                    }
                    .terminal-content ul li {
                        position: relative;
                    }
                    .terminal-content ul li::before {
                        content: "-";
                        position: absolute;
                        left: -20px;
                        color: var(--terminal-accent);
                    }

                    /* Terminal headings */
                    .terminal-content h1,
                    .terminal-content h2,
                    .terminal-content h3,
                    .terminal-content h4,
                    .terminal-content h5,
                    .terminal-content h6 {
                        color: var(--terminal-accent);
                        position: relative;
                    }
                    .terminal-content h1 {
                        font-size: 1.45em;
                        margin-top: 0;
                        padding-bottom: 15px;
                        border-bottom: 3px dotted var(--terminal-accent);
                    }
                    .terminal-content h1::after {
                        content: "";
                        position: absolute;
                        bottom: 2px;
                        display: block;
                        width: 100%;
                        border-bottom: 3px dotted var(--terminal-accent);
                    }
                    .terminal-content h2 { font-size: 1.35em; }
                    .terminal-content h3 { font-size: 1.15em; }

                    /* Terminal links */
                    .terminal-content a {
                        color: var(--terminal-accent);
                        text-decoration: none;
                    }
                    .terminal-content a:hover {
                        text-decoration: underline;
                    }

                    /* Terminal code blocks */
                    .terminal-content pre {
                        background: #0b0f10;
                        border: 1px solid var(--terminal-border);
                        padding: 16px;
                        overflow-x: auto;
                    }
                    .terminal-content code {
                        font-family: "Fira Code", "JetBrains Mono", Monaco, Consolas, monospace;
                    }
                    .terminal-content p code,
                    .terminal-content li code {
                        background: #0b0f10;
                        padding: 2px 6px;
                        border: 1px solid var(--terminal-border);
                        font-size: 0.9em;
                    }

                    /* Terminal selection */
                    ::selection {
                        background: var(--terminal-accent);
                        color: var(--terminal-bg);
                    }

                    /* Terminal scrollbar */
                    ::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }
                    ::-webkit-scrollbar-track {
                        background: var(--terminal-bg);
                    }
                    ::-webkit-scrollbar-thumb {
                        background: var(--terminal-border);
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: var(--terminal-accent);
                    }

                    /* Prose overrides for terminal */
                    .terminal-content .prose {
                        --tw-prose-body: var(--terminal-fg);
                        --tw-prose-headings: var(--terminal-accent);
                        --tw-prose-links: var(--terminal-accent);
                        --tw-prose-bold: var(--terminal-fg);
                        --tw-prose-counters: var(--terminal-fg-dim);
                        --tw-prose-bullets: var(--terminal-accent);
                        --tw-prose-hr: var(--terminal-border);
                        --tw-prose-quotes: var(--terminal-fg-dim);
                        --tw-prose-quote-borders: var(--terminal-accent);
                        --tw-prose-code: var(--terminal-fg);
                        --tw-prose-pre-code: var(--terminal-fg);
                        --tw-prose-pre-bg: #0b0f10;
                        --tw-prose-th-borders: var(--terminal-border);
                        --tw-prose-td-borders: var(--terminal-border);
                    }
                    .terminal-content .prose :where(code):not(:where([class~="not-prose"],[class~="not-prose"] *))::before,
                    .terminal-content .prose :where(code):not(:where([class~="not-prose"],[class~="not-prose"] *))::after {
                        content: none;
                    }
                    `
                }} />

                {hasCode && (
                    <>
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css" />
                        <script dangerouslySetInnerHTML={{
                            __html: `
                            document.addEventListener('DOMContentLoaded', function() {
                                document.querySelectorAll('pre').forEach(function(pre) {
                                    if (pre.parentNode.classList.contains('code-wrapper')) return;
                                    var wrapper = document.createElement('div');
                                    wrapper.className = 'relative group code-wrapper';
                                    pre.parentNode.insertBefore(wrapper, pre);
                                    wrapper.appendChild(pre);

                                    var button = document.createElement('button');
                                    button.className = 'absolute top-2 right-2 p-2 text-[var(--terminal-fg-dim)] hover:text-[var(--terminal-accent)] transition opacity-0 group-hover:opacity-100 focus:opacity-100 z-10';
                                    button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
                                    button.setAttribute('aria-label', 'Copy code');
                                    button.addEventListener('click', function() {
                                        var code = pre.querySelector('code');
                                        var text = code ? code.innerText : pre.innerText;
                                        navigator.clipboard.writeText(text).then(function() {
                                            button.innerHTML = '<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                                            setTimeout(function() {
                                                button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
                                            }, 2000);
                                        });
                                    });
                                    wrapper.appendChild(button);
                                });
                            });
                        `}} />
                    </>
                )}
                {hasMath && <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous" />}
                {hasMermaid && <script type="module" dangerouslySetInnerHTML={{
                    __html: `
                    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
                    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
                `}} />}
            </head>
            <body class="flex h-full flex-col overflow-x-hidden" style="background-color: var(--terminal-bg); color: var(--terminal-fg); font-family: 'Fira Code', 'JetBrains Mono', Monaco, Consolas, 'Ubuntu Mono', monospace;">
                <div class="flex flex-1 justify-center">
                    <div class="flex w-full max-w-4xl flex-col border-r" style="border-color: var(--terminal-border);">
                        <div class="flex-1 flex flex-col px-8 sm:px-12 py-10">
                            <div class="terminal-content flex-1 flex flex-col w-full min-w-0">
                                <div class="flex-1 min-w-0 w-full">
                                    {children}
                                </div>
                                <Footer />
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
