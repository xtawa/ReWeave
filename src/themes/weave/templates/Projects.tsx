/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Project } from '../../../config/projects.config';
import { t } from '../../../core/i18n';
import { reweaveConfig } from '../../../config/reweave.config';

interface ProjectsProps {
    projects: Project[];
    title?: string;
}

export function Projects({ projects, title }: ProjectsProps) {
    const featuredProjects = projects.filter(p => p.featured);
    const otherProjects = projects.filter(p => !p.featured);

    return (
        <Layout title={title || t('projects', reweaveConfig.language)} contentWidth="normal">
            <Header />
            <main className="py-8">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4 animate-fade-in-up">
                        {title || t('projects', reweaveConfig.language)}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        这里展示了我参与的一些项目。点击卡片可以了解更多详情。
                    </p>
                </div>

                {/* Featured Projects */}
                {featuredProjects.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-6 flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                            精选项目
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {featuredProjects.map((project, index) => (
                                <ProjectCard
                                    key={project.name}
                                    project={project}
                                    featured={true}
                                    delay={0.2 + index * 0.05}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Other Projects */}
                {otherProjects.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            其他项目
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherProjects.map((project, index) => (
                                <ProjectCard
                                    key={project.name}
                                    project={project}
                                    featured={false}
                                    delay={0.35 + index * 0.05}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {projects.length === 0 && (
                    <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
                        暂无项目
                    </div>
                )}
            </main>
        </Layout>
    );
}

interface ProjectCardProps {
    project: Project;
    featured: boolean;
    delay: number;
}

function ProjectCard({ project, featured, delay }: ProjectCardProps) {
    return (
        <div
            className={`group relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up ${featured ? 'min-h-[280px]' : 'min-h-[220px]'}`}
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Image or Gradient Background */}
            {project.image ? (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ backgroundImage: `url(${project.image})` }}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}

            {/* Content */}
            <div className="relative p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {project.name.charAt(0)}
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {project.name}
                        </h3>
                    </div>
                    {project.featured && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                            Featured
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className={`text-zinc-600 dark:text-zinc-400 mb-4 flex-grow ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
                    {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech) => (
                        <span
                            key={tech}
                            className="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-transform hover:scale-105"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            访问网站
                        </a>
                    )}
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                            GitHub
                        </a>
                    )}
                </div>
            </div>

            {/* Hover border effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-teal-500/0 group-hover:border-teal-500/50 transition-colors pointer-events-none" />
        </div>
    );
}
