/**
 * Projects configuration
 * Define your projects here with structured data for card display
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
