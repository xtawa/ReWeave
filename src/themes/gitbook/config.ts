import { reweaveConfig, ReweaveConfig } from '../../core/reweave.config';

export interface GitBookThemeConfig extends ReweaveConfig {
    sidebar?: {
        collapsible?: boolean;
    };
    editLink?: {
        baseUrl: string;
        text: string;
    };
}

export const config: GitBookThemeConfig = {
    ...reweaveConfig,
    sidebar: {
        collapsible: true,
    },
    editLink: {
        baseUrl: 'https://github.com/xtawa/ReWeave/edit/main/src/docs',
        text: 'Edit this page on GitHub',
    },
};
