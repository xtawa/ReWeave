/** @jsx h */
import { h, ComponentChildren } from 'preact';
import { config } from '../../../config/theme/weave.config';
import { Footer } from '../components/Footer';
import { MobileToc } from '../components/MobileToc';
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
                {/* Favicon - will be dynamically updated based on time */}
                <link id="favicon" rel="icon" type="image/png" href="/favicon.png" />
                <link id="apple-touch-icon" rel="apple-touch-icon" href="/favicon-48.png" />
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
                    
                    // Dark mode based favicon and avatar switching & Page Transition
                    (function() {
                        function hideOverlay() {
                            var overlay = document.getElementById('page-transition-overlay');
                            var content = document.getElementById('main-content');
                            if (overlay) {
                                overlay.classList.add('opacity-0', 'pointer-events-none');
                                overlay.classList.remove('pointer-events-auto');
                            }
                            if (content) {
                                content.classList.remove('opacity-0', 'scale-[0.98]');
                            }
                        }

                        function updateImages() {
                            var isDark = document.documentElement.classList.contains('dark');
                            
                            function switchSrc(src) {
                                if (!src) return src;
                                var base = src.replace('-light.', '.');
                                if (isDark) return base;
                                return base.replace(/(\.[a-z0-9]+)$/i, '-light$1');
                            }

                            // Update favicon
                            var favicon = document.getElementById('favicon');
                            if (favicon) {
                                var href = favicon.getAttribute('href');
                                var newHref = switchSrc(href);
                                if (href !== newHref) favicon.setAttribute('href', newHref);
                            }
                            
                            var appleTouchIcon = document.getElementById('apple-touch-icon');
                            if (appleTouchIcon) {
                                var href = appleTouchIcon.getAttribute('href');
                                var newHref = switchSrc(href);
                                if (href !== newHref) appleTouchIcon.setAttribute('href', newHref);
                            }

                            // Update avatars and project icons
                            document.querySelectorAll('img[data-avatar], img[data-project-icon]').forEach(function(img) {
                                var src = img.getAttribute('src');
                                var newSrc = switchSrc(src);
                                if (src !== newSrc) img.setAttribute('src', newSrc);
                            });

                            // Update background images
                            document.querySelectorAll('[data-bg-image]').forEach(function(el) {
                                var bgImage = el.getAttribute('data-bg-image');
                                if (bgImage) {
                                    var newPath = switchSrc(bgImage);
                                    el.style.backgroundImage = 'url(' + newPath + ')';
                                }
                            });

                            // Hide overlay after images are updated
                            setTimeout(hideOverlay, 10);
                        }

                        if (document.readyState === 'loading') {
                            document.addEventListener('DOMContentLoaded', updateImages);
                        } else {
                            updateImages();
                        }

                        var observer = new MutationObserver(function(mutations) {
                            mutations.forEach(function(mutation) {
                                if (mutation.attributeName === 'class') {
                                    updateImages();
                                }
                            });
                        });
                        observer.observe(document.documentElement, { attributes: true });

                        // Page Transition: Intercept links
                        document.addEventListener('click', function(e) {
                            var link = e.target.closest('a');
                            if (!link) return;
                            
                            var href = link.getAttribute('href');
                            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
                            if (link.hostname && link.hostname !== window.location.hostname) return;
                            
                            // Don't intercept if modifier keys are pressed
                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

                            e.preventDefault();
                            e.preventDefault();
                            var overlay = document.getElementById('page-transition-overlay');
                            var content = document.getElementById('main-content');
                            
                            if (overlay && content) {
                                overlay.classList.remove('opacity-0', 'pointer-events-none');
                                overlay.classList.add('pointer-events-auto');
                                content.classList.add('scale-[0.98]');
                                
                                setTimeout(function() {
                                    window.location.href = href;
                                }, 200);
                            } else {
                                window.location.href = href;
                            }
                        });

                        // Handle bfcache
                        window.addEventListener('pageshow', function(event) {
                            if (event.persisted) {
                                hideOverlay();
                            }
                        });
                    })();
                `}} />
                <noscript>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        #page-transition-overlay { display: none; }
                        #main-content { opacity: 1 !important; transform: none !important; }
                    `}} />
                </noscript>
                <script type="module" dangerouslySetInnerHTML={{
                    __html: `
                    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
                    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
                `}} />
            </head>
            <body class="flex h-full flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-x-hidden">
                <div id="page-transition-overlay" class="fixed inset-0 z-[9999] bg-zinc-50 dark:bg-black transition-opacity duration-300 ease-in-out pointer-events-auto" aria-hidden="true"></div>
                <div class={`fixed inset-0 flex justify-center ${outerPadding}`}>
                    <div class={`flex w-full ${outerMaxWidth} ${containerPadding}`}>
                        <div class="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
                    </div>
                </div>
                <div id="main-content" class="relative flex w-full flex-col min-h-screen overflow-x-hidden transition-all duration-500 ease-out opacity-0 scale-[0.98] origin-top">
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
                <SnowEffect />
            </body>
        </html >
    );
}
