import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**.blob.vercel-storage.com",
      },
    ],
  },
  // Consolidate duplicate comparison URLs onto the canonical (stronger) page.
  async redirects() {
    return [
      {
        source: "/embody-vs-altrx",
        destination: "/altrx-vs-embody",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
