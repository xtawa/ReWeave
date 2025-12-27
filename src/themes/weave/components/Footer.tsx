/** @jsx h */
import { h, Fragment } from 'preact';
import { config } from '../../../config/theme/weave.config';
import { t } from '../../../core/i18n';

export function Footer() {
    return (
        <footer class="mt-20 border-t border-gray-100 dark:border-zinc-800 py-10">
            <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <div class="flex flex-col items-center sm:items-start">
                    <p class="text-sm text-gray-400 dark:text-zinc-500">
                        &copy; {new Date().getFullYear()} {config.footer?.copyright || config.title}. {t('allRightsReserved', config.language)}.
                    </p>
                    {config.footer?.icp && (
                        <p class="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                            {config.footer.icp}
                        </p>
                    )}
                    <p class="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                        {t('poweredBy', config.language)} <a href="https://github.com/xtawa/ReWeave" target="_blank" rel="noopener noreferrer" class="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 transition">ReWeave</a> {config.language === 'zh' ? '驱动' : ''} {(config as any).version && <span class="text-gray-300 dark:text-zinc-600"> · {config.language === 'zh' ? '版本' : 'v'}{(config as any).version}</span>}
                    </p>
                </div>
                <div class="flex items-center gap-6">
                    <div class="flex gap-6 text-sm font-medium text-gray-800 dark:text-zinc-200">
                        <a href="/" class="transition hover:text-teal-500">{t('home', config.language)}</a>
                        <a href="/stats/" class="transition hover:text-teal-500">{t('stats', config.language)}</a>
                        {config.social?.twitter && (
                            <a href={config.social.twitter} class="transition hover:text-teal-500">Twitter</a>
                        )}
                        {config.social?.github && (
                            <a href={config.social.github} class="transition hover:text-teal-500">GitHub</a>
                        )}
                    </div>
                    <button
                        id="theme-toggle"
                        type="button"
                        class="rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 transition"
                        aria-label="Toggle dark mode"
                    >
                        <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                        </svg>
                        <svg id="theme-toggle-light-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
            {config.themeTransition === 'circle-clip' && (
                <style dangerouslySetInnerHTML={{
                    __html: `
                    ::view-transition-old(root),
                    ::view-transition-new(root) {
                        animation: none;
                        mix-blend-mode: normal;
                    }
                    ::view-transition-old(root) {
                        z-index: 1;
                    }
                    ::view-transition-new(root) {
                        z-index: 9999;
                    }
                    .dark::view-transition-old(root) {
                        z-index: 9999;
                    }
                    .dark::view-transition-new(root) {
                        z-index: 1;
                    }
                ` }} />
            )}
            {config.themeTransition === 'macos-loading' && (
                <>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .theme-transition,
                        .theme-transition *,
                        .theme-transition *:before,
                        .theme-transition *:after {
                            transition: all 0.5s ease-in-out !important;
                            transition-delay: 0 !important;
                        }
                    ` }} />
                    <div id="theme-transition-overlay" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-xl opacity-0 pointer-events-none transition-all duration-500">
                        <div class="text-2xl font-bold text-zinc-900 dark:text-white mb-8 transform scale-95 transition-all duration-500 opacity-0 translate-y-4" id="transition-title">
                            {config.title}
                        </div>
                        <div class="w-48 h-1 bg-zinc-200/50 dark:bg-zinc-700/50 rounded-full overflow-hidden backdrop-blur-md">
                            <div id="transition-bar" class="h-full bg-teal-500 w-0 rounded-full"></div>
                        </div>
                    </div>
                </>
            )}
            <script dangerouslySetInnerHTML={{
                __html: `
                (function() {
                    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
                    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
                    const themeToggleBtn = document.getElementById('theme-toggle');
                    const transitionStyle = '${config.themeTransition || 'default'}';
                    
                    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                        themeToggleLightIcon.classList.remove('hidden');
                        document.documentElement.classList.add('dark');
                    } else {
                        themeToggleDarkIcon.classList.remove('hidden');
                    }
                    
                    function toggleTheme() {
                        themeToggleDarkIcon.classList.toggle('hidden');
                        themeToggleLightIcon.classList.toggle('hidden');
                        
                        if (localStorage.getItem('color-theme')) {
                            if (localStorage.getItem('color-theme') === 'light') {
                                document.documentElement.classList.add('dark');
                                localStorage.setItem('color-theme', 'dark');
                            } else {
                                document.documentElement.classList.remove('dark');
                                localStorage.setItem('color-theme', 'light');
                            }
                        } else {
                            if (document.documentElement.classList.contains('dark')) {
                                document.documentElement.classList.remove('dark');
                                localStorage.setItem('color-theme', 'light');
                            } else {
                                document.documentElement.classList.add('dark');
                                localStorage.setItem('color-theme', 'dark');
                            }
                        }
                    }

                    themeToggleBtn.addEventListener('click', function(event) {
                        if (transitionStyle === 'macos-loading') {
                            const overlay = document.getElementById('theme-transition-overlay');
                            const bar = document.getElementById('transition-bar');
                            const title = document.getElementById('transition-title');
                            
                            // 1. Show Overlay
                            overlay.classList.remove('opacity-0', 'pointer-events-none');
                            
                            // 2. Animate Title
                            setTimeout(() => {
                                title.classList.remove('opacity-0', 'translate-y-4', 'scale-95');
                            }, 100);

                            // 3. Start Progress Bar & Enable Transition
                            setTimeout(() => {
                                document.documentElement.classList.add('theme-transition');
                                bar.style.transition = 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
                                bar.style.width = '100%';
                            }, 200);

                            // 4. Toggle Theme (at ~50% time)
                            setTimeout(() => {
                                toggleTheme();
                            }, 800);

                            // 5. Finish
                            setTimeout(() => {
                                overlay.classList.add('opacity-0', 'pointer-events-none');
                                title.classList.add('opacity-0', 'translate-y-4', 'scale-95');
                                
                                // Reset bar and remove transition class
                                setTimeout(() => {
                                    document.documentElement.classList.remove('theme-transition');
                                    bar.style.transition = 'none';
                                    bar.style.width = '0';
                                }, 500); // Wait for overlay fade out
                            }, 1800);

                        } else if (transitionStyle === 'circle-clip' && document.startViewTransition) {
                             const x = event.clientX;
                             const y = event.clientY;
                             const endRadius = Math.hypot(
                                 Math.max(x, innerWidth - x),
                                 Math.max(y, innerHeight - y)
                             );

                             const transition = document.startViewTransition(() => {
                                 toggleTheme();
                             });

                             transition.ready.then(() => {
                                 const clipPath = [
                                     \`circle(0px at \${x}px \${y}px)\`,
                                     \`circle(\${endRadius}px at \${x}px \${y}px)\`
                                 ];
                                 document.documentElement.animate(
                                     {
                                         clipPath: document.documentElement.classList.contains('dark') ? clipPath : [...clipPath].reverse(),
                                     },
                                     {
                                         duration: 500,
                                         easing: 'ease-in',
                                         pseudoElement: document.documentElement.classList.contains('dark') ? '::view-transition-new(root)' : '::view-transition-old(root)',
                                     }
                                 );
                             });
                        } else {
                            // Default transition
                            document.documentElement.classList.add('theme-transition');
                            toggleTheme();
                            setTimeout(() => {
                                document.documentElement.classList.remove('theme-transition');
                            }, 300);
                        }
                    });
                })();
            ` }}></script>
        </footer>
    );
}
