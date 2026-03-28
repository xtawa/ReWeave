/** @jsx h */
import { h } from 'preact';

interface PaginationProps {
    current: number;
    total: number;
    baseUrl: string;
}

export function Pagination({ current, total, baseUrl }: PaginationProps) {
    const prevPage = current > 1 ? (current === 2 ? baseUrl : `${baseUrl}/${current - 1}`) : null;
    const nextPage = current < total ? `${baseUrl}/${current + 1}` : null;

    return (
        <nav class="mt-10 flex items-center justify-between gap-4 bg-black/40 border border-emerald-500/20 rounded-none p-3" aria-label="Pagination">
            {prevPage ? (
                <a href={prevPage} class="border border-emerald-500/40 px-3 py-1 text-zinc-200 no-underline hover:text-cyan-300 hover:border-cyan-400">{'< prev'}</a>
            ) : (
                <span class="border border-zinc-700 px-3 py-1 text-zinc-500">{'< prev'}</span>
            )}
            <span class="text-zinc-300 border border-emerald-500/20 px-3 py-1">[{current} / {total}]</span>
            {nextPage ? (
                <a href={nextPage} class="border border-emerald-500/40 px-3 py-1 text-zinc-200 no-underline hover:text-cyan-300 hover:border-cyan-400">{'next >'}</a>
            ) : (
                <span class="border border-zinc-700 px-3 py-1 text-zinc-500">{'next >'}</span>
            )}
        </nav>
    );
}
