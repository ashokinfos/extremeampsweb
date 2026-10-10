import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.gennest.in' },
      { protocol: 'https', hostname: '*.extremeamps.in' },
      { protocol: 'https', hostname: 'api.extremeamps.in' },
    ],
    unoptimized: true,
  },
  transpilePackages: ['minimal-shared'],
};

export default nextConfig;
