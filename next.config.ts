// next.config.js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();


const nextConfig = {
    webpack: (config: any) => {
        config.cache = false;
        return config;
    },
};

export default withNextIntl(nextConfig);
