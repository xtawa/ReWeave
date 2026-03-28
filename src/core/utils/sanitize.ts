export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function sanitizePostSlug(slug: string): string {
    return String(slug)
        .split('/')
        .filter(Boolean)
        .map(segment => {
            if (/^[A-Za-z0-9_-]+$/.test(segment)) {
                return segment;
            }
            return encodeURIComponent(segment);
        })
        .join('/');
}
