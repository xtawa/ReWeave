/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/theme/butterfly.config';

export function Comments({ path }: { path: string }) {
    if (!config.comments?.enabled) {
        return null;
    }

    const { type, serverURL, envId, gitalk } = config.comments;

    const containerClass = "mt-8 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md";

    // Waline
    if (type === 'waline' && serverURL) {
        return (
            <div class={containerClass}>
                <div class="flex items-center mb-4 text-xl font-bold text-gray-700 dark:text-gray-200">
                    <i class="fas fa-comments mr-2"></i> 评论
                </div>
                <div id="waline-comments"></div>
                <link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
                <script type="module" dangerouslySetInnerHTML={{
                    __html: `
                    import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';
                    init({
                        el: '#waline-comments',
                        serverURL: '${serverURL}',
                        path: '${path}',
                        lang: '${config.language}',
                        dark: 'html.dark',
                    });
                    `
                }} />
            </div>
        );
    }

    // Twikoo
    if (type === 'twikoo' && envId) {
        return (
            <div class={containerClass}>
                <div class="flex items-center mb-4 text-xl font-bold text-gray-700 dark:text-gray-200">
                    <i class="fas fa-comments mr-2"></i> 评论
                </div>
                <div id="tcomment"></div>
                <script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.36/dist/twikoo.all.min.js"></script>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    twikoo.init({
                        envId: '${envId}',
                        el: '#tcomment',
                        lang: '${config.language}',
                        path: '${path}',
                    });
                    `
                }} />
            </div>
        );
    }

    // Gitalk
    if (type === 'gitalk' && gitalk) {
        return (
            <div class={containerClass}>
                <div class="flex items-center mb-4 text-xl font-bold text-gray-700 dark:text-gray-200">
                    <i class="fas fa-comments mr-2"></i> 评论
                </div>
                <div id="gitalk-container"></div>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css" />
                <script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    const gitalk = new Gitalk({
                        clientID: '${gitalk.clientID}',
                        clientSecret: '${gitalk.clientSecret}',
                        repo: '${gitalk.repo}',
                        owner: '${gitalk.owner}',
                        admin: ${JSON.stringify(gitalk.admin)},
                        id: '${path}',
                        distractionFreeMode: false
                    });
                    gitalk.render('gitalk-container');
                    `
                }} />
            </div>
        );
    }

    return null;
}
