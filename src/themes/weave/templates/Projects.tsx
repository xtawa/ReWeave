/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Project, Contributor, Sponsor } from '../../../config/projects.config';
import { t } from '../../../core/i18n';
import { reweaveConfig } from '../../../config/reweave.config';

interface ProjectsProps {
    projects: Project[];
    contributors?: Contributor[];
    sponsors?: Sponsor[];
    sponsorLink?: string;
    title?: string;
}

export function Projects({ projects, contributors = [], sponsors = [], sponsorLink, title }: ProjectsProps) {
    const featuredProjects = projects.filter(p => p.featured);
    const otherProjects = projects.filter(p => !p.featured);

    // Sort sponsors by tier
    const tierOrder = { gold: 0, silver: 1, bronze: 2, supporter: 3 };
    const sortedSponsors = [...sponsors].sort((a, b) =>
        (tierOrder[a.tier || 'supporter'] || 3) - (tierOrder[b.tier || 'supporter'] || 3)
    );

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
                    <div className="mb-16">
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

                {/* Contributors Section */}
                {contributors.length > 0 && (
                    <div className="mb-16 pt-8 border-t border-zinc-200 dark:border-zinc-700">
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-6 flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                            </svg>
                            贡献者
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contributors.map((contributor, index) => (
                                <ContributorCard
                                    key={contributor.name}
                                    contributor={contributor}
                                    delay={0.45 + index * 0.05}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Sponsors Section */}
                {sortedSponsors.length > 0 && (
                    <div className="pt-8 border-t border-zinc-200 dark:border-zinc-700">
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-2 flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            捐赠者
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6 animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
                            感谢以下赞助者的慷慨支持，让项目能够持续发展。
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {sortedSponsors.map((sponsor, index) => (
                                <SponsorCard
                                    key={sponsor.name}
                                    sponsor={sponsor}
                                    delay={0.6 + index * 0.03}
                                />
                            ))}
                        </div>

                        {/* Become a Sponsor CTA */}
                        {sponsorLink && (
                            <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                                <a
                                    href={sponsorLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-full hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    成为赞助者
                                </a>
                            </div>
                        )}
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

interface ContributorCardProps {
    contributor: Contributor;
    delay: number;
}

function ContributorCard({ contributor, delay }: ContributorCardProps) {
    return (
        <div
            className="group relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in-up p-5"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {contributor.avatar ? (
                        <img
                            src={contributor.avatar}
                            alt={contributor.name}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-200 dark:ring-purple-800 group-hover:ring-purple-400 dark:group-hover:ring-purple-600 transition-all"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                            {contributor.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {contributor.name}
                        </h3>
                        {contributor.role && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full whitespace-nowrap">
                                {contributor.role}
                            </span>
                        )}
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                        {contributor.bio}
                    </p>

                    {/* Contributions */}
                    {contributor.contributions && contributor.contributions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {contributor.contributions.map((contribution) => (
                                <span
                                    key={contribution}
                                    className="px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400 rounded"
                                >
                                    {contribution}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-3">
                        {contributor.github && (
                            <a
                                href={contributor.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                title="GitHub"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                            </a>
                        )}
                        {contributor.website && (
                            <a
                                href={contributor.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                title="个人网站"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface SponsorCardProps {
    sponsor: Sponsor;
    delay: number;
}

function SponsorCard({ sponsor, delay }: SponsorCardProps) {
    const tierStyles = {
        gold: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-300 dark:border-yellow-700',
        silver: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-gray-300 dark:border-gray-600',
        bronze: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-300 dark:border-orange-700',
        supporter: 'bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700',
    };

    const tierBadgeStyles = {
        gold: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',
        silver: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
        bronze: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400',
        supporter: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-400',
    };

    const tierLabels = {
        gold: '金牌赞助',
        silver: '银牌赞助',
        bronze: '铜牌赞助',
        supporter: '支持者',
    };

    const tier = sponsor.tier || 'supporter';

    return (
        <div
            className={`group relative rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up p-4 ${tierStyles[tier]}`}
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="flex items-center gap-3">
                {/* Avatar */}
                {sponsor.avatar ? (
                    <img
                        src={sponsor.avatar}
                        alt={sponsor.name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {sponsor.name.charAt(0)}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        {sponsor.link ? (
                            <a
                                href={sponsor.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-zinc-900 dark:text-white truncate hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                            >
                                {sponsor.name}
                            </a>
                        ) : (
                            <span className="font-semibold text-zinc-900 dark:text-white truncate">
                                {sponsor.name}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${tierBadgeStyles[tier]}`}>
                            {tierLabels[tier]}
                        </span>
                        {sponsor.amount && (
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {sponsor.amount}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Message */}
            {sponsor.message && (
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 italic line-clamp-2">
                    "{sponsor.message}"
                </p>
            )}
        </div>
    );
}
