import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable Webpack persistent disk packfile cache in development
      // Prevents Windows OneDrive sync locks on .pack.gz from causing ENOENT and 404 chunk crashes
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
