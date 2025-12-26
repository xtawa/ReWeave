
import fs from 'fs/promises';

const dirCache = new Set<string>();

export async function ensureDir(dir: string) {
    if (dirCache.has(dir)) return;
    try {
        await fs.mkdir(dir, { recursive: true });
        dirCache.add(dir);
    } catch (e: any) {
        if (e.code !== 'EEXIST') throw e;
        dirCache.add(dir);
    }
}
