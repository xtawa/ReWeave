import { reweaveConfig, ReweaveConfig } from '../../core/reweave.config';

export interface LandingThemeConfig extends Omit<ReweaveConfig, 'hero'> {
    hero: {
        title: string;
        subtitle: string;
        ctaText: string;
        ctaLink: string;
        image?: string;
    };
    features: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;
    footer?: {
        copyright?: string;
    };
}

export const config: LandingThemeConfig = {
    ...reweaveConfig,
    hero: {
        title: "Product Landing Page",
        subtitle: "Showcase your product effectively.",
        ctaText: "Get Started",
        ctaLink: "#",
        image: "/landing_hero_bg.png",
    },
    features: [
        {
            title: "Feature 1",
            description: "Description of feature 1.",
        },
        {
            title: "Feature 2",
            description: "Description of feature 2.",
        },
        {
            title: "Feature 3",
            description: "Description of feature 3.",
        },
    ],
    footer: {
        copyright: "© 2024 Product Name",
    },
};
