import { Locale } from './i18n';
import { HeroConfig, heroConfig } from './hero.config';

export interface SiteConfig {
    title: string;
    description: string;
    language: Locale;
    siteUrl: string;
    themeName: string;
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
    hero?: HeroConfig;
    homePage: 'hero' | 'posts';
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
    /**
     * Pagination configuration.
     * 分页配置。
     */
    pagination?: {
        /**
         * Posts per page.
         * 每页显示文章数。
         */
        pageSize: number;
    };
}

export const config: SiteConfig = {
    title: "ReWeave Blog",
    description: "A high-performance static blog built with ReWeave.",
    language: "zh",
    siteUrl: "https://demo.reweave.xtyin.com", // Change this to your actual domain

    // Theme Selection / 主题选择
    themeName: "weave",

    // Pagination / 分页配置
    pagination: {
        pageSize: 15,
    },

    // Navbar Configuration / 导航栏配置
    navbar: {
        items: [
            { key: 'home', href: '/' },
            { key: 'articles', href: '/articles.html' },
            {
                key: 'archive',
                href: '/archive.html',
                children: [
                    { key: 'categories', href: '/categories.html' },
                    { key: 'tags', href: '/tags.html' },
                ]
            },
            { key: 'projects', href: '/projects.html' },           
            { key: 'about', href: '/about.html' },
        ],
    },

    // Logo / 网站 Logo
    // Uncomment and configure to use a custom logo
    // 取消注释并配置以使用自定义 logo
    logo: {
        path: "logo.png",  // Place your logo in public/logo.png
        alt: "ReWeave Blog Logo",
    },

    // Social Links / 社交链接
    social: {
        github: "https://github.com/xtawa/ReWeave",
    },

    // Footer / 页脚
    footer: {
        copyright: "ReWeave Labs by Ybhsoft Innovation",
        icp: "",
    },

    // Visual Customization / 视觉自定义
    theme: {
        primaryColor: "#000000",
        contentWidth: 'wide', // 'normal', 'wide', 'full'
    },

    // Table of Contents / 目录
    toc: {
        enabled: true,
        maxDepth: 3,
        position: 'right',      // 'top' | 'left' | 'right'
        collapsible: true,
    },

    // About Page / 关于页面
    about: {
        title: "关于我",
        file: "about.md",
    },

    // Projects Page / 项目页面
    projects: {
        title: "项目",
        file: "projects.md",
    },

    // Hero Page / 个人名片页
    hero: heroConfig,

    // Default Home Page / 默认首页
    homePage: 'hero', // 'hero' or 'posts'
};
