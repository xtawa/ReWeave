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
    const visibleContributors = contributors.filter(c => !c.hidden);
    const featuredProjects = projects.filter(p => p.featured);
    const otherProjects = projects.filter(p => !p.featured);

    const tierOrder = { gold: 0, silver: 1, bronze: 2, supporter: 3 };
    const sortedSponsors = [...sponsors].sort((a, b) =>
        (tierOrder[a.tier || 'supporter'] || 3) - (tierOrder[b.tier || 'supporter'] || 3)
    );

    return (
        <Layout title={title || t('projects', reweaveConfig.language)} contentWidth="normal" url="/projects">
            <Header />
            <main class="py-8">
                <div class="mb-10">
                    <h1 class="text-2xl font-bold mb-4" style="color: var(--terminal-accent); border-bottom: 3px dotted var(--terminal-accent); padding-bottom: 15px;">
                        {title || t('projects', reweaveConfig.language)}
                    </h1>
                    <p style="color: var(--terminal-fg-dim);">
                        <span style="color: var(--terminal-accent);">$</span> ls ~/projects
                    </p>
                </div>

                {/* Featured Projects */}
                {featuredProjects.length > 0 && (
                    <div class="mb-12">
                        <h2 class="text-xl font-bold mb-6" style="color: var(--terminal-accent);">
                            <span style="color: var(--terminal-fg-dim);">drwx</span> featured/
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {featuredProjects.map((project) => (
                                <ProjectCard key={project.name} project={project} featured={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Other Projects */}
                {otherProjects.length > 0 && (
                    <div class="mb-16">
                        <h2 class="text-xl font-bold mb-6" style="color: var(--terminal-accent);">
                            <span style="color: var(--terminal-fg-dim);">drwx</span> other/
                        </h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherProjects.map((project) => (
                                <ProjectCard key={project.name} project={project} featured={false} />
                            ))}
                        </div>
                    </div>
                )}

                {projects.length === 0 && (
                    <div class="text-center py-20" style="color: var(--terminal-fg-dim);">
                        <span style="color: var(--terminal-accent);">$</span> echo "No projects found"
                    </div>
                )}

                {/* Contributors Section */}
                {visibleContributors.length > 0 && (
                    <div class="mb-16 pt-8" style="border-top: 1px solid var(--terminal-border);">
                        <h2 class="text-xl font-bold mb-6" style="color: var(--terminal-accent);">
                            <span style="color: var(--terminal-fg-dim);">drwx</span> contributors/
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {visibleContributors.map((contributor) => (
                                <ContributorCard key={contributor.name} contributor={contributor} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Sponsors Section */}
                {sortedSponsors.length > 0 && (
                    <div class="pt-8" style="border-top: 1px solid var(--terminal-border);">
                        <h2 class="text-xl font-bold mb-2" style="color: var(--terminal-accent);">
                            <span style="color: var(--terminal-fg-dim);">drwx</span> sponsors/
                        </h2>
                        <p class="mb-6" style="color: var(--terminal-fg-dim);">
                            感谢以下赞助者的慷慨支持。
                        </p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {sortedSponsors.map((sponsor) => (
                                <SponsorCard key={sponsor.name} sponsor={sponsor} />
                            ))}
                        </div>

                        {sponsorLink && (
                            <div class="mt-8">
                                <a
                                    href={sponsorLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 px-6 py-3 font-medium no-underline transition"
                                    style="background: var(--terminal-accent); color: var(--terminal-bg);"
                                >
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

function ProjectCard({ project, featured }: { project: Project; featured: boolean }) {
    return (
        <div
            class="group relative p-5 transition"
            style="border: 1px solid var(--terminal-border);"
            onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = 'var(--terminal-accent)'; }}
            onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = 'var(--terminal-border)'; }}
        >
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 flex items-center justify-center font-bold text-lg" style="background: var(--terminal-accent); color: var(--terminal-bg);">
                        {project.image ? (
                            <img src={project.image} alt={project.name} class="w-full h-full object-cover" data-project-icon={project.image} />
                        ) : (
                            project.name.charAt(0)
                        )}
                    </div>
                    <h3 class="text-lg font-bold" style="color: var(--terminal-accent);">
                        {project.name}
                    </h3>
                </div>
                {featured && (
                    <span class="px-2 py-1 text-xs font-medium" style="background: var(--terminal-accent); color: var(--terminal-bg);">
                        Featured
                    </span>
                )}
            </div>

            <p class="mb-4 text-sm" style="color: var(--terminal-fg-dim);">
                {project.description}
            </p>

            <div class="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                    <span
                        key={tech}
                        class="px-2 py-1 text-xs font-medium"
                        style="color: var(--terminal-fg-dim); border: 1px solid var(--terminal-border);"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            <div class="flex items-center gap-4 pt-4" style="border-top: 1px solid var(--terminal-border);">
                {project.link && (
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-sm font-medium no-underline transition"
                        style="color: var(--terminal-accent);"
                    >
                        访问网站 &rarr;
                    </a>
                )}
                {project.github && (
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-sm font-medium no-underline transition"
                        style="color: var(--terminal-fg-dim);"
                        onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }}
                        onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg-dim)'; }}
                    >
                        GitHub
                    </a>
                )}
            </div>
        </div>
    );
}

function ContributorCard({ contributor }: { contributor: Contributor }) {
    return (
        <div
            class="group relative p-5 transition"
            style="border: 1px solid var(--terminal-border);"
            onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = 'var(--terminal-accent)'; }}
            onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = 'var(--terminal-border)'; }}
        >
            <div class="flex items-start gap-4">
                <div class="flex-shrink-0">
                    {contributor.avatar ? (
                        <img
                            src={contributor.avatar}
                            alt={contributor.name}
                            class="w-14 h-14 object-cover"
                            style="border: 2px solid var(--terminal-accent);"
                        />
                    ) : (
                        <div class="w-14 h-14 flex items-center justify-center font-bold text-xl" style="background: var(--terminal-accent); color: var(--terminal-bg);">
                            {contributor.name.charAt(0)}
                        </div>
                    )}
                </div>

                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 class="text-lg font-bold truncate" style="color: var(--terminal-accent);">
                            {contributor.name}
                        </h3>
                        {contributor.role && (
                            <span class="px-2 py-0.5 text-xs font-medium" style="color: var(--terminal-accent); border: 1px solid var(--terminal-border);">
                                {contributor.role}
                            </span>
                        )}
                    </div>

                    <p class="text-sm mb-3 line-clamp-2" style="color: var(--terminal-fg-dim);">
                        {contributor.bio}
                    </p>

                    <div class="flex items-center gap-3">
                        {contributor.github && (
                            <a
                                href={contributor.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="transition no-underline"
                                style="color: var(--terminal-fg-dim);"
                                onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }}
                                onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg-dim)'; }}
                                title="GitHub"
                            >
                                GitHub
                            </a>
                        )}
                        {contributor.website && (
                            <a
                                href={contributor.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="transition no-underline"
                                style="color: var(--terminal-fg-dim);"
                                onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }}
                                onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg-dim)'; }}
                                title="个人网站"
                            >
                                Website
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
    const tier = sponsor.tier || 'supporter';

    return (
        <div
            class="group relative p-4 transition"
            style="border: 1px solid var(--terminal-border);"
            onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = 'var(--terminal-accent)'; }}
            onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = 'var(--terminal-border)'; }}
        >
            <div class="flex items-center gap-3">
                {sponsor.avatar ? (
                    <img
                        src={sponsor.avatar}
                        alt={sponsor.name}
                        class="w-10 h-10 object-cover"
                    />
                ) : (
                    <div class="w-10 h-10 flex items-center justify-center font-bold text-sm" style="background: var(--terminal-accent); color: var(--terminal-bg);">
                        {sponsor.name.charAt(0)}
                    </div>
                )}

                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                        {sponsor.link ? (
                            <a
                                href={sponsor.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="font-semibold truncate no-underline transition"
                                style="color: var(--terminal-fg);"
                                onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--terminal-accent)'; }}
                                onMouseLeave={(e: any) => { e.currentTarget.style.color = 'var(--terminal-fg)'; }}
                            >
                                {sponsor.name}
                            </a>
                        ) : (
                            <span class="font-semibold truncate" style="color: var(--terminal-fg);">
                                {sponsor.name}
                            </span>
                        )}
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs font-medium px-1.5 py-0.5" style="color: var(--terminal-accent); border: 1px solid var(--terminal-border);">
                            {tier}
                        </span>
                        {sponsor.amount && (
                            <span class="text-xs" style="color: var(--terminal-fg-dim);">
                                {sponsor.amount}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {sponsor.message && (
                <p class="mt-3 text-sm italic line-clamp-2" style="color: var(--terminal-fg-dim);">
                    "{sponsor.message}"
                </p>
            )}
        </div>
    );
}
