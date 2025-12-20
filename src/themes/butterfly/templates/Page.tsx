/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';
import { Header } from '../components/Header';
import { Comments } from '../components/Comments';
import { config } from '../config';

interface PageProps {
    title: string;
    content: string; // HTML content
    slug?: string; // For comments
}

export function Page({ title, content, slug }: PageProps) {
    return (
        <Layout title={title}>
            <Header />

            {/* Hero */}
            <div class="relative h-[40vh] min-h-[300px] w-full overflow-hidden mb-10">
                <div
                    class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(https://images.unsplash.com/photo-1518655048521-f130df041f66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)` }}
                ></div>
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                    <h1 class="text-4xl font-bold mb-4 drop-shadow-lg">{title}</h1>
                </div>
            </div>

            <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-8 animate-fade-in-up">
                    <div class="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />

                    {slug && (
                        <Comments path={`/${slug}`} />
                    )}
                </div>
            </main>
        </Layout>
    );
}
