/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/weave.config';

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
            <div class="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-700">
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
            <div class="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-700">
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
