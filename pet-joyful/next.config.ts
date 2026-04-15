import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  reactStrictMode: true,
  images: {
    // Allow external images from Cloudinary used by the posts microservice
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Atenção: Isso permite que o build termine mesmo com erros de lint.
    ignoreDuringBuilds: true,
  },
  // Aproveite para conferir se o standalone está ativo:
  output: 'standalone', 
};

export default nextConfig;
