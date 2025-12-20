/** @jsx h */
import { h } from 'preact';
import { config } from '../config';

export function Hero() {
    if (!config.hero || !config.hero.enabled) return null;

    const { name, role, description, avatar, social } = config.hero;

    return (
        <div class="min-h-[60vh] flex flex-col justify-center items-center md:flex-row md:justify-between gap-12 px-4 py-12">
            {/* Text Content */}
            <div class="flex-1 max-w-2xl space-y-8">
                <h1 class="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    Hi, I'm <span class="text-zinc-900 dark:text-zinc-100">{name}</span> <span class="animate-wave inline-block origin-[70%_70%]">👋</span>。
                </h1>
                <h2 class="text-3xl md:text-5xl font-medium text-zinc-800 dark:text-zinc-200">
                    A {role} <span class="font-mono text-zinc-500 dark:text-zinc-400">&lt;Developer /&gt;</span>
                </h2>
                <p class="text-xl text-zinc-600 dark:text-zinc-400 max-w-lg">
                    {description}
                </p>

                {/* Social Icons */}
                <div class="flex flex-wrap gap-4 pt-4">
                    {social?.bilibili && (
                        <a href={social.bilibili} target="_blank" rel="noopener noreferrer" class="p-3 bg-[#00A1D6] text-white rounded-full hover:opacity-90 transition shadow-lg shadow-[#00A1D6]/20">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267c.053-.071.115-.142.187-.213l3.466-3.307c.267-.249.573-.373.92-.373.347 0 .653.124.92.373l.027.027c.249.249.373.551.373.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.746 0 1.333.587 1.333 1.333s-.587 1.333-1.333 1.333-1.333-.587-1.333-1.333.587-1.333 1.333-1.333zm8 0c.746 0 1.333.587 1.333 1.333s-.587 1.333-1.333 1.333-1.333-.587-1.333-1.333.587-1.333 1.333-1.333z" /></svg>
                        </a>
                    )}
                    {social?.netease && (
                        <a href={social.netease} target="_blank" rel="noopener noreferrer" class="p-3 bg-[#C20C0C] text-white rounded-full hover:opacity-90 transition shadow-lg shadow-[#C20C0C]/20">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 17.5c-3.038 0-5.5-2.462-5.5-5.5S8.962 6.5 12 6.5s5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5zm0-9c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5 3.5-1.567 3.5-3.5-1.567-3.5-3.5-3.5z" /></svg>
                        </a>
                    )}
                    {social?.github && (
                        <a href={social.github} target="_blank" rel="noopener noreferrer" class="p-3 bg-[#181717] text-white rounded-full hover:opacity-90 transition shadow-lg shadow-[#181717]/20">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                        </a>
                    )}
                    {social?.email && (
                        <a href={social.email} class="p-3 bg-[#EA4335] text-white rounded-full hover:opacity-90 transition shadow-lg shadow-[#EA4335]/20">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                        </a>
                    )}
                    {social?.rss && (
                        <a href="/rss.xml" target="_blank" rel="noopener noreferrer" class="p-3 bg-[#FFA500] text-white rounded-full hover:opacity-90 transition shadow-lg shadow-[#FFA500]/20">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" /></svg>
                        </a>
                    )}
                    {social?.telegram && (
                        <a href={social.telegram} target="_blank" rel="noopener noreferrer" class="p-3 bg-[#26A5E4] text-white rounded-full hover:opacity-90 transition shadow-lg shadow-[#26A5E4]/20">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                        </a>
                    )}
                    {social?.twitter && (
                        <a href={social.twitter} target="_blank" rel="noopener noreferrer" class="p-3 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition shadow-lg shadow-[#1DA1F2]/20">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                        </a>
                    )}
                </div>
            </div>

            {/* Avatar */}
            <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full opacity-25 group-hover:opacity-50 blur transition duration-1000 group-hover:duration-200"></div>
                <img
                    src={avatar.startsWith('http') ? avatar : `/${avatar}`}
                    alt={name}
                    class="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-2xl transition transform group-hover:scale-105 duration-500"
                />
            </div>
        </div>
    );
}
