/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

interface PageProps {
    title: string;
    content: string;
    slug: string;
}

export function Page({ title, content, slug }: PageProps) {
    return (
        <Layout title={title}>
            <Header />
            <div class="flex flex-col md:flex-row gap-6">
                <main class="flex-1 w-full min-w-0">
                    <div class="glass-card p-6 min-h-[500px]">
                        <div class="glass-header mb-4 -mx-6 -mt-6 rounded-t-lg px-6 py-3">
                            <h1 class="text-2xl font-bold m-0">{title}</h1>
                        </div>
                        <div
                            class="prose prose-slate max-w-none text-slate-800"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </main>
                <div class="w-full md:w-80 shrink-0">
                    <div class="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
