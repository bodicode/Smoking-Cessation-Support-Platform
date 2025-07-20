const nextConfig = {
  webpack: (config: any) => {
    config.cache = false;
    return config;
  },
  images: {
    domains: [
      'yxlouqtuxvvkgwtkdxav.supabase.co',
      'via.placeholder.com'
    ],
  },
};

export default nextConfig;