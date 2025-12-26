
import fs from 'fs';
import path from 'path';

const TARGET_DIR = path.join(process.cwd(), 'src', 'content');

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

export function generateContent(index: number) {
    const date = new Date();
    date.setDate(date.getDate() - (index % 365));

    return `---
title: "Benchmark Article ${index} - Complex Content"
date: "${date.toISOString()}"
tags: ["benchmark", "test", "complex", "tag-${index % 10}"]
category: "Performance Testing"
abbrlink: "bench-${index}"
---

# Benchmark Article ${index}

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

> This is a blockquote to test rendering performance.

- List item 1
- List item 2
- List item 3
  - Nested item A
  - Nested item B

`;
}

async function main() {
    const args = process.argv.slice(2);
    const count = parseInt(args[0]) || 100;

    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    console.log(`Generating ${count} complex articles in ${TARGET_DIR}...`);

    for (let i = 1; i <= count; i++) {
        const content = generateContent(i);
        fs.writeFileSync(path.join(TARGET_DIR, `bench-test-${i}.md`), content);
    }

    console.log(`Generated ${count} articles.`);
}

main();
