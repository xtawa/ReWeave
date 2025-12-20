import fs from 'fs/promises';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

const COMPLEX_CONTENT = `
# Complex Post Heading

This is a stress test post with complex content.

## 1. Code Blocks
\`\`\`typescript
interface User {
  id: number;
  name: string;
}
function greet(user: User) {
  console.log(\`Hello, \${user.name}!\`);
}
\`\`\`

\`\`\`python
def fib(n):
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a+b
    print()
\`\`\`

## 2. Mermaid Diagrams
<div class="mermaid">
graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]
    D --> B
</div>

## 3. GFM Tables
| Feature | Support | Notes |
| :--- | :---: | :--- |
| **Bold** | ✅ | Standard Markdown |
| *Italic* | ✅ | Standard Markdown |
| \`Code\` | ✅ | Inline code |
| Tables | ✅ | Via remark-gfm |

## 4. Large Text Block
${'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50)}
`;

async function generatePosts(count: number) {
    console.log(`Generating ${count} complex posts...`);
    for (let i = 0; i < count; i++) {
        const date = new Date(2025, 0, 1 + (i % 30)).toISOString().split('T')[0];
        const content = `---
title: Complex Post ${i}
date: ${date}
excerpt: This is a complex post number ${i} for testing purposes.
category: Test
tags: [Complex, Post${i}]
---
${COMPLEX_CONTENT}
`;
        await fs.writeFile(path.join(CONTENT_DIR, `complex-post-${i}.md`), content);
    }
    console.log('Generation complete.');
}

generatePosts(100).catch(console.error);
