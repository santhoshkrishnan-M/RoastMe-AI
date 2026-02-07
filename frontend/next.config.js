/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize for Vercel deployment
  swcMinify: true,
  
  // Output standalone for optimized builds
  output: 'standalone',
  
  // Disable powered by header
  poweredByHeader: false,
  
  // Optimize images
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Environment variables that should be exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
  
  // Webpack configuration for handling shared types
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
