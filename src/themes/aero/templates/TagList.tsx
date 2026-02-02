/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

interface Tag {
    name: string;
    count: number;
}

interface TagListProps {
    tags: Tag[];
}

function safeSlug(str: string): string {
    if (/^[a-zA-Z0-9-_]+$/.test(str)) {
        return str;
    }
    return Buffer.from(str).toString('hex');
}

export function TagList({ tags }: TagListProps) {
    const total = tags.reduce((sum, tag) => sum + tag.count, 0);
    const maxCount = Math.max(...tags.map(t => t.count));

    const getTagSize = (count: number) => {
        const ratio = count / maxCount;
        if (ratio > 0.7) return 'text-xl';
        if (ratio > 0.4) return 'text-base';
        return 'text-sm';
    };

    return (
        <Layout title="标签">
            <Header />
            <div class="flex flex-col md:flex-row gap-6">
                <main class="flex-1 w-full min-w-0">
                    <div class="glass-card">
                        <div class="glass-header flex justify-between items-center">
                            <h1 class="text-2xl font-bold m-0">🏷️ 标签</h1>
                            <span class="text-sm text-slate-500">共 {tags.length} 个标签，{total} 篇文章</span>
                        </div>
                        <div class="glass-content">
                            <div class="flex flex-wrap gap-3 justify-center">
                                {tags.map(tag => (
                                    <a
                                        key={tag.name}
                                        href={`/tags/${safeSlug(tag.name)}`}
                                        class={`tag ${getTagSize(tag.count)} hover:scale-110 transition-all duration-200`}
                                    >
                                        {tag.name}
                                        <span class="ml-2 opacity-70">({tag.count})</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
                <div class="w-full md:w-80 shrink-0">
                    <Sidebar />
                </div>
            </div>
        </Layout>
    );
}
