/** @jsx h */
import { h, ComponentChildren } from 'preact';
import { config } from '../../../config/weave.config';
import { Footer } from '../components/Footer';
import { MobileToc } from '../components/MobileToc';

interface LayoutProps {
    title?: string;
    description?: string;
    image?: string;
    children: ComponentChildren;
    contentWidth?: 'normal' | 'wide' | 'full';
}

export function Layout({ title, description, image, children, contentWidth }: LayoutProps) {
    const pageTitle = title ? `${title} | ${config.title}` : config.title;
    const pageDescription = description || config.description;

    const widthConfig = contentWidth || config.theme.contentWidth || 'normal';

    const outerMaxWidth = {
        'normal': 'max-w-7xl',
        'wide': 'max-w-[90rem]', // Wider than 7xl
        'full': 'max-w-full'
    }[widthConfig];

    const innerMaxWidth = {
        'normal': 'max-w-2xl lg:max-w-5xl',
        'wide': 'max-w-2xl lg:max-w-7xl',
        'full': 'max-w-full'
    }[widthConfig];

    const isFullWidth = widthConfig === 'full';
    const outerPadding = isFullWidth ? '' : 'sm:px-8';
    const containerPadding = isFullWidth ? '' : 'lg:px-8';
    const contentPadding = isFullWidth ? '' : 'px-6 sm:px-8 lg:px-12';
    const verticalMargin = isFullWidth ? '' : 'mt-8 sm:mt-16';

    return (
        <html lang={config.language} class="h-full antialiased overflow-x-hidden">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                {image && <meta property="og:image" content={image} />}
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                {/* Favicon */}
                <link rel="icon" type="image/png" href={config.logo?.path ? (config.logo.path.startsWith('http') ? config.logo.path : `/${config.logo.path}`) : '/logo.png'} />
                <link rel="apple-touch-icon" href={config.logo?.path ? (config.logo.path.startsWith('http') ? config.logo.path : `/${config.logo.path}`) : '/logo.png'} />
                <link rel="stylesheet" href="/style.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous" />
                <script dangerouslySetInnerHTML={{
                    __html: `
                    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                        document.documentElement.classList.add('dark')
                    } else {
                        document.documentElement.classList.remove('dark')
                    }
                `}} />
                <script type="module" dangerouslySetInnerHTML={{
                    __html: `
                    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
                    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
                `}} />
            </head>
            <body class="flex h-full flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-x-hidden">
                <div class={`fixed inset-0 flex justify-center ${outerPadding}`}>
                    <div class={`flex w-full ${outerMaxWidth} ${containerPadding}`}>
                        <div class="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
                    </div>
                </div>
                <div class="relative flex w-full flex-col min-h-screen overflow-x-hidden">
                    <div class={`flex-1 flex flex-col ${outerPadding} ${verticalMargin}`}>
                        <div class={`flex-1 flex flex-col mx-auto w-full ${outerMaxWidth} ${containerPadding}`}>
                            <div class={`flex-1 flex flex-col relative ${contentPadding} overflow-hidden`}>
                                <div class={`mx-auto ${innerMaxWidth} flex-1 flex flex-col w-full min-w-0`}>
                                    <div class="flex-1 min-w-0 w-full">
                                        {children}
                                    </div>
                                    <Footer />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <MobileToc />
            </body>
        </html >
    );
}
