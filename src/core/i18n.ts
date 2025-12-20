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
            about: string;
            projects: string;
            allRightsReserved: string;
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
            about: 'About',
            projects: 'Projects',
            allRightsReserved: 'All rights reserved',
        },
        zh: {
            readMore: '阅读文章',
            category: '分类',
            tag: '标签',
            allPosts: '所有文章',
            postsInCategory: '分类下的文章',
            postsWithTag: '标签下的文章',
            home: '首页',
            about: '关于',
            projects: '项目',
            allRightsReserved: '保留所有权利',
        },
    },
};

export function t(key: keyof I18nConfig['translations']['en'], locale: Locale = i18n.locale): string {
    return i18n.translations[locale][key];
}
