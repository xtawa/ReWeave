/** @jsx h */
import { h } from 'preact';
import { config } from '../config';
import { t } from '../../../core/i18n';

export function Header() {
    return (
        <header id="page-header" class="fixed top-0 w-full z-50 transition-all duration-300 bg-transparent text-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div class="flex-shrink-0">
                        <a href="/" class="text-xl font-bold tracking-wider hover:text-blue-400 transition-colors">
                            {config.title}
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                            {config.navbar?.items.map((item) => (
                                <div key={item.key} class="relative group">
                                    <a
                                        href={item.href}
                                        class="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 hover:text-blue-300 transition-colors flex items-center gap-2"
                                    >
                                        <i class={`fas fa-${getIconFor(item.key)}`}></i>
                                        {item.label || t(item.key as any, config.language)}
                                        {item.children && <i class="fas fa-chevron-down text-xs ml-1"></i>}
                                    </a>
                                    {item.children && (
                                        <div class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-zinc-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                                            <div class="py-1" role="menu" aria-orientation="vertical">
                                                {item.children.map((child) => (
                                                    <a
                                                        key={child.key}
                                                        href={child.href}
                                                        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-blue-500"
                                                        role="menuitem"
                                                    >
                                                        <i class={`fas fa-${getIconFor(child.key)} mr-2 w-4 text-center`}></i>
                                                        {child.label || t(child.key as any, config.language)}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div class="md:hidden">
                        <button id="mobile-menu-btn" class="inline-flex items-center justify-center p-2 rounded-md hover:text-white hover:bg-white/10 focus:outline-none">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div id="mobile-menu" class="fixed inset-0 z-50 hidden bg-gray-900/95 backdrop-blur-sm transition-opacity duration-300 opacity-0">
                <div class="flex flex-col h-full p-6">
                    <div class="flex justify-end mb-8">
                        <button id="close-menu-btn" class="p-2 rounded-full hover:bg-white/10 text-white transition">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <nav class="flex-1 overflow-y-auto">
                        <ul class="flex flex-col space-y-4">
                            {config.navbar?.items.map((item) => (
                                <li key={item.key}>
                                    <a href={item.href} class="block text-xl font-medium text-white hover:text-blue-400 transition">
                                        <i class={`fas fa-${getIconFor(item.key)} mr-3 w-6 text-center`}></i>
                                        {item.label || t(item.key as any, config.language)}
                                    </a>
                                    {item.children && (
                                        <ul class="mt-2 ml-4 space-y-2 border-l-2 border-white/20 pl-4">
                                            {item.children.map((child) => (
                                                <li key={child.key}>
                                                    <a href={child.href} class="block text-lg text-gray-300 hover:text-blue-400 transition">
                                                        <i class={`fas fa-${getIconFor(child.key)} mr-3 w-6 text-center`}></i>
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

            <script dangerouslySetInnerHTML={{
                __html: `
                // Navbar scroll effect
                window.addEventListener('scroll', () => {
                    const header = document.getElementById('page-header');
                    if (window.scrollY > 0) {
                        header.classList.remove('bg-transparent', 'text-white');
                        header.classList.add('bg-white/80', 'dark:bg-zinc-900/80', 'backdrop-blur-md', 'shadow-md', 'text-gray-800', 'dark:text-white');
                    } else {
                        header.classList.add('bg-transparent', 'text-white');
                        header.classList.remove('bg-white/80', 'dark:bg-zinc-900/80', 'backdrop-blur-md', 'shadow-md', 'text-gray-800', 'dark:text-white');
                    }
                });

                // Mobile menu
                const btn = document.getElementById('mobile-menu-btn');
                const menu = document.getElementById('mobile-menu');
                const closeBtn = document.getElementById('close-menu-btn');

                function toggleMenu() {
                    const isHidden = menu.classList.contains('hidden');
                    if (isHidden) {
                        menu.classList.remove('hidden');
                        requestAnimationFrame(() => menu.classList.remove('opacity-0'));
                        document.body.style.overflow = 'hidden';
                    } else {
                        menu.classList.add('opacity-0');
                        setTimeout(() => menu.classList.add('hidden'), 300);
                        document.body.style.overflow = '';
                    }
                }

                if (btn && menu && closeBtn) {
                    btn.addEventListener('click', toggleMenu);
                    closeBtn.addEventListener('click', toggleMenu);
                }
                `
            }} />
        </header>
    );
}

function getIconFor(key: string): string {
    const icons: Record<string, string> = {
        home: 'home',
        articles: 'newspaper',
        archive: 'archive',
        categories: 'folder-open',
        tags: 'tags',
        projects: 'code-branch',
        about: 'user',
        moments: 'comment-alt'
    };
    return icons[key] || 'circle';
}
