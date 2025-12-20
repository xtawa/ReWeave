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
}

export const config: SiteConfig = {
    // Basic Info / 基本信息
    title: "ReWeave Blog",
    description: "A high-performance static blog built with ReWeave.",
    language: "en",

    // Theme Selection / 主题选择
    themeName: "weave",

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
};
