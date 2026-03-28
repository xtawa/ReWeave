/** @jsx h */
import { h, ComponentChildren } from 'preact';
import { config } from '../../../config/theme/terminal.config';
import { Footer } from '../components/Footer';

interface LayoutProps {
    title?: string;
    description?: string;
    image?: string;
    children: ComponentChildren;
    url?: string;
}

export function Layout({ title, description, image, children, url }: LayoutProps) {
    const pageTitle = title ? `${title} | ${config.title}` : config.title;
    const pageDescription = description || config.description;
    const fullUrl = url ? `${config.siteUrl}${url}` : config.siteUrl;

    return (
        <html lang={config.language} class="h-full antialiased">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={fullUrl} />
                {image && <meta property="og:image" content={image} />}
                <link rel="icon" type="image/png" href={config.logo?.path ? `/${config.logo.path}` : '/logo.png'} />
                <link rel="stylesheet" href="/style.css" />
                <link rel="stylesheet" href="/fonts/fonts.css" />
                <style dangerouslySetInnerHTML={{
                    __html: `
                    body {
                        background-color: #0b0f10;
                        color: #e4e4e7;
                        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
                    }
                    a {
                        text-decoration: underline;
                        text-decoration-color: rgba(16, 185, 129, 0.45);
                        text-underline-offset: 3px;
                        transition: color .15s ease, border-color .15s ease;
                    }
                    a:hover {
                        color: #22d3ee;
                        text-decoration-color: rgba(34, 211, 238, 0.65);
                    }
                    pre {
                        background: rgba(3, 7, 9, 0.95) !important;
                        border: 1px solid rgba(16, 185, 129, 0.35);
                        border-radius: 0;
                        padding: 1rem;
                        overflow-x: auto;
                    }
                    code {
                        font-family: inherit;
                    }
                    pre code, code.hljs {
                        color: #86efac;
                    }
                    ::-webkit-scrollbar {
                        width: 10px;
                        height: 10px;
                    }
                    ::-webkit-scrollbar-track {
                        background: #090d0e;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #1f2937;
                        border: 1px solid #14532d;
                    }
                    ::selection {
                        color: #ecfeff;
                        background: rgba(16, 185, 129, 0.35);
                    }
                `}} />
            </head>
            <body class="min-h-full bg-[#0b0f10] text-zinc-200 font-mono">
                <div class="fixed inset-0 pointer-events-none opacity-20" aria-hidden="true">
                    <div class="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(16,185,129,0.08)_50%)] bg-[length:100%_4px]"></div>
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]"></div>
                </div>
                <div class="relative min-h-screen flex flex-col">
                    <div class="flex-1 mx-auto w-full max-w-6xl px-4 md:px-6 py-8">
                        {children}
                    </div>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
