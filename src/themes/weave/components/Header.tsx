/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/weave.config';
import { t } from '../../../core/i18n';

import { ChristmasHat } from '../../../core/components/ChristmasHat';

export function Header() {
    return (
        <header class="pointer-events-none relative z-50 flex flex-none flex-col mb-12">
            <div class="top-0 z-10 h-16 pt-4">
                <div class="relative flex items-center justify-between gap-4 w-full">
                    {/* Logo */}
                    <div class="flex">
                        <a href="/" class="pointer-events-auto relative flex h-10 items-center rounded-full bg-white/90 p-1 pr-4 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20" aria-label="Home">
                            <ChristmasHat offset="-top-4 -right-1" size="w-6 h-6" rotate="rotate-12">
                                {config.logo ? (
                                    <img
                                        src={config.logo.path.startsWith('http') ? config.logo.path : `/${config.logo.path}`}
                                        alt={config.logo.alt || config.title}
                                        class="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div class="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500" />
                                )}
                            </ChristmasHat>
                            <span class="ml-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">{config.title}</span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div class="flex flex-1 justify-end">
                        <nav class="pointer-events-auto hidden md:block">
                            <ul class="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                                {config.navbar?.items.map((item) => (
                                    <li key={item.key} class={item.children ? "relative group" : ""}>
                                        <a
                                            class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-500/10 rounded-full hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] dark:hover:shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                                            href={item.href}
                                        >
                                            {item.label || t(item.key as any, config.language)}
                                            {item.children && (
                                                <svg class="inline-block ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            )}
                                        </a>
                                        {item.children && (
                                            <ul class="absolute left-0 mt-0 w-32 bg-white dark:bg-zinc-800 rounded-lg shadow-lg ring-1 ring-zinc-900/5 dark:ring-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                {item.children.map((child, index) => (
                                                    <li key={child.key}>
                                                        <a
                                                            class={`block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition ${index === 0 ? 'rounded-t-lg' : ''} ${index === item.children!.length - 1 ? 'rounded-b-lg' : ''}`}
                                                            href={child.href}
                                                        >
                                                            {child.label || t(child.key as any, config.language)}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div class="pointer-events-auto md:hidden">
                            <button
                                id="mobile-menu-btn"
                                class="group flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
                                aria-label="Toggle Menu"
                            >
                                <svg class="h-5 w-5 text-zinc-800 dark:text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div id="mobile-menu" class="pointer-events-auto fixed inset-0 z-50 hidden bg-white/95 backdrop-blur-sm dark:bg-zinc-900/95 transition-opacity duration-300 opacity-0">
                <div class="flex flex-col h-full p-6">
                    <div class="flex justify-end mb-8">
                        <button
                            id="close-menu-btn"
                            class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            aria-label="Close Menu"
                        >
                            <svg class="h-6 w-6 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <nav class="flex-1">
                        <ul class="flex flex-col space-y-4">
                            {config.navbar?.items.map((item) => (
                                <li key={item.key}>
                                    <a
                                        href={item.href}
                                        class="block text-2xl font-medium text-zinc-800 dark:text-zinc-200 hover:text-teal-500 dark:hover:text-teal-400 transition"
                                    >
                                        {item.label || t(item.key as any, config.language)}
                                    </a>
                                    {item.children && (
                                        <ul class="mt-2 ml-4 space-y-2 border-l-2 border-zinc-100 dark:border-zinc-800 pl-4">
                                            {item.children.map((child) => (
                                                <li key={child.key}>
                                                    <a
                                                        href={child.href}
                                                        class="block text-lg text-zinc-600 dark:text-zinc-400 hover:text-teal-500 dark:hover:text-teal-400 transition"
                                                    >
                                                        {child.label || t(child.key as any, config.language)}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Mobile Menu Script */}
            <script dangerouslySetInnerHTML={{
                __html: `
                (function() {
                    const btn = document.getElementById('mobile-menu-btn');
                    const menu = document.getElementById('mobile-menu');
                    const closeBtn = document.getElementById('close-menu-btn');

                    function toggleMenu() {
                        const isHidden = menu.classList.contains('hidden');
                        if (isHidden) {
                            menu.classList.remove('hidden');
                            // Small delay to allow display:block to apply before opacity transition
                            requestAnimationFrame(() => {
                                menu.classList.remove('opacity-0');
                            });
                            document.body.style.overflow = 'hidden';
                        } else {
                            menu.classList.add('opacity-0');
                            setTimeout(() => {
                                menu.classList.add('hidden');
                            }, 300); // Match transition duration
                            document.body.style.overflow = '';
                        }
                    }

                    if (btn && menu && closeBtn) {
                        btn.addEventListener('click', toggleMenu);
                        closeBtn.addEventListener('click', toggleMenu);
                    }
                })();
            `}} />
        </header>
    );
}
