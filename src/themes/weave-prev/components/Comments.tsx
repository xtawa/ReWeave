/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/theme/weave-prev.config';

export function Comments({ path }: { path: string }) {
    if (!config.comments?.enabled) {
        return null;
    }

    const { type, serverURL, envId, gitalk } = config.comments;

    // Waline
    if (type === 'waline' && serverURL) {
        return (
            <div class="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-700">
                <div id="waline-comments"></div>
                <link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
                <script type="module" dangerouslySetInnerHTML={{
                    __html: `
                    import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';
                    init({
                        el: '#waline-comments',
                        serverURL: ${JSON.stringify(serverURL)},
                        path: ${JSON.stringify(path)},
                        lang: ${JSON.stringify(config.language)},
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
            <div class="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-700">
                <div id="tcomment"></div>
                <script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.36/dist/twikoo.all.min.js"></script>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    twikoo.init({
                        envId: ${JSON.stringify(envId)},
                        el: '#tcomment',
                        lang: ${JSON.stringify(config.language)},
                        path: ${JSON.stringify(path)},
                    });
                    `
                }} />
            </div>
        );
    }

    // Gitalk
    if (type === 'gitalk' && gitalk) {
        return (
            <div class="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-700">
                <div id="gitalk-container"></div>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css" />
                <script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    const gitalk = new Gitalk({
                        clientID: ${JSON.stringify(gitalk.clientID)},
                        clientSecret: ${JSON.stringify(gitalk.clientSecret)},
                        repo: ${JSON.stringify(gitalk.repo)},
                        owner: ${JSON.stringify(gitalk.owner)},
                        admin: ${JSON.stringify(gitalk.admin)},
                        id: ${JSON.stringify(path)},
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
