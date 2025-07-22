import type { NextConfig } from 'next';

// Detect production environment for GitHub Pages
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Enables static HTML export
  output: 'export',

  // Base path and asset prefix must match GitHub Pages repo name
  basePath: isProd ? '/DSA-Visualizer' : '',
  assetPrefix: isProd ? '/DSA-Visualizer/' : '',

  // These help prevent build failures during export
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Allow external images if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
