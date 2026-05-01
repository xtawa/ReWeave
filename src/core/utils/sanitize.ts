export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Encode a single URL segment (no slashes). Returns ASCII-alphanumeric + `-_
` as-is, encodes everything else.
 */
export function safeSlug(str: string): string {
    if (/^[a-zA-Z0-9-_]+$/.test(str)) {
        return str;
    }
    return encodeURIComponent(str);
}

/**
 * Encode a multi-segment slug path (e.g. "2024/中文文章").
 * Splits by `/`, encodes each segment, re-joins.
 */
export function sanitizePostSlug(slug: string): string {
    return String(slug)
        .split('/')
        .filter(Boolean)
        .map(segment => safeSlug(segment))
        .join('/');
}
