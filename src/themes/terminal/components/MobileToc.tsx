/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/theme/terminal.config';
import { t } from '../../../core/i18n';

export function MobileToc() {
    if (!config.toc?.enabled) return null;

    return (
        <div id="mobile-toc-wrapper" class="pointer-events-none fixed inset-0 z-[100]">
            <div class="absolute bottom-10 right-8 pointer-events-auto">
                <button
                    id="mobile-toc-btn"
                    class="flex h-12 w-12 items-center justify-center transition opacity-0 scale-90"
                    style="background: var(--terminal-accent); color: var(--terminal-bg);"
                    aria-label="Table of Contents"
                >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            <div id="mobile-toc-overlay" class="pointer-events-auto fixed inset-0 z-[101] hidden">
                <div id="mobile-toc-backdrop" class="absolute inset-0 transition-opacity opacity-0" style="background: rgba(0,0,0,0.4);"></div>

                <div
                    class="toc-panel absolute bottom-24 right-8 w-64 max-h-[60vh] overflow-y-auto p-4 transition-all duration-300 transform translate-y-4 opacity-0"
                    style="background: var(--terminal-bg); border: 1px solid var(--terminal-accent);"
                >
                    <div class="mb-3 flex flex-col">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-semibold" style="color: var(--terminal-accent);">{t('toc', config.language)}</h3>
                            <span class="text-xs font-mono" style="color: var(--terminal-fg-dim);" id="mobile-toc-percent">0%</span>
                        </div>
                        <div class="w-full h-1 mt-2" style="background: var(--terminal-border);">
                            <div id="mobile-toc-progress" class="h-full transition-all duration-150" style="background: var(--terminal-accent); width: 0%"></div>
                        </div>
                    </div>
                    <ul id="mobile-toc-list" class="space-y-2 text-sm">
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

                    const headings = Array.from(document.querySelectorAll('.terminal-content h1, .terminal-content h2, .terminal-content h3'));

                    if (headings.length === 0) {
                        if (btn) btn.style.display = 'none';
                        return;
                    }

                    if (btn) {
                        requestAnimationFrame(() => {
                            btn.classList.remove('opacity-0', 'scale-90');
                        });
                    }

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
                        a.className = 'block transition line-clamp-1 no-underline';
                        a.style.color = 'color-mix(in srgb, var(--terminal-fg) 65%, transparent)';
                        a.textContent = h.innerText;

                        a.addEventListener('click', closeToc);

                        li.appendChild(a);
                        list.appendChild(li);
                    });

                    const style = document.createElement('style');
                    style.textContent = \`
                        html {
                            scroll-behavior: smooth;
                            scroll-padding-top: 80px;
                        }
                    \`;
                    document.head.appendChild(style);

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

                    function updateProgress() {
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                        const scrollHeight = Math.max(
                            document.body.scrollHeight, document.documentElement.scrollHeight,
                            document.body.offsetHeight, document.documentElement.offsetHeight,
                            document.body.clientHeight, document.documentElement.clientHeight
                        );
                        const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                        const docHeight = scrollHeight - clientHeight;

                        let percent = 0;
                        if (docHeight > 0) {
                            percent = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
                        }

                        if (percentEl) percentEl.textContent = percent + '%';
                        if (progressEl) progressEl.style.width = percent + '%';

                        const scrollPos = scrollTop + 150;
                        let currentHeading = null;

                        for (let i = 0; i < headings.length; i++) {
                            const top = headings[i].getBoundingClientRect().top + window.pageYOffset;
                            if (top <= scrollPos) {
                                currentHeading = headings[i];
                            } else {
                                break;
                            }
                        }

                        const tocLinks = list.querySelectorAll('a');
                        tocLinks.forEach((link, index) => {
                            if (headings[index] === currentHeading) {
                                link.style.color = 'var(--terminal-accent)';
                                link.style.fontWeight = '600';
                            } else {
                                link.style.color = 'color-mix(in srgb, var(--terminal-fg) 65%, transparent)';
                                link.style.fontWeight = '400';
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
