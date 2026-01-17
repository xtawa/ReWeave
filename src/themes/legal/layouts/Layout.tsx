/** @jsx h */
import { h, ComponentChildren } from 'preact';

interface LayoutProps {
    title: string;
    children: ComponentChildren;
    siteTitle: string;
    updatedDate?: string;
}

export function Layout({ title, children, siteTitle = "Legal Docs", updatedDate }: LayoutProps) {
    const pageTitle = title || "首页";
    return (
        <html lang="zh-CN">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{pageTitle} - {siteTitle}</title>
                <link rel="stylesheet" href="/style.css" />
                <style>{`
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                    }
                    .legal-content {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 2rem;
                    }
                    .legal-header {
                        text-align: center;
                        margin-bottom: 3rem;
                        padding-bottom: 2rem;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .legal-footer {
                        text-align: center;
                        margin-top: 4rem;
                        padding-top: 2rem;
                        border-top: 1px solid #e5e7eb;
                        color: #6b7280;
                        font-size: 0.875rem;
                    }
                    /* Dark mode support */
                    @media (prefers-color-scheme: dark) {
                        body {
                            background-color: #111827;
                            color: #f3f4f6;
                        }
                        .legal-header, .legal-footer {
                            border-color: #374151;
                        }
                        .legal-footer {
                            color: #9ca3af;
                        }
                    }
                `}</style>
            </head>
            <body class="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                <main class="legal-content">
                    <header class="legal-header relative">
                        <a href="/" class="absolute left-0 top-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 no-underline">
                            &larr; 返回首页
                        </a>
                        <h1 class="text-3xl font-bold mb-2">{pageTitle}</h1>
                        {updatedDate && (
                            <p class="text-gray-500 dark:text-gray-400 text-sm">
                                生效日期：{new Date(updatedDate).toLocaleDateString()}
                            </p>
                        )}
                    </header>

                    <article class="prose prose-slate max-w-none dark:prose-invert">
                        {children}
                    </article>

                    <footer class="legal-footer">
                        <p>&copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.</p>
                    </footer>
                </main>
            </body>
        </html>
    );
}
