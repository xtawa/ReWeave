import { Locale } from '../core/i18n';
import { HeroConfig, heroConfig } from './hero.config';

export interface ReweaveConfig {
    title: string;
    description: string;
    language: Locale;
    siteUrl: string;
    themeName: string;
    version?: string;
    homePage: 'hero' | 'posts';
    hero?: HeroConfig;
    pagination?: {
        pageSize: number;
    };
    comments?: {
        enabled: boolean;
        type: 'waline' | 'twikoo' | 'gitalk';
        serverURL?: string;
        envId?: string;
        gitalk?: {
            clientID: string;
            clientSecret: string;
            repo: string;
            owner: string;
            admin: string[];
        };
    };
    toc?: {
        enabled: boolean;
        maxDepth?: number;
        position?: 'top' | 'left' | 'right';
        collapsible?: boolean;
    };
    about?: {
        title?: string;
        file: string;
    };
    projects?: {
        title?: string;
        file: string;
    };
    themeTransition?: 'default' | 'circle-clip';
}

export const reweaveConfig: ReweaveConfig = {
    title: "ReWeave Blog",
    description: "A high-performance static blog built with ReWeave.",
    language: "zh",
    siteUrl: "https://demo.reweave.xtyin.com",
    themeName: "weave",
    homePage: "hero",
    hero: heroConfig,
    pagination: {
        pageSize: 15,
    },
    comments: {
        enabled: true,
        type: 'waline',
        serverURL: 'https://waline.xtyin.com',
    },
    toc: {
        enabled: true,
        maxDepth: 3,
        position: 'right',
        collapsible: true,
    },
    about: {
        title: "关于我",
        file: "about.md",
    },
    projects: {
        title: "项目",
        file: "projects.md",
    },
    themeTransition: 'circle-clip',
};
