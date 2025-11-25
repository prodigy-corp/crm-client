import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  //image
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "us-003.s3.synologyc2.net"
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
