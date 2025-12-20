/**
 * ReWeave Blog Configuration
 * ReWeave 博客配置
 */

import { Locale } from './i18n';

export interface SiteConfig {
    /**
     * The title of your blog.
     * 博客标题。
     */
    title: string;

    /**
     * A short description of your blog (used for SEO).
     * 博客简短描述（用于 SEO）。
     */
    description: string;

    /**
     * The language of your content (e.g., 'en', 'zh').
     * 内容语言（例如 'en', 'zh'）。
     */
    language: Locale;

    /**
     * The name of the theme folder in src/themes/.
     * src/themes/ 下的主题文件夹名称。
     */
    themeName: string;

    /**
     * Logo configuration.
     * Logo 配置。
     */
    logo?: {
        /**
         * Path to logo file (relative to public/ directory or absolute URL).
         * Logo 文件路径（相对于 public/ 目录或绝对 URL）。
         * Example: "logo.png" or "https://example.com/logo.png"
         */
        path: string;
        /**
         * Alt text for the logo.
         * Logo 的替代文本。
         */
        alt?: string;
    };

    /**
     * Social links to display in the footer/header.
     * 显示在页脚/页眉的社交链接。
     */
    social?: {
        twitter?: string;
        github?: string;
    };

    /**
     * Footer configuration.
     * 页脚配置。
     */
    footer?: {
        /**
         * Copyright text.
         * 版权文字。
         */
        copyright?: string;

        /**
         * ICP license number (for China).
         * ICP 备案号（中国）。
         */
        icp?: string;
    };

    /**
     * Theme customization options.
     * 主题自定义选项。
     */
    theme: {
        /**
         * Primary brand color (hex code).
         * 主品牌色（十六进制代码）。
         */
        primaryColor: string;
    };

    /**
     * About page content.
     * 关于页面内容。
     */
    about?: {
        /**
         * Page title.
         * 页面标题。
         */
        title?: string;
        /**
         * Path to Markdown file (relative to src/pages/).
         * Markdown 文件路径（相对于 src/pages/）。
         */
        file: string;
    };

    /**
     * Projects page content.
     * 项目页面内容。
     */
    projects?: {
        /**
         * Page title.
         * 页面标题。
         */
        title?: string;
        /**
         * Path to Markdown file (relative to src/pages/).
         * Markdown 文件路径（相对于 src/pages/）。
         */
        file: string;
    };
}

export const config: SiteConfig = {
    // Basic Info / 基本信息
    title: "ReWeave Blog",
    description: "A high-performance static blog built with ReWeave.",
    language: "zh",

    // Theme Selection / 主题选择
    themeName: "weave",

    // Logo / 网站 Logo
    // Uncomment and configure to use a custom logo
    // 取消注释并配置以使用自定义 logo
    logo: {
        path: "logo.png",  // Place your logo in public/logo.png
        alt: "ReWeave Blog Logo",
    },

    // Social Links / 社交链接
    social: {
        twitter: "https://twitter.com",
        github: "https://github.com",
    },

    // Footer / 页脚
    footer: {
        copyright: "ReWeave Labs by Ybhsoft Innovation",
        icp: "",
    },

    // Visual Customization / 视觉自定义
    theme: {
        primaryColor: "#000000",
    },

    // About Page / 关于页面
    about: {
        title: "关于我",
        file: "about.md",
    },

    // Projects Page / 项目页面
    projects: {
        title: "我的项目",
        file: "projects.md",
    },
};
