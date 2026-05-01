/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/theme/terminal.config';

export function Hero() {
    if (!config.hero || !config.hero.enabled) return null;

    const { name, role, description, avatar, social } = config.hero;

    return (
        <div class="min-h-[60vh] flex flex-col justify-center py-12 space-y-8">
            {/* Terminal prompt */}
            <div class="space-y-2">
                <p style="color: var(--terminal-fg-dim);">
                    <span style="color: var(--terminal-accent);">$</span> whoami
                </p>
            </div>

            {/* Name with dotted border */}
            <h1 class="text-3xl md:text-5xl font-bold pb-4 relative" style="color: var(--terminal-accent); border-bottom: 3px dotted var(--terminal-accent);">
                {name}
                <span
                    class="absolute bottom-[2px] left-0 w-full"
                    style="border-bottom: 3px dotted var(--terminal-accent);"
                />
            </h1>

            {/* Role */}
            <p class="text-xl" style="color: var(--terminal-fg-dim);">
                <span style="color: var(--terminal-accent);">&gt;</span> {role}
            </p>

            {/* Description */}
            <p class="text-lg max-w-2xl" style="color: var(--terminal-fg);">
                {description}
            </p>

            {/* Avatar */}
            <div class="flex items-start gap-8 flex-col md:flex-row">
                <div class="flex-shrink-0">
                    <img
                        src={avatar.startsWith('http') ? avatar : `/${avatar}`}
                        alt={name}
                        data-avatar="true"
                        class="w-40 h-40 md:w-52 md:h-52 object-cover"
                        style="border: 4px solid var(--terminal-accent);"
                    />
                </div>

                {/* Social links as terminal text */}
                <div class="space-y-2 text-sm">
                    <p style="color: var(--terminal-fg-dim);">
                        <span style="color: var(--terminal-accent);">$</span> ls ~/social
                    </p>
                    <ul class="space-y-1 pl-4">
                        {social?.github && (
                            <li>
                                <span style="color: var(--terminal-accent);">drwx</span>{' '}
                                <a href={social.github} target="_blank" rel="noopener noreferrer" class="no-underline" style="color: var(--terminal-fg);" onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg)'; }}>github/</a>
                            </li>
                        )}
                        {social?.twitter && (
                            <li>
                                <span style="color: var(--terminal-accent);">drwx</span>{' '}
                                <a href={social.twitter} target="_blank" rel="noopener noreferrer" class="no-underline" style="color: var(--terminal-fg);" onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg)'; }}>twitter/</a>
                            </li>
                        )}
                        {social?.email && (
                            <li>
                                <span style="color: var(--terminal-accent);">-rw-</span>{' '}
                                <a href={social.email} class="no-underline" style="color: var(--terminal-fg);" onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg)'; }}>email.txt</a>
                            </li>
                        )}
                        {social?.telegram && (
                            <li>
                                <span style="color: var(--terminal-accent);">drwx</span>{' '}
                                <a href={social.telegram} target="_blank" rel="noopener noreferrer" class="no-underline" style="color: var(--terminal-fg);" onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg)'; }}>telegram/</a>
                            </li>
                        )}
                        {social?.bilibili && (
                            <li>
                                <span style="color: var(--terminal-accent);">drwx</span>{' '}
                                <a href={social.bilibili} target="_blank" rel="noopener noreferrer" class="no-underline" style="color: var(--terminal-fg);" onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg)'; }}>bilibili/</a>
                            </li>
                        )}
                        {social?.netease && (
                            <li>
                                <span style="color: var(--terminal-accent);">drwx</span>{' '}
                                <a href={social.netease} target="_blank" rel="noopener noreferrer" class="no-underline" style="color: var(--terminal-fg);" onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg)'; }}>netease/</a>
                            </li>
                        )}
                        {social?.rss && (
                            <li>
                                <span style="color: var(--terminal-accent);">-rw-</span>{' '}
                                <a href="/rss.xml" target="_blank" rel="noopener noreferrer" class="no-underline" style="color: var(--terminal-fg);" onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg)'; }}>rss.xml</a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
