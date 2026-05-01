/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/theme/terminal.config';
import { t } from '../../../core/i18n';

export function Header() {
    return (
        <header class="relative z-50 mb-10">
            <div class="flex items-center justify-between gap-4">
                {/* Logo with accent background */}
                <div class="flex items-center flex-shrink-0">
                    <a
                        href="/"
                        class="flex items-center gap-2 px-3 py-1.5 font-bold no-underline"
                        style="background: var(--terminal-accent); color: var(--terminal-bg);"
                        aria-label="Home"
                    >
                        {config.logo ? (
                            <img
                                src={config.logo.path.startsWith('http') ? config.logo.path : `/${config.logo.path}`}
                                alt={config.logo.alt || config.title}
                                class="h-6 w-6 object-cover"
                                data-avatar="true"
                            />
                        ) : null}
                        <span class="text-sm">{config.title}</span>
                    </a>
                    {/* Horizontal line pattern */}
                    <div
                        class="hidden sm:block flex-1 h-[35px] ml-2.5"
                        style="background: repeating-linear-gradient(90deg, var(--terminal-accent), var(--terminal-accent) 2px, transparent 0, transparent 10px);"
                    />
                </div>

                {/* Desktop Navigation */}
                <nav class="hidden md:block">
                    <ul class="flex items-center gap-1">
                        {config.navbar?.items.map((item) => (
                            <li key={item.key} class={item.children ? "relative group" : ""}>
                                <a
                                    class="block px-3 py-2 text-sm transition no-underline"
                                    style="color: var(--terminal-fg-dim);"
                                    href={item.href}
                                    onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }}
                                    onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg-dim)'; }}
                                >
                                    {item.label || t(item.key as any, config.language)}
                                    {item.children && (
                                        <svg class="inline-block ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    )}
                                </a>
                                {item.children && (
                                    <ul
                                        class="absolute left-0 mt-0 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                                        style="background: var(--terminal-bg); border: 1px solid var(--terminal-border);"
                                    >
                                        {item.children.map((child) => (
                                            <li key={child.key}>
                                                <a
                                                    class="block px-4 py-2 text-sm transition no-underline"
                                                    style="color: var(--terminal-fg-dim);"
                                                    href={child.href}
                                                    onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }}
                                                    onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg-dim)'; }}
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

                {/* Search + Mobile Menu */}
                <div class="flex items-center gap-3">
                    <a
                        href="/search"
                        class="hidden md:flex items-center justify-center w-8 h-8 transition"
                        style="color: var(--terminal-fg-dim);"
                        aria-label="Search"
                        onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }}
                        onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg-dim)'; }}
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </a>

                    {/* Mobile Menu Button */}
                    <div class="flex md:hidden gap-2">
                        <a
                            href="/search"
                            class="flex items-center justify-center w-8 h-8 transition"
                            style="color: var(--terminal-fg-dim);"
                            aria-label="Search"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </a>
                        <button
                            id="mobile-menu-btn"
                            class="flex items-center justify-center w-8 h-8 transition"
                            style="color: var(--terminal-fg-dim);"
                            aria-label="Toggle Menu"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div id="mobile-menu" class="fixed inset-0 z-50 hidden transition-opacity duration-300 opacity-0" style="background: var(--terminal-bg);">
                <div class="flex flex-col h-full p-6">
                    <div class="flex justify-end mb-8">
                        <button
                            id="close-menu-btn"
                            class="p-2 transition"
                            style="color: var(--terminal-fg-dim);"
                            aria-label="Close Menu"
                        >
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        class="block text-2xl font-medium transition no-underline"
                                        style="color: var(--terminal-fg);"
                                    >
                                        {item.label || t(item.key as any, config.language)}
                                    </a>
                                    {item.children && (
                                        <ul class="mt-2 ml-4 space-y-2 pl-4" style="border-left: 2px solid var(--terminal-border);">
                                            {item.children.map((child) => (
                                                <li key={child.key}>
                                                    <a
                                                        href={child.href}
                                                        class="block text-lg transition no-underline"
                                                        style="color: var(--terminal-fg-dim);"
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
                            requestAnimationFrame(() => {
                                menu.classList.remove('opacity-0');
                            });
                            document.body.style.overflow = 'hidden';
                        } else {
                            menu.classList.add('opacity-0');
                            setTimeout(() => {
                                menu.classList.add('hidden');
                            }, 300);
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
