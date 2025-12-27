/**
 * Hero Page Configuration
 * 个人名片页配置
 */

export interface HeroConfig {
    enabled: boolean;
    name: string;
    greeting?: string;
    role: string;
    description: string;
    avatar: string; // Path to avatar image (relative to public/ or absolute URL)
    social: {
        github?: string;
        twitter?: string;
        email?: string;
        bilibili?: string;
        netease?: string;
        telegram?: string;
        rss?: boolean;
    };
    showDeveloperTag?: boolean;
}

export const heroConfig: HeroConfig = {
    enabled: true,
    name: "ReWeave",
    greeting: "Hi,",
    role: "Powered By ReWeave Labs",
    description: "A Next-generation blogging framework",
    avatar: "avatar.png", // Hero avatar image
    social: {
        github: "https://github.com/xtawa",
        twitter: "https://twitter.com/Coisini_Luo",
        email: "mailto:zeromostia@gmail.com",
        //        bilibili: "https://space.bilibili.com/26578164",
        //        netease: "https://music.163.com/#/user/home?id=63035382",
        telegram: "https://t.me/Yanluokeke",
        rss: true,
    },
    showDeveloperTag: false,
};
