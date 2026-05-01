/** @jsx h */
import { h } from 'preact';

interface PaginationProps {
    current: number;
    total: number;
    baseUrl: string;
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

    const btnStyle = "px-4 py-2 text-sm font-bold transition no-underline";

    return (
        <nav class="flex justify-center items-center space-x-2 mt-12" aria-label="Pagination">
            {/* Previous Button */}
            {prevPage ? (
                <a href={prevPage} class={btnStyle} style="color: var(--terminal-accent); border: 2px solid var(--terminal-accent);">
                    &larr;
                </a>
            ) : (
                <span class={btnStyle} style="color: var(--terminal-fg-dim); border: 2px solid var(--terminal-border); opacity: 0.5;">
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
                            class={btnStyle}
                            style={current === page
                                ? "background: var(--terminal-accent); color: var(--terminal-bg); border: 2px solid var(--terminal-accent);"
                                : "color: var(--terminal-accent); border: 2px solid var(--terminal-accent);"
                            }
                        >
                            {page}
                        </a>
                    ) : (
                        <span key={index} class="px-2 py-2 text-sm" style="color: var(--terminal-fg-dim);">
                            ...
                        </span>
                    )
                ))}
            </div>

            {/* Mobile Current Page Indicator */}
            <span class="sm:hidden text-sm font-medium" style="color: var(--terminal-fg-dim);">
                {current} / {total}
            </span>

            {/* Next Button */}
            {nextPage ? (
                <a href={nextPage} class={btnStyle} style="color: var(--terminal-accent); border: 2px solid var(--terminal-accent);">
                    &rarr;
                </a>
            ) : (
                <span class={btnStyle} style="color: var(--terminal-fg-dim); border: 2px solid var(--terminal-border); opacity: 0.5;">
                    &rarr;
                </span>
            )}
        </nav>
    );
}
