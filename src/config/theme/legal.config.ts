import { reweaveConfig, ReweaveConfig } from '../reweave.config';

export interface LegalThemeConfig extends ReweaveConfig {
    // Add any specific config for legal theme here
    showPrintButton?: boolean;
}

export const config: LegalThemeConfig = {
    ...reweaveConfig,
    homePage: 'posts',
    showPrintButton: true,
};
