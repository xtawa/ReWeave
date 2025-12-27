import matter from 'gray-matter';
import fs from 'fs';

const files = ['rich-text-demo.md', 'test-latex.md'];

for (const file of files) {
    try {
        const content = fs.readFileSync(`src/content/${file}`, 'utf-8');
        const parsed = matter(content);
        console.log(`\n${file}:`);
        console.log('Title:', parsed.data.title);
        console.log('Date:', parsed.data.date);
        console.log('Content length:', parsed.content.length);
        console.log('Frontmatter OK:', !!parsed.data.title && !!parsed.data.date);
    } catch (e) {
        console.error(`Error parsing ${file}:`, e.message);
    }
}
