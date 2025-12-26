/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/butterfly.config';
import { t } from '../../../core/i18n';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer class="relative mt-12 bg-white dark:bg-[#121212] pt-10 pb-6 text-center text-sm text-gray-500 dark:text-gray-400 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-none">
            <div class="space-y-2">
                <p>
                    &copy; {currentYear} {config.footer?.copyright || config.title}
                </p>
                <p>
                    {t('poweredBy', config.language)} <a href="https://github.com/xtawa/ReWeave" target="_blank" rel="noopener noreferrer" class="font-medium hover:text-blue-500 transition-colors">ReWeave</a>
                    <span class="mx-2">|</span>
                    Theme <a href="#" class="font-medium hover:text-blue-500 transition-colors">Butterfly</a>
                </p>
                {config.footer?.icp && (
                    <p>
                        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="hover:text-blue-500 transition-colors">
                            {config.footer.icp}
                        </a>
                    </p>
                )}
            </div>
            <div class="mt-4">
                <i class="fas fa-heart text-red-500 animate-pulse"></i>
            </div>
        </footer>
    );
}
