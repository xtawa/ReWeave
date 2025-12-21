import { h } from 'preact';

interface HomeProps {
    siteTitle: string;
    tagline?: string;
    description?: string;
    heroImage?: string;
    actions?: Array<{
        text: string;
        link: string;
        primary?: boolean;
    }>;
    features?: Array<{
        icon?: string;
        title: string;
        description: string;
    }>;
}

export function Home({ siteTitle, tagline, description, heroImage, actions, features }: HomeProps) {
    return (
        <html lang="zh-CN">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{siteTitle}</title>
                <link rel="stylesheet" href="/style.css" />
                <script dangerouslySetInnerHTML={{
                    __html: `
                    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                        document.documentElement.classList.add('dark')
                    } else {
                        document.documentElement.classList.remove('dark')
                    }
                `}} />
            </head>
            <body class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
                {/* Hero Section */}
                <div class="relative isolate px-6 pt-14 lg:px-8">
                    {/* Background gradient */}
                    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                        <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-500 to-purple-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
                    </div>

                    <div class="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
                        <div class="text-center">
                            {heroImage && (
                                <img src={heroImage} alt={siteTitle} class="mx-auto mb-8 h-32 w-32" />
                            )}
                            <h1 class="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {siteTitle}
                            </h1>
                            {tagline && (
                                <p class="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
                                    {tagline}
                                </p>
                            )}
                            {description && (
                                <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                                    {description}
                                </p>
                            )}
                            {actions && actions.length > 0 && (
                                <div class="mt-10 flex items-center justify-center gap-x-6">
                                    {actions.map((action, index) => (
                                        <a
                                            key={index}
                                            href={action.link}
                                            class={action.primary
                                                ? "rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
                                                : "rounded-lg px-6 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                            }
                                        >
                                            {action.text}
                                            {action.primary && (
                                                <span class="ml-2">→</span>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom gradient */}
                    <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
                        <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-500 to-blue-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
                    </div>
                </div>

                {/* Features Section */}
                {features && features.length > 0 && (
                    <div class="bg-gray-50 dark:bg-gray-800/50 py-24 sm:py-32">
                        <div class="mx-auto max-w-7xl px-6 lg:px-8">
                            <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                                {features.map((feature, index) => (
                                    <div key={index} class="flex flex-col items-start">
                                        {feature.icon && (
                                            <div class="rounded-lg bg-blue-600 p-2 text-white mb-4">
                                                <span class="text-2xl">{feature.icon}</span>
                                            </div>
                                        )}
                                        <h3 class="text-lg font-semibold leading-7 text-gray-900 dark:text-gray-100">
                                            {feature.title}
                                        </h3>
                                        <p class="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    <div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                        <p class="text-center text-sm leading-5 text-gray-500 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
