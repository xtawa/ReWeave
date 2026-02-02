/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

interface Category {
    name: string;
    count: number;
}

interface CategoryListProps {
    categories: Category[];
}

function safeSlug(str: string): string {
    if (/^[a-zA-Z0-9-_]+$/.test(str)) {
        return str;
    }
    return Buffer.from(str).toString('hex');
}

export function CategoryList({ categories }: CategoryListProps) {
    const total = categories.reduce((sum, cat) => sum + cat.count, 0);

    return (
        <Layout title="分类">
            <Header />
            <div class="flex flex-col md:flex-row gap-6">
                <main class="flex-1 w-full min-w-0">
                    <div class="glass-card">
                        <div class="glass-header flex justify-between items-center">
                            <h1 class="text-2xl font-bold m-0">📁 分类</h1>
                            <span class="text-sm text-slate-500">共 {categories.length} 个分类，{total} 篇文章</span>
                        </div>
                        <div class="glass-content">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {categories.map(category => (
                                    <a
                                        key={category.name}
                                        href={`/categories/${safeSlug(category.name)}`}
                                        class="glass-panel p-4 flex items-center justify-between hover:scale-102 transition-all duration-200 group"
                                    >
                                        <div class="flex items-center gap-3">
                                            <span class="text-2xl">📂</span>
                                            <span class="text-base font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                                                {category.name}
                                            </span>
                                        </div>
                                        <span class="aero-btn text-xs px-3 py-1">{category.count}</span>
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
