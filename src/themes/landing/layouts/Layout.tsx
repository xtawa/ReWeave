/** @jsx h */
import { h, ComponentChildren } from 'preact';
import { config } from '../../../config/landing.config';

interface LayoutProps {
    title?: string;
    description?: string;
    image?: string;
    children: ComponentChildren;
    contentWidth?: string;
}

export function Layout({ title, description, image, children }: LayoutProps) {
    const pageTitle = title ? `${title} | ${config.title}` : config.title;
    const pageDescription = description || config.description;

    return (
        <html lang={config.language} class="min-h-full antialiased">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                {image && <meta property="og:image" content={image} />}
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <link rel="icon" type="image/png" href="/logo.png" />
                <link rel="stylesheet" href="/style.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous" />
                <script dangerouslySetInnerHTML={{
                    __html: `
                    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                        document.documentElement.classList.add('dark')
                    } else {
                        document.documentElement.classList.remove('dark')
                    }
                `}} />
            </head>
            <body class="flex min-h-full flex-col bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                {children}
                <footer class="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-12 mt-auto">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-zinc-500 dark:text-zinc-400">
                        {config.footer?.copyright}
                    </div>
                </footer>
            </body>
        </html>
    );
}
