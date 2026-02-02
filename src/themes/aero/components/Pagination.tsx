/** @jsx h */
import { h } from 'preact';

interface PaginationProps {
    current: number;
    total: number;
    baseUrl: string;
}

export function Pagination({ current, total, baseUrl }: PaginationProps) {
    if (total <= 1) return null;

    const pages = [];
    for (let i = 1; i <= total; i++) {
        pages.push(i);
    }

    return (
        <div class="flex justify-center gap-2 mt-8">
            {pages.map(page => (
                <a
                    href={page === 1 ? baseUrl : `${baseUrl}/${page}`}
                    class={`aero-btn text-sm px-3 py-1 rounded-full ${page === current ? 'font-bold ring-2 ring-blue-300' : ''}`}
                >
                    {page}
                </a>
            ))}
        </div>
    );
}
