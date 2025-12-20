import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const REPORT_FILE = path.join(process.cwd(), 'src/content/performance-report.md');

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
title: Stress Test Post ${i}
date: ${date}
excerpt: This is a complex stress test post number ${i}.
category: Stress Test
tags: [Benchmark, StressTest, Post${i}]
---
${COMPLEX_CONTENT}
`;
        await fs.writeFile(path.join(CONTENT_DIR, `stress-test-${i}.md`), content);
    }
}

async function cleanupPosts(count: number) {
    console.log(`Cleaning up ${count} stress test posts...`);
    for (let i = 0; i < count; i++) {
        try {
            await fs.unlink(path.join(CONTENT_DIR, `stress-test-${i}.md`));
        } catch (e) { }
    }
}

async function runBenchmark() {
    const counts = [100, 500, 1000];
    const results: Array<{ count: number, time: number }> = [];

    for (const count of counts) {
        await generatePosts(count);

        console.log(`Building with ${count} posts...`);
        const start = Date.now();
        try {
            execSync('npm run build', { stdio: 'inherit' });
            const end = Date.now();
            const duration = (end - start) / 1000;
            results.push({ count, time: duration });
            console.log(`Build with ${count} posts took ${duration}s`);
        } catch (e) {
            console.error('Build failed', e);
        }

        await cleanupPosts(count);
    }

    await updateReport(results);
}

async function updateReport(results: Array<{ count: number, time: number }>) {
    console.log('Updating performance report...');
    let report = await fs.readFile(REPORT_FILE, 'utf-8');

    const tableRows = results.map(r => `| **${r.count} (Complex)** | ${r.time.toFixed(2)}s | ${(r.time * 1000 / r.count).toFixed(1)}ms |`).join('\n');

    const newSection = `
## 最新压力测试结果 (复杂文章)
测试时间: ${new Date().toLocaleString()}
内容包含: 代码块、Mermaid 图表、大文本、GFM 表格。

| 文章数 | 构建时间 (秒) | 每篇文章耗时 (ms) |
| :--- | :--- | :--- |
${tableRows}
`;

    // Append to the end or replace a marker
    report += newSection;
    await fs.writeFile(REPORT_FILE, report);
}

runBenchmark().catch(console.error);
