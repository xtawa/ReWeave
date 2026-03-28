/** @jsx h */
import { h } from 'preact';
import { config } from '../../../config/theme/terminal.config';

export function Comments({ path }: { path: string }) {
    if (!config.comments?.enabled) {
        return (
            <section class="mt-10 bg-black/40 border border-emerald-500/20 rounded-none p-4 text-zinc-400">
                <h3 class="text-zinc-200 mb-2"><span class="text-emerald-400">&gt;</span> comments</h3>
                <p>评论系统未启用（comments.enabled = false）。</p>
            </section>
        );
    }

    const { type, serverURL, envId, gitalk } = config.comments;

    if (type === 'waline' && serverURL) {
        return (
            <div class="mt-10 bg-black/40 border border-emerald-500/20 rounded-none p-4">
                <h3 class="text-zinc-200 mb-3"><span class="text-emerald-400">&gt;</span> comments</h3>
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
                        dark: false,
                    });
                    `
                }} />
            </div>
        );
    }

    if (type === 'twikoo' && envId) {
        return (
            <div class="mt-10 bg-black/40 border border-emerald-500/20 rounded-none p-4">
                <h3 class="text-zinc-200 mb-3"><span class="text-emerald-400">&gt;</span> comments</h3>
                <div id="tcomment"></div>
                <script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.36/dist/twikoo.all.min.js"></script>
                <script dangerouslySetInnerHTML={{
                    __html: `twikoo.init({ envId: '${envId}', el: '#tcomment', path: '${path}', lang: '${config.language}' });`
                }} />
            </div>
        );
    }

    if (type === 'gitalk' && gitalk) {
        return (
            <div class="mt-10 bg-black/40 border border-emerald-500/20 rounded-none p-4">
                <h3 class="text-zinc-200 mb-3"><span class="text-emerald-400">&gt;</span> comments</h3>
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
                        id: '${path}'
                    });
                    gitalk.render('gitalk-container');
                    `
                }} />
            </div>
        );
    }

    return null;
}
