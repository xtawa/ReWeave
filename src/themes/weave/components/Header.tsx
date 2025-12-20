/** @jsx h */
import { h } from 'preact';
import { config } from '../../../core/config';
import { t } from '../../../core/i18n';

export function Header() {
    return (
        <header class="pointer-events-none flex flex-none flex-col">
            <div class="top-0 z-10 h-16 pt-6">
                <div class="sm:px-8 w-full">
                    <div class="mx-auto w-full max-w-7xl lg:px-8">
                        <div class="relative px-4 sm:px-8 lg:px-12">
                            <div class="mx-auto max-w-2xl lg:max-w-5xl">
                                <div class="relative flex gap-4">
                                    <div class="flex flex-1">
                                        <div class="h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10">
                                            <a href="/" class="pointer-events-auto block h-9 w-9 bg-zinc-100 rounded-full dark:bg-zinc-800" aria-label="Home">
                                                {config.logo ? (
                                                    <img
                                                        src={config.logo.path.startsWith('http') ? config.logo.path : `/${config.logo.path}`}
                                                        alt={config.logo.alt || config.title}
                                                        class="h-full w-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div class="h-full w-full rounded-full bg-gradient-to-br from-teal-400 to-blue-500 opacity-80" />
                                                )}
                                            </a>
                                        </div>
                                    </div>
                                    <div class="flex flex-1 justify-end md:justify-center">
                                        <nav class="pointer-events-auto hidden md:block">
                                            <ul class="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                                                <li>
                                                    <a class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400" href="/">{t('home', config.language)}</a>
                                                </li>
                                                <li class="relative group">
                                                    <a class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 cursor-pointer" href="/archive.html">
                                                        {t('archive', config.language)}
                                                        <svg class="inline-block ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                                        </svg>
                                                    </a>
                                                    <ul class="absolute left-0 mt-0 w-32 bg-white dark:bg-zinc-800 rounded-lg shadow-lg ring-1 ring-zinc-900/5 dark:ring-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                        <li>
                                                            <a class="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-t-lg transition" href="/categories.html">
                                                                {t('categories', config.language)}
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a class="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-b-lg transition" href="/tags.html">
                                                                {t('tags', config.language)}
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <a class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400" href="/about">{t('about', config.language)}</a>
                                                </li>
                                                <li>
                                                    <a class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400" href="/projects">{t('projects', config.language)}</a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
