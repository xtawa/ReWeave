import fs from 'fs/promises';
import path from 'path';
import { Worker } from 'worker_threads';
import os from 'os';

export interface Post {
    slug: string;
    title: string;
    date: string;
    content: string;
    excerpt?: string;
    image?: string;
    category?: string;
    tags?: string[];
    draft?: boolean;
    hide?: boolean;
    abbrlink?: string;
    pin?: boolean;
    headings?: Array<{ level: number; text: string; id: string }>;
}

// Static distribution approach (easiest to implement correctly quickly)
export async function getPosts(contentDir: string): Promise<Post[]> {
    const files = (await fs.readdir(contentDir)).filter(file => file.endsWith('.md'));
    const numWorkers = Math.max(1, os.cpus().length);
    const workers: Worker[] = [];

    // Create workers
    const workerPath = path.join(process.cwd(), 'dist', 'worker.js');
    for (let i = 0; i < numWorkers; i++) {
        workers.push(new Worker(workerPath));
    }

    // Distribute files
    const chunks: string[][] = Array.from({ length: numWorkers }, () => []);
    files.forEach((file, i) => chunks[i % numWorkers].push(file));

    // Process
    const promises = workers.map((worker, i) => {
        return new Promise<Post[]>((resolve, reject) => {
            const chunk = chunks[i];
            const results: Post[] = [];
            let completed = 0;

            if (chunk.length === 0) {
                resolve([]);
                return;
            }

            worker.on('message', (msg) => {
                if (msg.status === 'success') {
                    results.push(msg.result);
                } else {
                    console.error(`Error processing ${msg.slug}:`, msg.error);
                }
                completed++;
                if (completed === chunk.length) {
                    resolve(results);
                }
            });

            worker.on('error', (err) => reject(err));

            // Send all tasks
            chunk.forEach(file => {
                worker.postMessage({ filePath: path.join(contentDir, file), slug: file.replace('.md', '') });
            });
        });
    });

    const results = await Promise.all(promises);

    // Terminate workers
    workers.forEach(w => w.terminate());

    const flatPosts = results.flat();

    return flatPosts.sort((a, b) => {
        if (a.pin && !b.pin) return -1;
        if (!a.pin && b.pin) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

// Keep renderMarkdown for single usage if needed (e.g. dev mode?)
// But for build, we use getPosts.
export async function renderMarkdown(content: string): Promise<string> {
    // Fallback or dev usage
    const { unified } = await import('unified');
    const remarkParse = (await import('remark-parse')).default;
    const remarkGfm = (await import('remark-gfm')).default;
    const remarkMath = (await import('remark-math')).default;
    const remarkRehype = (await import('remark-rehype')).default;
    const rehypeSlug = (await import('rehype-slug')).default;
    const rehypeHighlight = (await import('rehype-highlight')).default;
    const rehypeKatex = (await import('rehype-katex')).default;
    const rehypeStringify = (await import('rehype-stringify')).default;

    const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeSlug)
        .use(rehypeHighlight)
        .use(rehypeStringify);

    const processed = await processor.process(content);
    return processed.toString();
}
