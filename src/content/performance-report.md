---
title: ReWeave Performance Report
date: 2025-12-21
excerpt: Benchmarking ReWeave's build performance with up to 500 posts.
image: https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070
---

# ReWeave Performance Report

At ReWeave, we take performance seriously. Not just the runtime performance of the generated site (which is instant), but also the build performance for the developer.

We recently conducted a "stress test" to see how the framework handles an increasing number of posts.

## Methodology

We generated dummy Markdown posts and measured the total time taken for `npm run build` to complete. This includes:
1.  Parsing Markdown files.
2.  Generating HTML for the Index and all Post pages.
3.  Compiling TailwindCSS.

The test was run on a standard development machine with **parallel processing enabled**.

## Results

| Posts | Build Time (Seconds) | Time per Post (ms) |
| :--- | :--- | :--- |
| **50** | 5.67s | 113ms |
| **100** | 6.62s | 66ms |
| **250** | 6.52s | 26ms |
| **500** | 7.27s | 14ms |

## Analysis

The results are incredibly promising.

1.  **Constant Overhead**: There is a base overhead of about **5-6 seconds**. This is primarily due to Node.js startup time and the TailwindCSS JIT compiler initializing.
2.  **Linear Scaling**: Once initialized, the actual processing of posts is extremely fast. Adding 450 posts (from 50 to 500) only increased the build time by **1.6 seconds**.
3.  **Efficiency**: At 500 posts, the marginal cost of adding a new post is negligible.

## Conclusion

ReWeave is ready for blogs of all sizes. Whether you have 10 posts or 1000, your build times will remain snappy, allowing you to focus on writing.
