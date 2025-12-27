/**
 * Projects configuration
 * Define your projects, contributors, and sponsors here
 */

export interface Project {
    name: string;
    description: string;
    techStack: string[];
    link?: string;
    github?: string;
    image?: string;
    featured?: boolean;
}

export interface Contributor {
    name: string;
    avatar?: string;
    bio: string;
    role?: string;
    github?: string;
    website?: string;
    contributions?: string[];
}

export interface Sponsor {
    name: string;
    avatar?: string;
    amount?: string;
    tier?: 'gold' | 'silver' | 'bronze' | 'supporter';
    message?: string;
    link?: string;
    date?: string;
}

export const projectsConfig: Project[] = [
    {
        name: "ReWeave",
        description: "一个使用 Preact 和 TypeScript 构建的高性能静态博客框架。支持多主题、多语言和丰富的自定义选项。",
        techStack: ["TypeScript", "Preact", "SSG", "TailwindCSS"],
        link: "https://demo.reweave.xtyin.com",
        github: "https://github.com/yourusername/reweave",
        image: "/images/projects/reweave.png",
        featured: true,
    },
];

export const contributorsConfig: Contributor[] = [
    {
        name: "Xihao Zhang",
        avatar: "https://avatars.githubusercontent.com/u/95358259?v=4&size=64",
        bio: "Cherish every moment",
        role: "Core developer",
        github: "https://github.com/xtawa",
        website: "https://blog.xtyin.com",
        contributions: ["核心架构", "功能测试"],
    },
    {
        name: "Zichun Wei",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu",
        bio: "//I don't know:(",
        role: "Idea fly",
        //        github: "https://github.com/",
        contributions: ["灵感启发"],
    },
];

export const sponsorsConfig: Sponsor[] = [
    {
        name: "科技公司 A",
        avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=companya",
        amount: "¥1000/月",
        tier: "gold",
        message: "感谢 ReWeave 团队的出色工作！",
        link: "https://companya.com",
        date: "2025-01",
    },
    {
        name: "开发者 Bob",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        amount: "¥200",
        tier: "silver",
        message: "支持开源，加油！",
        date: "2025-02",
    },
    {
        name: "用户 Carol",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
        tier: "bronze",
        date: "2025-03",
    },
    {
        name: "匿名支持者",
        tier: "supporter",
        date: "2025-03",
    },
];
