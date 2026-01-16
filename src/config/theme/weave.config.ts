import { reweaveConfig, ReweaveConfig } from '../reweave.config';
import { HeroConfig, heroConfig } from '../hero.config';

export interface ThemeConfig extends ReweaveConfig {
    /** 是否启用页面切换动画 */
    enablePageTransition?: boolean;
    /** 网站Logo配置 */
    logo?: {
        path: string;
        alt?: string;
    };
    /** 社交链接配置 */
    social?: {
        twitter?: string;
        github?: string;
    };
    /** 页脚配置 */
    footer?: {
        copyright?: string;
        icp?: string;
    };
    /** 主题外观配置 */
    theme: {
        primaryColor: string;
        contentWidth?: 'normal' | 'wide' | 'full';
    };
    /** 首页Hero区域配置 */
    hero?: HeroConfig;
    /** 导航栏配置 */
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
    /** 项目展示页配置 */
    projectsPage?: {
        showProjects?: boolean;
        showContributors?: boolean;
        showSponsors?: boolean;
        sponsorLink?: string;
    };
}

export const config: ThemeConfig = {
    ...reweaveConfig,
    // 是否启用页面切换动画
    enablePageTransition: false,

    // 网站Logo配置
    logo: {
        path: "logo.png",
        alt: "ReWeave Blog Logo",
    },

    // 社交链接配置
    social: {
        github: "https://github.com/xtawa/ReWeave",
    },

    // 页脚配置
    footer: {
        copyright: "ReWeave Labs by Ybhsoft Innovation",
        icp: "",
    },

    // 主题外观配置
    theme: {
        primaryColor: "#000000",
        contentWidth: 'normal',
    },

    // 首页Hero区域配置 (引用自 hero.config.ts)
    hero: heroConfig,

    // 导航栏配置
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

    // 项目展示页配置
    projectsPage: {
        showProjects: true,
        showContributors: true,
        showSponsors: false,
        sponsorLink: 'https://github.com/sponsors/yourusername',
    },
};
