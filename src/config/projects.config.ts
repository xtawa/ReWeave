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
    {
        name: "Project Alpha",
        description: "一个创新的生产力 Web 应用程序，帮助团队更高效地协作。",
        techStack: ["React", "Node.js", "MongoDB"],
        link: "https://example.com/alpha",
        github: "https://github.com/yourusername/alpha",
        featured: true,
    },
    {
        name: "Project Beta",
        description: "面向开发者的开源命令行工具，简化日常开发流程。",
        techStack: ["JavaScript", "CLI", "Node.js"],
        github: "https://github.com/yourusername/beta",
    },
];

export const contributorsConfig: Contributor[] = [
    {
        name: "张三",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan",
        bio: "全栈开发者，热爱开源。专注于 Web 性能优化和用户体验设计，有 5 年前端开发经验。",
        role: "核心开发者",
        github: "https://github.com/zhangsan",
        website: "https://zhangsan.dev",
        contributions: ["核心架构", "主题系统", "性能优化"],
    },
    {
        name: "李四",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisi",
        bio: "UI/UX 设计师 & 前端开发者。擅长将复杂的交互转化为简洁优雅的用户界面。",
        role: "设计 & 前端",
        github: "https://github.com/lisi",
        contributions: ["UI 设计", "响应式布局", "暗色模式"],
    },
    {
        name: "王五",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu",
        bio: "后端工程师，DevOps 爱好者。致力于构建可靠、可扩展的基础设施。",
        role: "贡献者",
        github: "https://github.com/wangwu",
        contributions: ["构建优化", "CI/CD"],
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
