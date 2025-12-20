/** @jsx h */
import { h } from 'preact';

interface PaginationProps {
    current: number;
    total: number;
    baseUrl: string; // e.g., '/articles'
}

export function Pagination({ current, total, baseUrl }: PaginationProps) {
    const prevPage = current > 1 ? (current === 2 ? `${baseUrl}` : `${baseUrl}/${current - 1}`) : null;
    const nextPage = current < total ? `${baseUrl}/${current + 1}` : null;

    const getPageLink = (page: number) => page === 1 ? `${baseUrl}` : `${baseUrl}/${page}`;
    const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

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
        <nav class="flex justify-center items-center space-x-2 mt-12 mb-8" aria-label="Pagination">
            {prevPage && (
                <a href={prevPage} class="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-zinc-800 text-gray-500 hover:bg-blue-400 hover:text-white transition shadow-sm">
                    <i class="fas fa-chevron-left text-xs"></i>
                </a>
            )}

            <div class="hidden sm:flex space-x-2">
                {pages.map((page, index) => (
                    typeof page === 'number' ? (
                        <a
                            key={index}
                            href={getPageLink(page)}
                            class={`w-8 h-8 flex items-center justify-center rounded transition shadow-sm ${current === page
                                ? 'bg-blue-400 text-white'
                                : 'bg-white dark:bg-zinc-800 text-gray-500 hover:bg-blue-400 hover:text-white'
                                }`}
                        >
                            {page}
                        </a>
                    ) : (
                        <span key={index} class="w-8 h-8 flex items-center justify-center text-gray-400">
                            ...
                        </span>
                    )
                ))}
            </div>

            <span class="sm:hidden text-sm text-gray-500 font-medium">
                {current} / {total}
            </span>

            {nextPage && (
                <a href={nextPage} class="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-zinc-800 text-gray-500 hover:bg-blue-400 hover:text-white transition shadow-sm">
                    <i class="fas fa-chevron-right text-xs"></i>
                </a>
            )}
        </nav>
    );
}
