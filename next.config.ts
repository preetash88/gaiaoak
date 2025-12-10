// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      // add any other hosts you use, e.g.:
      // { protocol: "https", hostname: "cdn.example.com", pathname: "/images/**" }
    ],
  },
};

export default nextConfig;
