/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/theme/landing.config';

import { ChristmasHat } from '../../../core/components/ChristmasHat';

export function Header() {
    return (
        <header class="fixed w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <ChristmasHat>
                    <div class="font-bold text-xl">{config.title}</div>
                </ChristmasHat>
                <nav class="hidden md:flex space-x-8">
                    <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400">Features</a>
                    <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400">Pricing</a>
                    <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400">About</a>
                </nav>
                <a href={config.hero.ctaLink} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    {config.hero.ctaText}
                </a>
            </div>
        </header>
    );
}
