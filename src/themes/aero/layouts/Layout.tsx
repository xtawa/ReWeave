/** @jsx h */
import { h, ComponentChildren } from 'preact';

interface LayoutProps {
    title?: string;
    children: ComponentChildren;
    siteTitle?: string;
    description?: string;
    updatedDate?: string;
    url?: string;
}

export function Layout({ title, children, siteTitle = "ReWeave", description }: LayoutProps) {
    const pageTitle = title ? `${title} - ${siteTitle}` : siteTitle;

    return (
        <html lang="zh-CN">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{pageTitle}</title>
                <meta name="description" content={description || siteTitle} />
                <link rel="stylesheet" href="/style.css" />
                <style>{`
                    :root {
                        --black - main: #000000;
                    --white-main: #ffffff;
                    --primary-color: #3c7fb1;
                    --highlight-color: #aaddfa;
                    --secondary-color: #d8e1e7;

                    --aero-grad: linear-gradient(to bottom,
                    rgba(255, 255, 255, 0.9) 0%,
                    rgba(230, 240, 250, 0.8) 50%,
                    rgba(200, 220, 240, 0.8) 51%,
                    rgba(230, 240, 250, 0.9) 100%);
                    }

                    body {
                        font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
                        color: #1a1a1a;
                        margin: 0;
                        /* Classic Frutiger Aero Wallpaper */
                        background: url('/images/aero-bg.jpg') no-repeat center center fixed;
                        background-size: cover;
                        background-attachment: fixed;
                        min-height: 100vh;
                    }

                    .glass-card, .card {
                         /* Vista/Aero Glass Effect - More transparent */
                        background: linear-gradient(
                            to bottom,
                            rgba(255, 255, 255, 0.55) 0%,
                            rgba(255, 255, 255, 0.35) 50%,
                            rgba(255, 255, 255, 0.45) 100%
                        );
                        box-sizing: border-box;
                        box-shadow:
                            inset 0 1px 0 rgba(255, 255, 255, 0.8),
                            inset 0 -1px 0 rgba(255, 255, 255, 0.3),
                            0 0 0 1px rgba(0, 0, 0, 0.1),
                            0 8px 32px rgba(0, 0, 0, 0.12);
                        backdrop-filter: blur(16px) saturate(180%);
                        -webkit-backdrop-filter: blur(16px) saturate(180%);
                        border-radius: 8px;
                        margin-bottom: 20px;
                        overflow: hidden;
                        border: 1px solid rgba(255, 255, 255, 0.6);
                    }

                    /* Button & Aero Element Styles */
                    .aero-btn, .button, .page-number, .extend {
                        display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    background: var(--aero-grad);
                    box-shadow:
                    inset 0 0 0 1px rgba(255,255,255,0.8),
                    0 1px 3px rgba(0, 0, 0, 0.2);
                    box-sizing: border-box;
                    text-decoration: none;
                    color: #1a3b5c;
                    font-family: inherit;
                    border-radius: 20px;
                    font-weight: 500;
                    }

                    /* Hover shine effect */
                    .aero-btn::after, .button::after, .page-number::after, .extend::after {
                        content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to top,
                    rgba(255,255,255,0.1) 0%,
                    rgba(255,255,255,0.4) 50%,
                    rgba(255,255,255,0) 51%,
                    rgba(255,255,255,0.6) 100%);
                    border-radius: inherit;
                    z-index: 1;
                    pointer-events: none;
                    opacity: 0.8;
                    }

                    .aero-btn:hover {
                        filter: brightness(1.05);
                    box-shadow: 0 0 10px rgba(160, 220, 255, 0.6);
                    }

                    /* Content inside button needs to be on top of shine */
                    .aero-btn span, .aero-btn a {
                        position: relative;
                    z-index: 2;
                    }

                    /* Typography overrides */
                    h1, h2, h3 {color: #003366; text-shadow: 0 1px 0 rgba(255,255,255,0.8); }
                    a {color: #0055aa; text-decoration: none; transition: color 0.2s; }
                    a:hover {color: #0077cc; text-decoration: underline; }

                    /* Scrollbar */
                    ::-webkit-scrollbar {width: 10px; }
                    ::-webkit-scrollbar-track {background: rgba(0,0,0,0.05); }
                    ::-webkit-scrollbar-thumb {
                        background: rgba(255,255,255,0.6);
                    border-radius: 5px;
                    border: 1px solid rgba(0,0,0,0.1);
                    }

                    /* Header specific styles - Fully Transparent */
                    header {
                        width: 100%;
                    height: 80px;
                    position: relative;
                    margin-bottom: 20px;
                    z-index: 50;
                    }

                    .nav-container {
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 40px;
                    }

                    .nav-links {
                        display: flex;
                        gap: 10px;
                        list-style: none;
                        padding: 8px 20px;
                        margin: 0;
                        border-radius: 25px;
                        background: linear-gradient(
                            to bottom,
                            rgba(255, 255, 255, 0.5) 0%,
                            rgba(255, 255, 255, 0.3) 100%
                        );
                        backdrop-filter: blur(16px) saturate(180%);
                        border: 1px solid rgba(255, 255, 255, 0.6);
                        box-shadow: 
                            inset 0 1px 0 rgba(255, 255, 255, 0.8),
                            0 4px 20px rgba(0,0,0,0.1);
                    }

                    .nav-link {
                        display: flex;
                        align-items: center;
                        height: 32px;
                        padding: 0 15px;
                        text-decoration: none;
                        color: #1a1a1a;
                        font-size: 14px;
                        font-weight: 600;
                        border-radius: 16px;
                        transition: all 0.2s;
                        text-shadow: 0 1px 0 rgba(255,255,255,0.9);
                    }

                    .nav-link:hover {
                        background: rgba(100, 180, 255, 0.3);
                        box-shadow: 0 0 10px rgba(100, 180, 255, 0.5);
                        color: #003366;
                    }

                    .glass-header {
                        padding: 12px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.3);
                    background: linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
                    }
                    .glass-content {padding: 20px; }

                    /* Sidebar Widgets */
                    /* Avatar Widget Styles */
                    .avatar-bg {
                        background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(5px);
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    box-shadow:
                    0 0 0 1px rgba(255,255,255,0.4),
                    inset 0 0 10px rgba(255,255,255,0.5),
                    0 5px 15px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                    position: relative;
                    }

                    .profile-img {
                        width: 110px;
                        height: 110px;
                        border-radius: 50%;
                        border: 2px solid rgba(255,255,255,0.8);
                        object-fit: cover;
                    }

                    /* Glass Panel for Footer and other sections */
                    .glass-panel {
                        background: linear-gradient(
                            to bottom,
                            rgba(255, 255, 255, 0.4) 0%,
                            rgba(255, 255, 255, 0.2) 100%
                        );
                        backdrop-filter: blur(12px) saturate(150%);
                        border-radius: 20px;
                        border: 1px solid rgba(255, 255, 255, 0.5);
                        box-shadow: 
                            inset 0 1px 0 rgba(255, 255, 255, 0.6),
                            0 4px 20px rgba(0, 0, 0, 0.08);
                    }

                    /* Prose Content Styles */
                    .prose {
                        color: #2a2a2a;
                        line-height: 1.8;
                    }
                    .prose h1, .prose h2, .prose h3 {
                        color: #1a3b5c;
                        text-shadow: 0 1px 0 rgba(255,255,255,0.8);
                    }
                    .prose a {
                        color: #2563eb;
                        text-decoration: underline;
                    }
                    .prose a:hover {
                        color: #1d4ed8;
                    }
                    .prose code {
                        background: rgba(100, 150, 200, 0.15);
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 0.9em;
                    }
                    .prose pre {
                        background: linear-gradient(
                            to bottom,
                            rgba(30, 60, 90, 0.9) 0%,
                            rgba(20, 40, 60, 0.95) 100%
                        );
                        border-radius: 8px;
                        padding: 16px;
                        overflow-x: auto;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
                    }
                    .prose pre code {
                        background: transparent;
                        color: #e0f0ff;
                        padding: 0;
                    }
                    .prose blockquote {
                        border-left: 4px solid rgba(100, 150, 220, 0.6);
                        background: rgba(100, 150, 220, 0.1);
                        padding: 12px 20px;
                        margin: 16px 0;
                        border-radius: 0 8px 8px 0;
                    }
                    .prose img {
                        border-radius: 8px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    }

                    /* Input Styles */
                    input, textarea, select {
                        background: linear-gradient(
                            to bottom,
                            rgba(255, 255, 255, 0.7) 0%,
                            rgba(255, 255, 255, 0.5) 100%
                        );
                        border: 1px solid rgba(200, 220, 240, 0.8);
                        border-radius: 6px;
                        padding: 8px 12px;
                        font-family: inherit;
                        color: #1a1a1a;
                        box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
                        transition: all 0.2s;
                    }
                    input:focus, textarea:focus, select:focus {
                        outline: none;
                        border-color: rgba(100, 150, 220, 0.8);
                        box-shadow: 0 0 8px rgba(100, 150, 220, 0.4);
                    }

                    /* Tag Styles */
                    .tag {
                        display: inline-block;
                        background: linear-gradient(
                            to bottom,
                            rgba(100, 180, 255, 0.4) 0%,
                            rgba(80, 150, 220, 0.3) 100%
                        );
                        color: #1a3b5c;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        border: 1px solid rgba(255, 255, 255, 0.5);
                        margin: 2px;
                        text-decoration: none;
                        transition: all 0.2s;
                    }
                    .tag:hover {
                        background: linear-gradient(
                            to bottom,
                            rgba(100, 180, 255, 0.6) 0%,
                            rgba(80, 150, 220, 0.5) 100%
                        );
                        box-shadow: 0 0 8px rgba(100, 180, 255, 0.4);
                    }

                    /* Table Styles */
                    table {
                        width: 100%;
                        border-collapse: separate;
                        border-spacing: 0;
                        background: rgba(255, 255, 255, 0.4);
                        border-radius: 8px;
                        overflow: hidden;
                        border: 1px solid rgba(255, 255, 255, 0.5);
                    }
                    th {
                        background: linear-gradient(
                            to bottom,
                            rgba(100, 150, 200, 0.3) 0%,
                            rgba(80, 130, 180, 0.2) 100%
                        );
                        color: #1a3b5c;
                        font-weight: 600;
                        padding: 12px;
                        text-align: left;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
                    }
                    td {
                        padding: 10px 12px;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                    }
                    tr:last-child td {
                        border-bottom: none;
                    }
                    tr:hover td {
                        background: rgba(100, 180, 255, 0.1);
                    }

                    /* Archive/Category List Styles */
                    .archive-list, .category-list, .tag-list {
                        list-style: none;
                        padding: 0;
                    }
                    .archive-item, .category-item {
                        padding: 12px 16px;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                        transition: all 0.2s;
                    }
                    .archive-item:hover, .category-item:hover {
                        background: rgba(100, 180, 255, 0.15);
                    }
                    .archive-item:last-child, .category-item:last-child {
                        border-bottom: none;
                    }
                `}</style>
            </head>
            <body>
                <div class="fixed inset-0 -z-10 bg-[url('https://w.wallhaven.cc/full/4x/wallhaven-4x33p3.jpg')] bg-cover bg-center opacity-80" />
                {/* Fallback pattern overlay if needed, using tailwind classes on top of our styles */}
                <div class="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
                    {/* Main Content Area */}
                    <div class="flex-1 w-full min-w-0">
                        {children}
                    </div>
                </div>

                {/* Footer in Aero style */}
                <footer class="mt-8 text-center text-slate-600 text-sm p-4 glass-panel mx-auto max-w-md mb-8">
                    <p>&copy; {new Date().getFullYear()} {siteTitle}. Live happily.</p>
                </footer>
            </body>
        </html >
    );
}
