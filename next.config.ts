import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.extremeamps.in' },
      { protocol: 'https', hostname: '*.extremeamps.in' },
      { protocol: 'https', hostname: 'api.extremeamps.in' },
    ],
  },
  transpilePackages: ['minimal-shared'],
};

export default nextConfig;
