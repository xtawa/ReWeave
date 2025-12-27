import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertSvgToPng() {
    const publicDir = path.join(__dirname, '..', 'public');

    // Convert dark logo
    await sharp(path.join(publicDir, 'logo.svg'))
        .resize(512, 512)
        .png()
        .toFile(path.join(publicDir, 'logo.png'));
    console.log('Created logo.png');

    // Convert light logo
    await sharp(path.join(publicDir, 'logo-light.svg'))
        .resize(512, 512)
        .png()
        .toFile(path.join(publicDir, 'logo-light.png'));
    console.log('Created logo-light.png');

    // Create favicon (32x32)
    await sharp(path.join(publicDir, 'logo.svg'))
        .resize(32, 32)
        .png()
        .toFile(path.join(publicDir, 'favicon.png'));
    console.log('Created favicon.png');

    // Create favicon-48 (48x48)
    await sharp(path.join(publicDir, 'logo.svg'))
        .resize(48, 48)
        .png()
        .toFile(path.join(publicDir, 'favicon-48.png'));
    console.log('Created favicon-48.png');

    // Create avatar (dark version, 128x128)
    await sharp(path.join(publicDir, 'logo.svg'))
        .resize(128, 128)
        .png()
        .toFile(path.join(publicDir, 'avatar.png'));
    console.log('Created avatar.png');

    // Create avatar-light (128x128)
    await sharp(path.join(publicDir, 'logo-light.svg'))
        .resize(128, 128)
        .png()
        .toFile(path.join(publicDir, 'avatar-light.png'));
    console.log('Created avatar-light.png');

    console.log('All conversions complete!');
}

convertSvgToPng().catch(console.error);
