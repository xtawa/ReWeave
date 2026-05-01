/** @jsx h */
import { h, ComponentChildren, Fragment } from 'preact';
import { config } from '../../../config/theme/weave-prev.config';
import { Footer } from '../components/Footer';
import { MobileToc } from '../components/MobileToc';
import { SnowEffect } from '../../../core/components/SnowEffect';

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

    // Resolve image URL
    let imageUrl = image;
    if (!imageUrl && config.logo?.path) {
        imageUrl = config.logo.path;
    }
    if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    return (
        <html lang={config.language} class="h-full antialiased overflow-x-hidden">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content={url?.includes('/posts/') ? 'article' : 'website'} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                {imageUrl && <meta property="og:image" content={imageUrl} />}

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={fullUrl} />
                <meta property="twitter:title" content={pageTitle} />
                <meta property="twitter:description" content={pageDescription} />
                {imageUrl && <meta property="twitter:image" content={imageUrl} />}

                {/* Favicon - will be dynamically updated based on time */}
                <link id="favicon" rel="icon" type="image/png" href="/favicon.png" />
                <link id="apple-touch-icon" rel="apple-touch-icon" href="/favicon-48.png" />
                <link rel="stylesheet" href="/style.css" />
                <link rel="stylesheet" href="/fonts/fonts.css" />
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
                                    button.className = 'absolute top-2 right-2 p-2 rounded-md bg-zinc-700/50 hover:bg-zinc-600 text-zinc-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10';
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
                                        }).catch(function(err) {
                                            console.error('Failed to copy:', err);
                                        });
                                    });
                                    
                                    wrapper.appendChild(button);
                                });
                            });
                        `}} />
                    </>
                )}
                {hasMath && <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous" />}
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
                                return base.replace(/(\\.[a-z0-9]+)$/i, '-light$1');
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
                            
                            var overlay = document.getElementById('page-transition-overlay');
                            var content = document.getElementById('main-content');
                            var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                            var isTransitionEnabled = ${config.enablePageTransition ? 'true' : 'false'};
                            
                            if (overlay && content && !prefersReducedMotion && isTransitionEnabled) {
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
                {hasMermaid && <script type="module" dangerouslySetInnerHTML={{
                    __html: `
                    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
                    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
                `}} />}
            </head>
            <body class="flex h-full flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-x-hidden">
                <div id="page-transition-overlay" class="fixed inset-0 z-[9999] bg-zinc-50 dark:bg-black transition-opacity duration-300 ease-in-out pointer-events-auto" aria-hidden="true"></div>
                <div id="main-content" class="relative flex w-full flex-col min-h-screen overflow-x-hidden">
                    <div class="flex-1 flex flex-col w-full">
                        {children}
                        <Footer />
                    </div>
                </div>
                <MobileToc />
                <SnowEffect />
            </body>
        </html >
    );
}
