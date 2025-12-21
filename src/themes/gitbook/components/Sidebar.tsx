/** @jsx h */
import { h } from 'preact';

export interface SidebarItem {
    title: string;
    url?: string;
    children?: SidebarItem[];
    isActive?: boolean;
}

interface SidebarProps {
    items: SidebarItem[];
    title: string;
}

export function Sidebar({ items, title }: SidebarProps) {
    const renderItems = (items: SidebarItem[], depth = 0) => {
        return (
            <ul class={`space-y-1 ${depth > 0 ? 'ml-4 border-l border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
                {items.map((item) => (
                    <li>
                        {item.url ? (
                            <a
                                href={item.url}
                                class={`block py-1.5 text-sm transition-colors ${item.isActive
                                        ? 'font-medium text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                {item.title}
                            </a>
                        ) : (
                            <span class="block py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {item.title}
                            </span>
                        )}
                        {item.children && item.children.length > 0 && renderItems(item.children, depth + 1)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <aside class="fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-white border-r border-gray-200 px-6 py-8 transition-transform duration-300 dark:bg-gray-900 dark:border-gray-800 lg:translate-x-0 -translate-x-full" id="sidebar">
            <div class="mb-8">
                <a href="/" class="text-xl font-bold text-gray-900 dark:text-white">
                    {title}
                </a>
            </div>
            <nav>{renderItems(items)}</nav>
        </aside>
    );
}
