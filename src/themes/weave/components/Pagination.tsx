/** @jsx h */
import { h } from 'preact';

interface PaginationProps {
    current: number;
    total: number;
    baseUrl: string; // e.g., '/articles'
}

export function Pagination({ current, total, baseUrl }: PaginationProps) {
    const prevPage = current > 1 ? (current === 2 ? `${baseUrl}.html` : `${baseUrl}/${current - 1}.html`) : null;
    const nextPage = current < total ? `${baseUrl}/${current + 1}.html` : null;

    // Helper to generate page link
    const getPageLink = (page: number) => page === 1 ? `${baseUrl}.html` : `${baseUrl}/${page}.html`;

    // Simple range generator
    const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // Logic to show limited page numbers (e.g., 1, 2, ..., 5, 6, 7, ..., 10)
    let pages: (number | string)[] = [];
    if (total <= 7) {
        pages = range(1, total);
    } else {
        if (current <= 4) {
            pages = [...range(1, 5), '...', total];
        } else if (current >= total - 3) {
            pages = [1, '...', ...range(total - 4, total)];
        } else {
            pages = [1, '...', ...range(current - 1, current + 1), '...', total];
        }
    }

    return (
        <nav class="flex justify-center items-center space-x-2 mt-12 animate-fade-in-up" aria-label="Pagination">
            {/* Previous Button */}
            {prevPage ? (
                <a href={prevPage} class="px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 transition shadow-sm ring-1 ring-zinc-900/5 dark:ring-white/10">
                    &larr;
                </a>
            ) : (
                <span class="px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-zinc-300 dark:text-zinc-600 cursor-not-allowed ring-1 ring-zinc-900/5 dark:ring-white/5">
                    &larr;
                </span>
            )}

            {/* Page Numbers */}
            <div class="hidden sm:flex space-x-2">
                {pages.map((page, index) => (
                    typeof page === 'number' ? (
                        <a
                            key={index}
                            href={getPageLink(page)}
                            class={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ring-1 ring-zinc-900/5 dark:ring-white/10 ${current === page
                                    ? 'bg-teal-500 text-white ring-teal-500 dark:ring-teal-500'
                                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400'
                                }`}
                        >
                            {page}
                        </a>
                    ) : (
                        <span key={index} class="px-2 py-2 text-zinc-400 dark:text-zinc-600">
                            ...
                        </span>
                    )
                ))}
            </div>

            {/* Mobile Current Page Indicator */}
            <span class="sm:hidden text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                {current} / {total}
            </span>

            {/* Next Button */}
            {nextPage ? (
                <a href={nextPage} class="px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 transition shadow-sm ring-1 ring-zinc-900/5 dark:ring-white/10">
                    &rarr;
                </a>
            ) : (
                <span class="px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-zinc-300 dark:text-zinc-600 cursor-not-allowed ring-1 ring-zinc-900/5 dark:ring-white/5">
                    &rarr;
                </span>
            )}
        </nav>
    );
}
