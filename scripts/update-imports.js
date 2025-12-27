import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.md')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles(srcDir, []);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // 1. Update weave.config import
    content = content.replace(/from\s+['"](.*)\/config\/weave\.config['"]/g, "from '$1/config/theme/weave.config'");

    // 2. Update butterfly.config import
    content = content.replace(/from\s+['"](.*)\/config\/butterfly\.config['"]/g, "from '$1/config/theme/butterfly.config'");

    // 3. Update landing.config import
    content = content.replace(/from\s+['"](.*)\/config\/landing\.config['"]/g, "from '$1/config/theme/landing.config'");

    // 4. Update hero.config import
    // Case A: In config/theme/*.config.ts (previously ../core/hero.config, now ../hero.config)
    if (file.includes('src\\config\\theme') || file.includes('src/config/theme')) {
        content = content.replace(/from\s+['"]\.\.\/core\/hero\.config['"]/g, "from '../hero.config'");
    }
    // Case B: In config/reweave.config.ts (previously ../core/hero.config, now ./hero.config)
    else if (file.endsWith('reweave.config.ts')) {
        content = content.replace(/from\s+['"]\.\.\/core\/hero\.config['"]/g, "from './hero.config'");
    }
    // Case C: General replacement for other files (src/core/hero.config -> src/config/hero.config)
    // Adjust relative paths based on file location is tricky with regex, so we rely on the fact that most imports use relative paths.
    // Let's look for specific patterns found in grep.

    // Fix specific known patterns
    content = content.replace(/src\/core\/hero\.config\.ts/g, "src/config/hero.config.ts"); // For markdown files

    // For imports in components (usually ../../../config/...)
    // If it was importing from core/hero.config, it might need adjustment.
    // But wait, hero.config was in src/core, now in src/config.
    // If a file imported '../core/hero.config', and it is in src/config, it becomes './hero.config'.
    // If a file imported '../../core/hero.config', it becomes '../../config/hero.config'.

    // Let's handle the specific imports found in grep
    // No direct imports of hero.config were found in components in the grep results (except in config files).
    // But let's be safe.

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
