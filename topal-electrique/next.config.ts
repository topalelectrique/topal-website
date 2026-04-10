import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
const nextConfig = {
  output: 'export' as const,
  images: {
    unoptimized: true,
  },
};
export default withNextIntl(nextConfig);
