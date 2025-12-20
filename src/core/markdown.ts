import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

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
}

export async function getPosts(contentDir: string): Promise<Post[]> {
    const files = await fs.readdir(contentDir);

    const posts = await Promise.all(
        files
            .filter(file => file.endsWith('.md'))
            .map(async (file) => {
                const filePath = path.join(contentDir, file);
                const fileContent = await fs.readFile(filePath, 'utf-8');
                const { data, content } = matter(fileContent);

                const processedContent = await unified()
                    .use(remarkParse)
                    .use(remarkGfm)
                    .use(remarkRehype)
                    .use(rehypeSlug)
                    .use(rehypeHighlight)
                    .use(rehypeStringify)
                    .process(content);

                return {
                    slug: file.replace('.md', ''),
                    title: data.title || 'Untitled',
                    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
                    content: processedContent.toString(),
                    excerpt: data.excerpt || '',
                    image: data.image,
                    category: data.category,
                    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
                    draft: data.draft === true,
                    hide: data.hide === true,
                    abbrlink: data.abbrlink,
                };
            })
    );

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
