/** @jsx h */
import { h } from 'preact';

export function Footer() {
    return (
        <footer class="border-t border-emerald-500/20 bg-black/30">
            <div class="mx-auto max-w-6xl px-4 md:px-6 py-4 text-xs text-zinc-500 font-mono">
                <span class="text-emerald-400">&gt;</span> terminal theme · powered by ReWeave
            </div>
        </footer>
    );
}
