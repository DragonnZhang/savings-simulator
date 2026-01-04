import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['savings-core'],
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/savings-simulator' : '',
  assetPrefix: isProd ? '/savings-simulator/' : '',
};

export default nextConfig;
