/** @jsx h */
import { h } from 'preact';
import { config } from '../../../core/config';
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
                </div>
                <div class="flex items-center gap-6">
                    <div class="flex gap-6 text-sm font-medium text-gray-800 dark:text-zinc-200">
                        <a href="/" class="transition hover:text-teal-500">{t('home', config.language)}</a>
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
            <script dangerouslySetInnerHTML={{
                __html: `
                (function() {
                    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
                    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
                    const themeToggleBtn = document.getElementById('theme-toggle');
                    
                    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                        themeToggleLightIcon.classList.remove('hidden');
                        document.documentElement.classList.add('dark');
                    } else {
                        themeToggleDarkIcon.classList.remove('hidden');
                    }
                    
                    themeToggleBtn.addEventListener('click', function() {
                        // Add transition class
                        document.documentElement.classList.add('theme-transition');

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

                        // Remove transition class after animation
                        setTimeout(() => {
                            document.documentElement.classList.remove('theme-transition');
                        }, 300);
                    });
                })();
            ` }}></script>
        </footer>
    );
}
