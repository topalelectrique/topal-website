import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      // Redirect old WordPress URLs — site was never WordPress but Google has stale references
      {
        source: '/wp-sitemap:path*',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/wp-:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wordpress:path*',
        destination: '/',
        permanent: true,
      },
    ];
  },
};
export default withNextIntl(nextConfig);
