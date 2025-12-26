/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/landing.config';

import { Post } from '../../../core/markdown';

function safeSlug(str: string): string {
    if (/^[a-zA-Z0-9-_]+$/.test(str)) {
        return str;
    }
    return Buffer.from(str).toString('hex');
}

interface HeroProps {
    posts?: Post[];
}

export function Hero({ posts }: HeroProps) {
    return (
        <div>
            <section class="relative min-h-screen flex items-center justify-center">
                {config.hero.image && (
                    <div class="absolute inset-0 z-0">
                        <img
                            src={config.hero.image}
                            alt="Hero Background"
                            class="w-full h-full object-cover opacity-30 dark:opacity-40"
                        />
                        <div class="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white dark:from-zinc-900/90 dark:via-zinc-900/70 dark:to-zinc-900"></div>
                    </div>
                )}
                <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 class="text-4xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent pb-2">
                        {config.hero.title}
                    </h1>
                    <p class="text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
                        {config.hero.subtitle}
                    </p>
                    <div class="flex justify-center gap-4">
                        <a href={config.hero.ctaLink} class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all hover:scale-105">
                            {config.hero.ctaText}
                        </a>
                        <a href="#" class="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-8 py-3 rounded-xl font-medium transition-all">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section class="py-20 bg-zinc-50 dark:bg-zinc-800/50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid md:grid-cols-3 gap-8">
                        {config.features.map((feature, index) => (
                            <div key={index} class="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-zinc-200 dark:border-zinc-800">
                                <h3 class="text-xl font-bold mb-4">{feature.title}</h3>
                                <p class="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest News Section */}
            {posts && posts.length > 0 && (
                <section class="py-20 bg-white dark:bg-zinc-900">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 class="text-3xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-100">Latest News</h2>
                        <div class="grid md:grid-cols-3 gap-8">
                            {posts.map(post => {
                                const postUrl = safeSlug(post.abbrlink || post.slug);
                                return (
                                    <article key={post.slug} class="flex flex-col items-start p-6 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <time class="text-sm text-zinc-500 mb-2">{new Date(post.date).toLocaleDateString()}</time>
                                        <h3 class="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                                            <a href={`/posts/${postUrl}`} class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                {post.title}
                                            </a>
                                        </h3>
                                        <p class="text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4">{post.excerpt}</p>
                                        <a href={`/posts/${postUrl}`} class="text-blue-600 dark:text-blue-400 font-medium hover:underline mt-auto">
                                            Read more &rarr;
                                        </a>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
