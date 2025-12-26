
import { parentPort } from 'worker_threads';
import { h } from 'preact';
import { render } from 'preact-render-to-string';
import path from 'path';

// Cache for imported modules
const moduleCache = new Map<string, any>();

async function getModule(modulePath: string) {
    if (moduleCache.has(modulePath)) {
        return moduleCache.get(modulePath);
    }
    const module = await import(modulePath);
    moduleCache.set(modulePath, module);
    return module;
}

if (parentPort) {
    parentPort.on('message', async (task) => {
        try {
            const { themeName, post, config, type } = task;

            // Dynamic imports based on theme
            const themePath = `../../../themes/${themeName}`;

            // We need to resolve absolute paths or use relative from this worker file
            // This worker is in src/core/workers/
            // Themes are in src/themes/

            const LayoutModule = await getModule(`${themePath}/layouts/Layout`);
            const Layout = LayoutModule.Layout;

            const HeaderModule = await getModule(`${themePath}/components/Header`);
            const Header = HeaderModule.Header;

            const PostModule = await getModule(`${themePath}/templates/Post`).catch(() => ({ Post: null }));
            const Post = PostModule.Post;

            const CommentsModule = await getModule(`${themePath}/components/Comments`);
            const Comments = CommentsModule.Comments;

            let html = '';

            if (type === 'post') {
                if (Post) {
                    const postContent = (
                        <Post
                            post={post}
                            prevPost={task.prevPost}
                            nextPost={task.nextPost}
                        />
                    );
                    html = render(postContent);
                } else {
                    // Default layout rendering (simplified for worker)
                    // We need to replicate the logic from build.tsx
                    // Or we can just assume Post template exists for Weave theme (it does)

                    // For now, let's assume Post template exists or fallback to simple Layout
                    const postContent = (
                        <Layout title={post.title} description={post.excerpt} image={post.image}>
                            <Header />
                            <div class="mx-auto max-w-2xl">
                                <article>
                                    <header class="flex flex-col">
                                        <h1 class="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                                            {post.title}
                                        </h1>
                                    </header>
                                    <div class="mt-8 prose prose-zinc dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
                                </article>
                            </div>
                        </Layout>
                    );
                    html = render(postContent);
                }
            }

            parentPort!.postMessage({
                status: 'success',
                html: '<!DOCTYPE html>' + html,
                slug: post.slug
            });

        } catch (error: any) {
            console.error("Renderer Worker Error:", error);
            parentPort!.postMessage({ status: 'error', error: error.message, slug: task.post?.slug });
        }
    });
}
