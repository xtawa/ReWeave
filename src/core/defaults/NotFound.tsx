/** @jsx h */
import { h } from 'preact';

export function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '6rem', margin: '0 0 1rem 0', color: '#e5e7eb' }}>404</h1>
            <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', color: '#374151' }}>Page Not Found</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>The page you are looking for does not exist or has been moved.</p>
            <a href="/" style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'background-color 0.2s'
            }}>
                Go Back Home
            </a>
        </div>
    );
}
