import { reweaveConfig, ReweaveConfig } from './reweave.config';
import { HeroConfig, heroConfig } from '../core/hero.config';

export interface ThemeConfig extends ReweaveConfig {
    logo?: {
        path: string;
        alt?: string;
    };
    social?: {
        twitter?: string;
        github?: string;
    };
    footer?: {
        copyright?: string;
        icp?: string;
    };
    theme: {
        primaryColor: string;
        contentWidth?: 'normal' | 'wide' | 'full';
    };
    hero?: HeroConfig;
    navbar?: {
        items: Array<{
            key: string;
            href: string;
            label?: string;
            icon?: string;
            children?: Array<{
                key: string;
                href: string;
                label?: string;
            }>;
        }>;
    };
    projectsPage?: {
        showProjects?: boolean;
        showContributors?: boolean;
        showSponsors?: boolean;
        sponsorLink?: string;
    };
}

export const config: ThemeConfig = {
    ...reweaveConfig,
    logo: {
        path: "logo.png",
        alt: "ReWeave Blog Logo",
    },
    social: {
        github: "https://github.com/xtawa/ReWeave",
    },
    footer: {
        copyright: "ReWeave Labs by Ybhsoft Innovation",
        icp: "",
    },
    theme: {
        primaryColor: "#000000",
        contentWidth: 'normal',
    },
    hero: heroConfig,
    navbar: {
        items: [
            { key: 'home', href: '/' },
            { key: 'articles', href: '/articles' },
            {
                key: 'archive',
                href: '/archive',
                children: [
                    { key: 'categories', href: '/categories' },
                    { key: 'tags', href: '/tags' },
                ]
            },
            { key: 'projects', href: '/projects' },
            { key: 'about', href: '/about' },
        ],
    },
    projectsPage: {
        showProjects: true,
        showContributors: true,
        showSponsors: false,
        sponsorLink: 'https://github.com/sponsors/yourusername',
    },
};
