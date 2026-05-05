import { execSync } from "child_process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => {
    try {
      return execSync("git rev-parse HEAD").toString().trim().slice(0, 12);
    } catch {
      return `build-${Date.now()}`;
    }
  },
  async rewrites() {
    const apiUrl = process.env.API_URL ?? "http://localhost:3001";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
