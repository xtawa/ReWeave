/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/theme/terminal.config';

export function Hero() {
    if (!config.hero?.enabled) return null;

    return (
        <section class="mb-10 bg-black/40 border border-emerald-500/20 rounded-none p-6 md:p-8">
            <p class="text-zinc-400 mb-2"><span class="text-emerald-400">{config.hero.promptPrefix || '~/site'}</span> $ init</p>
            <h1 class="text-2xl md:text-4xl text-zinc-100 font-semibold mb-3 tracking-tight">{config.hero.title || config.title}</h1>
            <p class="text-zinc-300 mb-2">{config.hero.subtitle || config.description}</p>
            <p class="text-zinc-400">{config.hero.description}</p>
        </section>
    );
}
