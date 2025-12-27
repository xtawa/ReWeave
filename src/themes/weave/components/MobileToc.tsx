/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/theme/weave.config';
import { t } from '../../../core/i18n';

export function MobileToc() {
    // Only render if TOC is enabled globally
    if (!config.toc?.enabled) return null;

    return (
        <div id="mobile-toc-wrapper" class="pointer-events-none fixed inset-0 z-[100]">
            {/* Floating Button Container - positioned absolute to wrapper */}
            <div class="absolute bottom-6 right-6 pointer-events-auto">
                <button
                    id="mobile-toc-btn"
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg shadow-teal-600/20 ring-1 ring-white/20 transition active:scale-95 dark:bg-teal-500 opacity-0 scale-90"
                    aria-label="Table of Contents"
                    style="transition: opacity 0.3s, transform 0.3s;"
                >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            {/* Backdrop & Content */}
            <div id="mobile-toc-overlay" class="pointer-events-auto fixed inset-0 z-[101] hidden">
                {/* Backdrop */}
                <div id="mobile-toc-backdrop" class="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/40 transition-opacity opacity-0"></div>

                {/* TOC Panel */}
                <div class="toc-panel absolute bottom-24 right-6 w-64 max-h-[60vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-white/10 transition-all duration-300 transform translate-y-4 opacity-0">
                    <div class="mb-3 flex flex-col">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t('toc', config.language)}</h3>
                            <span class="text-xs text-zinc-500 font-mono" id="mobile-toc-percent">0%</span>
                        </div>
                        <div class="w-full bg-zinc-200 dark:bg-zinc-700 h-1 mt-2 rounded-full overflow-hidden">
                            <div id="mobile-toc-progress" class="bg-teal-500 h-full transition-all duration-150" style="width: 0%"></div>
                        </div>
                    </div>
                    <ul id="mobile-toc-list" class="space-y-2 text-sm">
                        {/* Links will be injected here by JS */}
                    </ul>
                </div>
            </div>

            <script dangerouslySetInnerHTML={{
                __html: `
                (function() {
                    const btn = document.getElementById('mobile-toc-btn');
                    const overlay = document.getElementById('mobile-toc-overlay');
                    const backdrop = document.getElementById('mobile-toc-backdrop');
                    const content = overlay.querySelector('.toc-panel');
                    const list = document.getElementById('mobile-toc-list');
                    const percentEl = document.getElementById('mobile-toc-percent');
                    const progressEl = document.getElementById('mobile-toc-progress');
                    
                    // 1. Scan for headings
                    const headings = Array.from(document.querySelectorAll('.prose h1, .prose h2, .prose h3'));
                    
                    // If no headings, hide button and return
                    if (headings.length === 0) {
                        if (btn) btn.style.display = 'none';
                        return;
                    }

                    // Show button with animation
                    if (btn) {
                        requestAnimationFrame(() => {
                            btn.classList.remove('opacity-0', 'scale-90');
                        });
                    }

                    // 2. Build TOC list
                    const minLevel = Math.min(...headings.map(h => parseInt(h.tagName[1])));
                    
                    headings.forEach(h => {
                        if (!h.id) {
                            h.id = 'heading-' + Math.random().toString(36).substr(2, 9);
                        }
                        
                        const li = document.createElement('li');
                        const level = parseInt(h.tagName[1]);
                        li.style.paddingLeft = (level - minLevel) * 12 + 'px';
                        
                        const a = document.createElement('a');
                        a.href = '#' + h.id;
                        a.className = 'block text-zinc-600 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400 transition line-clamp-1';
                        a.textContent = h.innerText;
                        
                        a.addEventListener('click', closeToc);
                        
                        li.appendChild(a);
                        list.appendChild(li);
                    });

                    // 3. Interaction Logic
                    function openToc() {
                        overlay.classList.remove('hidden');
                        requestAnimationFrame(() => {
                            content.classList.remove('translate-y-4', 'opacity-0');
                            content.classList.add('translate-y-0', 'opacity-100');
                            backdrop.classList.remove('opacity-0');
                            backdrop.classList.add('opacity-100');
                        });
                    }

                    function closeToc() {
                        content.classList.remove('translate-y-0', 'opacity-100');
                        content.classList.add('translate-y-4', 'opacity-0');
                        backdrop.classList.remove('opacity-100');
                        backdrop.classList.add('opacity-0');
                        
                        setTimeout(() => {
                            overlay.classList.add('hidden');
                        }, 300);
                    }

                    if (btn) {
                        btn.addEventListener('click', function() {
                            if (overlay.classList.contains('hidden')) {
                                openToc();
                            } else {
                                closeToc();
                            }
                        });
                    }

                    if (backdrop) {
                        backdrop.addEventListener('click', closeToc);
                    }

                    // 4. Scroll Tracking & Progress
                    function updateProgress() {
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
                        const docHeight = scrollHeight - clientHeight;
                        
                        let percent = 0;
                        if (docHeight > 0) {
                            percent = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
                        }
                        
                        if (percentEl) percentEl.textContent = percent + '%';
                        if (progressEl) progressEl.style.width = percent + '%';

                        // Highlight active link
                        const scrollPos = scrollTop + 100;
                        let currentHeading = null;

                        for (let i = 0; i < headings.length; i++) {
                            if (headings[i] && headings[i].offsetTop <= scrollPos) {
                                currentHeading = headings[i];
                            } else {
                                break;
                            }
                        }

                        const tocLinks = list.querySelectorAll('a');
                        tocLinks.forEach((link, index) => {
                            if (headings[index] === currentHeading) {
                                link.classList.add('text-teal-600', 'dark:text-teal-400', 'font-medium');
                                link.classList.remove('text-zinc-600', 'dark:text-zinc-400');
                            } else {
                                link.classList.remove('text-teal-600', 'dark:text-teal-400', 'font-medium');
                                link.classList.add('text-zinc-600', 'dark:text-zinc-400');
                            }
                        });
                    }

                    window.addEventListener('scroll', updateProgress);
                    updateProgress();
                })();
            ` }} />
        </div>
    );
}
