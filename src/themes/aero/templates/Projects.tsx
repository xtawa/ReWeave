/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Project, Contributor, Sponsor } from '../../../config/projects.config';

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

    const tierOrder = { gold: 0, silver: 1, bronze: 2, supporter: 3 };
    const sortedSponsors = [...sponsors].sort((a, b) =>
        (tierOrder[a.tier || 'supporter'] || 3) - (tierOrder[b.tier || 'supporter'] || 3)
    );

    return (
        <Layout title={title || "项目"}>
            <Header />
            <div class="flex flex-col md:flex-row gap-6">
                <main class="flex-1 w-full min-w-0">
                    {/* Header */}
                    <div class="glass-card mb-6">
                        <div class="glass-header">
                            <h1 class="text-2xl font-bold m-0">💻 {title || "项目"}</h1>
                        </div>
                        <div class="glass-content text-center">
                            <p class="text-slate-600">这里展示了我参与的一些项目。点击卡片可以了解更多详情。</p>
                        </div>
                    </div>

                    {/* Featured Projects */}
                    {featuredProjects.length > 0 && (
                        <div class="mb-8">
                            <h2 class="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                                ⭐ 精选项目
                            </h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {featuredProjects.map(project => (
                                    <ProjectCard key={project.name} project={project} featured={true} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other Projects */}
                    {otherProjects.length > 0 && (
                        <div class="mb-8">
                            <h2 class="text-xl font-bold text-slate-700 mb-4">其他项目</h2>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {otherProjects.map(project => (
                                    <ProjectCard key={project.name} project={project} featured={false} />
                                ))}
                            </div>
                        </div>
                    )}

                    {projects.length === 0 && (
                        <div class="glass-card p-8 text-center text-slate-500">
                            暂无项目
                        </div>
                    )}

                    {/* Contributors */}
                    {contributors.length > 0 && (
                        <div class="mb-8">
                            <h2 class="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                                👥 贡献者
                            </h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {contributors.map(contributor => (
                                    <ContributorCard key={contributor.name} contributor={contributor} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sponsors */}
                    {sortedSponsors.length > 0 && (
                        <div>
                            <h2 class="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                                ❤️ 捐赠者
                            </h2>
                            <p class="text-slate-600 mb-4">感谢以下赞助者的慷慨支持，让项目能够持续发展。</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {sortedSponsors.map(sponsor => (
                                    <SponsorCard key={sponsor.name} sponsor={sponsor} />
                                ))}
                            </div>
                            {sponsorLink && (
                                <div class="mt-6 text-center">
                                    <a href={sponsorLink} target="_blank" class="aero-btn px-6 py-2">
                                        ❤️ 成为赞助者
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </main>
                <div class="w-full md:w-80 shrink-0">
                    <Sidebar />
                </div>
            </div>
        </Layout>
    );
}

interface ProjectCardProps {
    project: Project;
    featured: boolean;
}

function ProjectCard({ project, featured }: ProjectCardProps) {
    return (
        <div class={`glass-card overflow-hidden hover:scale-102 transition-transform ${featured ? 'min-h-[200px]' : 'min-h-[160px]'}`}>
            <div class="p-4 h-full flex flex-col">
                {/* Header */}
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg glass-panel flex items-center justify-center overflow-hidden">
                            {project.image ? (
                                <img src={project.image} alt={project.name} class="w-full h-full object-cover" />
                            ) : (
                                <span class="text-lg font-bold text-blue-600">{project.name.charAt(0)}</span>
                            )}
                        </div>
                        <h3 class="text-lg font-bold text-slate-800">{project.name}</h3>
                    </div>
                    {project.featured && (
                        <span class="tag text-xs">精选</span>
                    )}
                </div>

                {/* Description */}
                <p class={`text-slate-600 text-sm mb-3 flex-grow ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
                    {project.description}
                </p>

                {/* Tech Stack */}
                <div class="flex flex-wrap gap-1 mb-3">
                    {project.techStack.slice(0, 4).map(tech => (
                        <span key={tech} class="tag text-xs">{tech}</span>
                    ))}
                </div>

                {/* Links */}
                <div class="flex items-center gap-4 pt-3 border-t border-white/30">
                    {project.link && (
                        <a href={project.link} target="_blank" class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            🔗 访问网站
                        </a>
                    )}
                    {project.github && (
                        <a href={project.github} target="_blank" class="text-sm text-slate-600 hover:text-slate-800 flex items-center gap-1">
                            🐙 GitHub
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

interface ContributorCardProps {
    contributor: Contributor;
}

function ContributorCard({ contributor }: ContributorCardProps) {
    return (
        <div class="glass-card p-4 hover:scale-102 transition-transform">
            <div class="flex items-start gap-3">
                {contributor.avatar ? (
                    <img src={contributor.avatar} alt={contributor.name} class="w-12 h-12 rounded-full object-cover border-2 border-white/50" />
                ) : (
                    <div class="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-purple-600 font-bold">
                        {contributor.name.charAt(0)}
                    </div>
                )}
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                        <h3 class="font-bold text-slate-800 truncate">{contributor.name}</h3>
                        {contributor.role && <span class="tag text-xs">{contributor.role}</span>}
                    </div>
                    <p class="text-sm text-slate-600 mt-1 line-clamp-2">{contributor.bio}</p>
                    <div class="flex gap-2 mt-2">
                        {contributor.github && (
                            <a href={contributor.github} target="_blank" class="text-slate-500 hover:text-slate-700 text-sm">🐙</a>
                        )}
                        {contributor.website && (
                            <a href={contributor.website} target="_blank" class="text-slate-500 hover:text-slate-700 text-sm">🌐</a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface SponsorCardProps {
    sponsor: Sponsor;
}

function SponsorCard({ sponsor }: SponsorCardProps) {
    const tierLabels = { gold: '金牌', silver: '银牌', bronze: '铜牌', supporter: '支持者' };
    const tier = sponsor.tier || 'supporter';

    return (
        <div class="glass-card p-3 hover:scale-102 transition-transform">
            <div class="flex items-center gap-3">
                {sponsor.avatar ? (
                    <img src={sponsor.avatar} alt={sponsor.name} class="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div class="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-pink-600 font-bold text-sm">
                        {sponsor.name.charAt(0)}
                    </div>
                )}
                <div class="flex-1 min-w-0">
                    {sponsor.link ? (
                        <a href={sponsor.link} target="_blank" class="font-semibold text-slate-800 truncate block hover:text-pink-600">
                            {sponsor.name}
                        </a>
                    ) : (
                        <span class="font-semibold text-slate-800 truncate block">{sponsor.name}</span>
                    )}
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="tag text-xs">{tierLabels[tier]}</span>
                        {sponsor.amount && <span class="text-xs text-slate-500">{sponsor.amount}</span>}
                    </div>
                </div>
            </div>
            {sponsor.message && (
                <p class="mt-2 text-xs text-slate-600 italic line-clamp-2">"{sponsor.message}"</p>
            )}
        </div>
    );
}
