import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/savings-simulator' : '',
  assetPrefix: isProd ? '/savings-simulator/' : '',
};

export default nextConfig;
