/** @jsx h */
import { h, ComponentChildren } from 'preact';
import { config } from '../../../core/config';
import { Footer } from '../components/Footer';

interface LayoutProps {
    title?: string;
    description?: string;
    image?: string;
    children: ComponentChildren;
}

export function Layout({ title, description, image, children }: LayoutProps) {
    const pageTitle = title ? `${title} | ${config.title}` : config.title;
    const pageDescription = description || config.description;

    return (
        <html lang={config.language} class="h-full antialiased">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                {image && <meta property="og:image" content={image} />}
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <link rel="stylesheet" href="/style.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css" />
                <script type="module" dangerouslySetInnerHTML={{
                    __html: `
                    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
                    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
                `}} />
            </head>
            <body class="flex h-full flex-col bg-zinc-50 dark:bg-black">
                <div class="fixed inset-0 flex justify-center sm:px-8">
                    <div class="flex w-full max-w-7xl lg:px-8">
                        <div class="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
                    </div>
                </div>
                <div class="relative flex w-full flex-col">
                    <div class="sm:px-8 mt-8 sm:mt-16">
                        <div class="mx-auto w-full max-w-7xl lg:px-8">
                            <div class="relative px-4 sm:px-8 lg:px-12">
                                <div class="mx-auto max-w-2xl lg:max-w-5xl">
                                    {children}
                                    <Footer />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
