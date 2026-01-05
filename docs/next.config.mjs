import { createMDX } from 'fumadocs-mdx/next';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  env: {
    NEXT_PUBLIC_POSTHOG_KEY: process.env.PUBLIC_POSTHOG_KEY,
  },
  reactStrictMode: true,
  output: 'export',
  basePath: '/docs',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias['$lib'] = path.resolve(__dirname, '../src/lib');
    return config;
  },
  // Transpile shared lib from parent project
  transpilePackages: [],
};

export default withMDX(config);
