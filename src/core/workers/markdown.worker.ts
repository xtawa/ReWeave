
import { parentPort } from 'worker_threads';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import fs from 'fs/promises';

// Custom plugin to extract headings
function rehypeExtractHeadings(options: { headings: any[] }) {
    return (tree: any) => {
        const visit = (node: any) => {
            if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
                const level = parseInt(node.tagName.charAt(1));
                let id = node.properties?.id;

                // Get text content
                const text = node.children
                    .filter((c: any) => c.type === 'text')
                    .map((c: any) => c.value)
                    .join('');

                if (!id && text) {
                    id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                }

                if (text) {
                    options.headings.push({ level, text, id });
                }
            }
            if (node.children) {
                node.children.forEach(visit);
            }
        };
        visit(tree);
    };
}

// Create a processor factory to allow per-request state (headings)
const createProcessor = (headings: any[]) => unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeHighlight, { ignoreMissing: true } as any) // Optimize highlight
    .use(rehypeExtractHeadings, { headings })
    .use(rehypeStringify);

if (parentPort) {
    parentPort.on('message', async (task) => {
        try {
            const { filePath, slug } = task;
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const { data, content } = matter(fileContent);

            const headings: any[] = [];
            const processor = createProcessor(headings);
            const processed = await processor.process(content);
            const html = processed.toString();

            // const headings = extractHeadings(html);

            parentPort!.postMessage({
                status: 'success',
                result: {
                    slug,
                    title: data.title || 'Untitled',
                    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
                    content: html,
                    excerpt: data.excerpt || '',
                    image: data.image,
                    category: data.category,
                    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
                    draft: data.draft === true,
                    hide: data.hide === true,
                    abbrlink: data.abbrlink,
                    pin: data.pin === true,
                    headings
                }
            });
        } catch (error: any) {
            parentPort!.postMessage({ status: 'error', error: error.message, slug: task.slug });
        }
    });
}
