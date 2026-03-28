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
                        line-height: 1.72;
                    }
                    a {
                        text-decoration: underline;
                        text-decoration-color: rgba(16, 185, 129, 0.35);
                        text-underline-offset: 3px;
                        transition: color .15s ease, text-decoration-color .15s ease, border-color .15s ease;
                    }
                    a:hover {
                        color: #6ee7b7;
                        text-decoration-color: rgba(110, 231, 183, 0.55);
                    }
                    pre {
                        background: rgba(2, 6, 8, 0.94) !important;
                        border: 1px solid rgba(16, 185, 129, 0.28);
                        border-radius: 0;
                        padding: 0.95rem;
                        overflow-x: auto;
                    }
                    pre code, code.hljs {
                        color: #a7f3d0;
                    }
                    ::-webkit-scrollbar {
                        width: 10px;
                        height: 10px;
                    }
                    ::-webkit-scrollbar-track {
                        background: #0a0f10;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #1e293b;
                        border: 1px solid #14532d;
                    }
                `}} />
            </head>
            <body class="min-h-full bg-[#0b0f10] text-zinc-200 font-mono">
                <div class="fixed inset-0 pointer-events-none opacity-[0.08]" aria-hidden="true">
                    <div class="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(16,185,129,0.06)_50%)] bg-[length:100%_6px]"></div>
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]"></div>
                </div>
                <div class="relative min-h-screen flex flex-col">
                    <div class="flex-1 mx-auto w-full max-w-5xl px-4 md:px-6 py-8">
                        {children}
                    </div>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
