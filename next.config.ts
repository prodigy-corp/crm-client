import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  //image
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "us-003.s3.synologyc2.net",
      },
    ],
  },
  async rewrites() {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    return [
      {
        source: "/backend/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
