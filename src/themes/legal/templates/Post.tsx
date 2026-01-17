/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';

interface PostProps {
    post: {
        title: string;
        content: string;
        date: string;
        toc?: string;
    };
    prevPost?: { title: string; url: string };
    nextPost?: { title: string; url: string };
}

export function Post({ post, prevPost, nextPost }: PostProps) {
    return (
        <Layout title={post.title} siteTitle="Legal Docs" updatedDate={post.date}>
            {post.toc && (
                <div class="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div dangerouslySetInnerHTML={{ __html: post.toc }} />
                </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
                {prevPost ? (
                    <a href={prevPost.url} class="text-blue-600 dark:text-blue-400 hover:underline">
                        &larr; {prevPost.title}
                    </a>
                ) : <div />}
                {nextPost ? (
                    <a href={nextPost.url} class="text-blue-600 dark:text-blue-400 hover:underline">
                        {nextPost.title} &rarr;
                    </a>
                ) : <div />}
            </div>
        </Layout>
    );
}
