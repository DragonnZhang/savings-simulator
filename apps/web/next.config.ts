import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['savings-core'],
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGithubActions ? '/savings-simulator' : '',
  assetPrefix: isGithubActions ? '/savings-simulator/' : '',
};

export default nextConfig;
