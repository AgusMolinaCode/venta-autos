import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-label',
      'lucide-react',
      '@tabler/icons-react'
    ],
    // Enable modern optimizations (but disable for Turbopack)
    webpackBuildWorker: true,
  },
  
  // Turbopack-specific configuration (moved from experimental)
  turbopack: {
    resolveAlias: {
      // Add any specific aliases if needed
    },
  },
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compress output
  compress: true,
  
  // Conditional webpack configuration (only for non-Turbopack builds)
  ...(!process.env.TURBOPACK && {
    webpack: (config, { dev, isServer }) => {
      // Prevent cache conflicts between bundlers
      if (dev) {
        config.cache = false;
      }
      
      // Only apply webpack optimizations for production builds
      if (!dev && !isServer) {
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              chunks: 'all',
            },
          },
        };
      }
      
      return config;
    },
  }),
};

export default nextConfig;
