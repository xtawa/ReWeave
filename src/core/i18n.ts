export type Locale = 'en' | 'zh';

export interface I18nConfig {
    locale: Locale;
    translations: {
        [key in Locale]: {
            readMore: string;
            category: string;
            tag: string;
            allPosts: string;
            postsInCategory: string;
            postsWithTag: string;
            home: string;
            articles: string;
            about: string;
            projects: string;
            archive: string;
            categories: string;
            tags: string;
            allRightsReserved: string;
            toc: string;
            stats: string;
            totalPosts: string;
            totalWords: string;
            topTags: string;
            timeline: string;
            poweredBy: string;
        };
    };
}

export const i18n: I18nConfig = {
    locale: 'en',
    translations: {
        en: {
            readMore: 'Read article',
            category: 'Category',
            tag: 'Tag',
            allPosts: 'All Posts',
            postsInCategory: 'Posts in',
            postsWithTag: 'Posts tagged with',
            home: 'Home',
            articles: 'Articles',
            about: 'About',
            projects: 'Projects',
            archive: 'Archive',
            categories: 'Categories',
            tags: 'Tags',
            allRightsReserved: 'All rights reserved',
            toc: 'Table of Contents',
            stats: 'Stats',
            totalPosts: 'Total Posts',
            totalWords: 'Total Words',
            topTags: 'Top Tags',
            timeline: 'Timeline',
            poweredBy: 'Powered by',
        },
        zh: {
            readMore: '阅读文章',
            category: '分类',
            tag: '标签',
            allPosts: '所有文章',
            postsInCategory: '分类下的文章',
            postsWithTag: '标签下的文章',
            home: '首页',
            articles: '文章',
            about: '关于',
            projects: '项目',
            archive: '归档',
            categories: '分类',
            tags: '标签',
            allRightsReserved: '保留所有权利',
            toc: '目录',
            stats: '统计',
            totalPosts: '总文章数',
            totalWords: '总字数',
            topTags: '热门标签',
            timeline: '时间轴',
            poweredBy: '由',
        },
    },
};

export function t(key: keyof I18nConfig['translations']['en'], locale: Locale = i18n.locale): string {
    return i18n.translations[locale][key];
}
