
import { reweaveConfig } from './src/config/reweave.config';

(async () => {
    try {
        const themeName = reweaveConfig.themeName;
        console.log(`Checking theme: ${themeName}`);

        const themePath = `./src/themes/${themeName}`;
        console.log(`Theme path: ${themePath}`);

        console.log('Importing Layout...');
        await import(`${themePath}/layouts/Layout`);
        console.log('Layout loaded.');

        console.log('Importing Header...');
        await import(`${themePath}/components/Header`);
        console.log('Header loaded.');

        console.log('Importing Sidebar...');
        await import(`${themePath}/components/Sidebar`);
        console.log('Sidebar loaded.');

        console.log('Importing Page...');
        await import(`${themePath}/templates/Page`);
        console.log('Page loaded.');

    } catch (e) {
        console.error('ERROR LOADING THEME MODULES:');
        console.error(e);
    }
})();
