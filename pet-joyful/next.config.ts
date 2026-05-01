import type { NextConfig } from "next";
 
const nextConfig: NextConfig = {
<<<<<<< HEAD
  
=======
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
>>>>>>> 6baa73b723c0dc6c02415e9c2d39a8554290a779
  reactStrictMode: true,
  images: {
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