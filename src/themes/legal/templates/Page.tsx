/** @jsx h */
import { h } from 'preact';
import { Layout } from '../layouts/Layout';

interface PageProps {
    title: string;
    content: string;
    slug: string;
}

export function Page({ title, content, slug }: PageProps) {
    return (
        <Layout title={title} siteTitle="Legal Docs">
            <div id={`page-${slug}`} dangerouslySetInnerHTML={{ __html: content }} />
        </Layout>
    );
}
