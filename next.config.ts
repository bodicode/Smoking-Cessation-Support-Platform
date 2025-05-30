import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  webpack: (config: any) => {
    config.cache = false;
    return config;
  },
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
