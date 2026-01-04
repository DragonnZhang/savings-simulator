import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['savings-core'],
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
