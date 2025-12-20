/** @jsx h */
import { h } from 'preact';
import { config } from '../../../core/config';

export function Footer() {
    return (
        <footer class="mt-20 border-t border-gray-100 py-10">
            <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <p class="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} {config.title}. All rights reserved.
                </p>
                <div class="flex gap-6 text-sm font-medium text-gray-800">
                    <a href="/" class="transition hover:text-teal-500">Home</a>
                    {config.social?.twitter && (
                        <a href={config.social.twitter} class="transition hover:text-teal-500">Twitter</a>
                    )}
                    {config.social?.github && (
                        <a href={config.social.github} class="transition hover:text-teal-500">GitHub</a>
                    )}
                </div>
            </div>
        </footer>
    );
}
