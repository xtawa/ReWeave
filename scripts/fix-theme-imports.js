import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const themeConfigDir = path.join(__dirname, '..', 'src', 'config', 'theme');

const files = fs.readdirSync(themeConfigDir);

files.forEach(file => {
    if (file.endsWith('.config.ts')) {
        const filePath = path.join(themeConfigDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Fix reweave.config import
        if (content.includes("from './reweave.config'")) {
            content = content.replace("from './reweave.config'", "from '../reweave.config'");
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed reweave.config import in ${file}`);
        }
    }
});
