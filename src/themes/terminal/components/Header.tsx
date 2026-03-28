/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/theme/terminal.config';
import { t } from '../../../core/i18n';

const PROMPT = '$';

export function Header() {
    return (
        <header class="mb-10 bg-black/40 border border-emerald-500/20 rounded-none p-4 md:p-6">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <a href="/" class="inline-flex items-center gap-3 text-zinc-200 no-underline border border-emerald-500/30 px-3 py-2 hover:border-cyan-400/70 hover:text-cyan-300">
                    <span class="text-emerald-400">{PROMPT}</span>
                    <span class="font-semibold tracking-wide">{config.title}</span>
                </a>
                <nav>
                    <ul class="flex flex-wrap gap-2 md:gap-3">
                        {config.navbar?.items.map((item) => (
                            <li key={item.key}>
                                <a
                                    href={item.href}
                                    class="inline-flex items-center gap-2 border border-emerald-500/20 px-3 py-1.5 text-zinc-300 no-underline hover:text-emerald-300 hover:border-cyan-400/60 focus-visible:outline-none focus-visible:border-cyan-300"
                                >
                                    <span class="text-emerald-400">~/</span>
                                    <span>{item.label || t(item.key as any, config.language)}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
