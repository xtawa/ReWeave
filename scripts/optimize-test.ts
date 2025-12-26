
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const TARGET_DIR = path.join(process.cwd(), 'src', 'content');
const COUNT = 2000;

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const CODE_BLOCK = `
\`\`\`typescript
function benchmark(n: number) {
    return Array.from({ length: n }, (_, i) => i * i);
}
\`\`\`
`;

const MATH_BLOCK = `
$$
f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2\\pi i \\xi x} \\,d\\xi
$$
`;

function generateContent(index: number) {
    const date = new Date();
    date.setDate(date.getDate() - (index % 365));

    return `---
title: "Optimization Test Article ${index}"
date: "${date.toISOString()}"
tags: ["opt", "test", "complex", "tag-${index % 10}"]
category: "Optimization"
abbrlink: "opt-${index}"
---

# Optimization Test Article ${index}

${LOREM}

## Code Example

${CODE_BLOCK}

## Mathematical Formula

${MATH_BLOCK}

## Data Table

| ID | Value | Status | Description |
|----|-------|--------|-------------|
| 1  | ${Math.random().toFixed(4)} | Active | Initial State |
| 2  | ${Math.random().toFixed(4)} | Pending | Processing |
| 3  | ${Math.random().toFixed(4)} | Done | Completed |

## Detailed Analysis

${LOREM}
${LOREM}
`;
}

function cleanup() {
    if (fs.existsSync(TARGET_DIR)) {
        const files = fs.readdirSync(TARGET_DIR);
        for (const file of files) {
            if (file.startsWith('opt-test-')) {
                fs.unlinkSync(path.join(TARGET_DIR, file));
            }
        }
    }
}

async function main() {
    console.log(`Generating ${COUNT} articles for optimization test...`);
    // cleanup();

    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    for (let i = 1; i <= COUNT; i++) {
        fs.writeFileSync(path.join(TARGET_DIR, `opt-test-${i}.md`), generateContent(i));
    }

    console.log('Building...');
    const start = performance.now();
    try {
        execSync('npm run build', { stdio: 'inherit' });
    } catch (e) {
        console.error('Build failed');
        process.exit(1);
    }
    const end = performance.now();

    const duration = (end - start) / 1000;
    console.log(`\nBuild completed in ${duration.toFixed(2)}s for ${COUNT} articles.`);
    console.log(`Average: ${(duration * 1000 / COUNT).toFixed(2)}ms/page`);

    // cleanup();
}

main();
