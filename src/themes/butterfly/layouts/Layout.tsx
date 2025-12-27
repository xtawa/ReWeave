/** @jsx h */
import { h, ComponentChildren } from 'preact';
import { config } from '../../../config/theme/butterfly.config';
import { Footer } from '../components/Footer';
import { SnowEffect } from '../../../core/components/SnowEffect';

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
                {/* Favicon */}
                <link rel="icon" type="image/png" href={config.logo?.path ? (config.logo.path.startsWith('http') ? config.logo.path : `/${config.logo.path}`) : '/logo.png'} />
                <link rel="apple-touch-icon" href={config.logo?.path ? (config.logo.path.startsWith('http') ? config.logo.path : `/${config.logo.path}`) : '/logo.png'} />
                <link rel="stylesheet" href="/style.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;500;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
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
                <style dangerouslySetInnerHTML={{
                    __html: `
                    body {
                        font-family: 'Outfit', sans-serif;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        font-family: 'Outfit', sans-serif;
                    }
                    .serif {
                        font-family: 'Noto Serif SC', serif;
                    }
                    `
                }} />
            </head>
            <body class="flex min-h-full flex-col bg-gray-100 dark:bg-[#121212] text-gray-700 dark:text-gray-200 transition-colors duration-300">
                <div class="flex-1">
                    {children}
                </div>
                <Footer />
                <SnowEffect />
            </body>
        </html>
    );
}
