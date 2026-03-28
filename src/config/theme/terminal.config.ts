import { reweaveConfig, ReweaveConfig } from '../reweave.config';
import { HeroConfig, heroConfig } from '../hero.config';

export interface TerminalThemeConfig extends ReweaveConfig {
    logo?: {
        path: string;
        alt?: string;
    };
    navbar?: {
        items: Array<{
            key: string;
            href: string;
            label?: string;
        }>;
    };
    theme: {
        primaryColor: string;
        contentWidth?: 'normal' | 'wide' | 'full';
        background: string;
        text: string;
        mutedText: string;
        accent: string;
        border: string;
        panel: string;
        fontFamily: string;
    };
    hero?: HeroConfig & {
        promptPrefix?: string;
        subtitle?: string;
    };
}

export const config: TerminalThemeConfig = {
    ...reweaveConfig,
    logo: {
        path: 'logo.png',
        alt: 'ReWeave Terminal',
    },
    navbar: {
        items: [
            { key: 'home', href: '/' },
            { key: 'articles', href: '/articles' },
            { key: 'archive', href: '/archive' },
            { key: 'tags', href: '/tags' },
            { key: 'projects', href: '/projects' },
            { key: 'about', href: '/about' },
        ],
    },
    theme: {
        primaryColor: '#34d399',
        contentWidth: 'wide',
        background: 'bg-[#0b0f10]',
        text: 'text-zinc-200',
        mutedText: 'text-zinc-400',
        accent: 'text-emerald-400',
        border: 'border-emerald-500/40',
        panel: 'bg-black/40 border border-emerald-500/20 rounded-none',
        fontFamily: 'font-mono',
    },
    hero: {
        ...heroConfig,
        enabled: true,
        title: 'Terminal Theme / ReWeave',
        subtitle: '简洁、克制、专注阅读。',
        description: '使用复古终端风格构建内容站点：高对比、硬边框、键盘友好。',
        promptPrefix: '~/blog',
    },
};
