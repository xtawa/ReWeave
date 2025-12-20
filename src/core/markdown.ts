import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

export interface Post {
    slug: string;
    title: string;
    date: string;
    content: string; // HTML content
    excerpt?: string;
    image?: string;
}

export async function getPosts(contentDir: string): Promise<Post[]> {
    const files = await fs.readdir(contentDir);
    const posts: Post[] = [];

    for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(contentDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        const processedContent = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeStringify)
            .process(content);

        posts.push({
            slug: file.replace('.md', ''),
            title: data.title || 'Untitled',
            date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            content: processedContent.toString(),
            excerpt: data.excerpt || '',
            image: data.image,
        });
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
