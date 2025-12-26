/** @jsx h */
import { h, ComponentChildren } from 'preact';

interface DefaultLayoutProps {
    title?: string;
    children: ComponentChildren;
}

export function DefaultLayout({ title, children }: DefaultLayoutProps) {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title || 'ReWeave Site'}</title>
                <link rel="stylesheet" href="/style.css" />
                <style>{`
                    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
                    h1 { color: #333; }
                    a { color: #0066cc; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                `}</style>
            </head>
            <body>
                <header style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>
                    <h1>ReWeave Default Theme</h1>
                    <p>No theme configured or theme not found.</p>
                </header>
                <main>
                    {children}
                </main>
                <footer style={{ marginTop: '4rem', borderTop: '1px solid #eee', paddingTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                    <p>&copy; {new Date().getFullYear()} ReWeave. Generated with ReWeave.</p>
                </footer>
            </body>
        </html>
    );
}
