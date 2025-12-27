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

class WorkerPool {
    private workers: Worker[] = [];
    private queue: Array<{ filePath: string; slug: string; resolve: (value: Post) => void; reject: (reason?: any) => void }> = [];
    private activeWorkers: number = 0;
    private maxWorkers: number;
    private workerPath: string;
    private idleWorkers: Worker[] = [];

    constructor(workerPath: string, maxWorkers: number) {
        this.workerPath = workerPath;
        this.maxWorkers = maxWorkers;
    }

    public async run(filePath: string, slug: string): Promise<Post> {
        return new Promise<Post>((resolve, reject) => {
            this.queue.push({ filePath, slug, resolve, reject });
            this.processQueue();
        });
    }

    private processQueue() {
        if (this.queue.length === 0) return;

        if (this.idleWorkers.length > 0) {
            const worker = this.idleWorkers.pop()!;
            this.assignTask(worker);
        } else if (this.activeWorkers < this.maxWorkers) {
            this.createWorker();
        }
    }

    private createWorker() {
        const worker = new Worker(this.workerPath);
        this.activeWorkers++;

        worker.on('message', (msg) => {
            if (msg.status === 'success') {
                const task = worker.userData;
                if (task) {
                    console.log(`✓ Processed: ${task.slug}`);
                    task.resolve(msg.result);
                }
            } else {
                const task = worker.userData;
                if (task) {
                    console.error(`✗ Error processing ${task.slug}:`, msg.error);
                    // Resolve with error post to keep build running
                    task.resolve({
                        slug: task.slug,
                        title: `Error: ${task.slug}`,
                        date: new Date().toISOString(),
                        content: `<div class="error">Build Error: ${msg.error}</div>`,
                        draft: true
                    } as Post);
                }
            }

            this.releaseWorker(worker);
        });

        worker.on('error', (err) => {
            console.error('[Worker Error]:', err);
            const task = worker.userData;
            if (task) {
                task.reject(err);
            }
            this.removeWorker(worker);
            this.activeWorkers--;
            this.processQueue();
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
                const task = worker.userData;
                if (task) {
                    task.reject(new Error(`Worker stopped with exit code ${code}`));
                }
            }
            this.removeWorker(worker);
            this.activeWorkers--;
            this.processQueue();
        });

        this.assignTask(worker);
    }

    private assignTask(worker: Worker) {
        if (this.queue.length > 0) {
            const task = this.queue.shift()!;
            worker.userData = task;
            worker.postMessage({ filePath: task.filePath, slug: task.slug });
        } else {
            this.idleWorkers.push(worker);
        }
    }

    private releaseWorker(worker: Worker) {
        worker.userData = null;
        // If there are tasks in queue, assign immediately
        if (this.queue.length > 0) {
            this.assignTask(worker);
        } else {
            this.idleWorkers.push(worker);
        }
    }

    private removeWorker(worker: Worker) {
        const index = this.idleWorkers.indexOf(worker);
        if (index !== -1) {
            this.idleWorkers.splice(index, 1);
        }
        worker.terminate();
    }

    public close() {
        this.idleWorkers.forEach(w => w.terminate());
        this.idleWorkers = [];
        // Also terminate active workers? Ideally wait for them, but for build script we can just kill.
    }
}

// Extend Worker type to hold user data
declare module 'worker_threads' {
    interface Worker {
        userData?: { filePath: string; slug: string; resolve: (value: Post) => void; reject: (reason?: any) => void } | null;
    }
}

export async function getPosts(contentDir: string): Promise<Post[]> {
    const files = (await fs.readdir(contentDir)).filter(file => file.endsWith('.md'));
    console.log(`Total markdown files found: ${files.length}`);

    // Use fewer workers to improve stability
    const numWorkers = Math.max(1, Math.min(os.cpus().length - 1, 4));
    console.log(`Starting build with ${numWorkers} workers...`);

    const workerPath = path.join(process.cwd(), 'dist', 'worker.js');
    const pool = new WorkerPool(workerPath, numWorkers);

    const promises = files.map(file => {
        return pool.run(path.join(contentDir, file), file.replace('.md', ''))
            .catch(err => {
                console.error(`Failed to process ${file}:`, err);
                return {
                    slug: file.replace('.md', ''),
                    title: 'Build Error',
                    date: new Date().toISOString(),
                    content: `Error: ${err.message}`,
                    draft: true
                } as Post;
            });
    });

    const results = await Promise.all(promises);
    pool.close();

    const flatPosts = results.filter(p => p !== null);
    console.log(`Total posts processed: ${flatPosts.length}`);

    return flatPosts.sort((a, b) => {
        if (a.pin && !b.pin) return -1;
        if (!a.pin && b.pin) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export async function renderMarkdown(content: string): Promise<string> {
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
