/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/theme/terminal.config';
import { t } from '../../../core/i18n';

export function Footer() {
    return (
        <footer class="mt-20 py-10" style="border-top: 1px solid var(--terminal-border); opacity: 0.65;">
            <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <div class="flex flex-col items-center sm:items-start">
                    <p class="text-sm" style="color: var(--terminal-fg-dim);">
                        &copy; {new Date().getFullYear()} {config.footer?.copyright || config.title}. {t('allRightsReserved', config.language)}.
                    </p>
                    {config.footer?.icp && (
                        <p class="text-xs mt-1" style="color: var(--terminal-fg-dim);">
                            {config.footer.icp}
                        </p>
                    )}
                    <p class="text-xs mt-1" style="color: var(--terminal-fg-dim);">
                        {t('poweredBy', config.language)} <a href="https://github.com/xtawa/ReWeave" target="_blank" rel="noopener noreferrer" style="color: var(--terminal-accent);">ReWeave</a> {config.language === 'zh' ? '驱动' : ''} {(config as any).version && <span style="color: var(--terminal-fg-dim);"> &middot; {config.language === 'zh' ? '版本' : 'v'}{(config as any).version}</span>}
                    </p>
                </div>
                <div class="flex items-center gap-6">
                    <div class="flex gap-6 text-sm font-medium" style="color: var(--terminal-fg);">
                        <a href="/" class="transition no-underline" style="color: var(--terminal-fg-dim);" onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg-dim)'; }}>{t('home', config.language)}</a>
                        <a href="/stats/" class="transition no-underline" style="color: var(--terminal-fg-dim);" onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg-dim)'; }}>{t('stats', config.language)}</a>
                        {config.social?.twitter && (
                            <a href={config.social.twitter} class="transition no-underline" style="color: var(--terminal-fg-dim);" onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg-dim)'; }}>Twitter</a>
                        )}
                        {config.social?.github && (
                            <a href={config.social.github} class="transition no-underline" style="color: var(--terminal-fg-dim);" onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg-dim)'; }}>GitHub</a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
