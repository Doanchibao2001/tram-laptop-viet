import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "tramlaptopviet.vn" }],
        destination: "https://www.tramlaptopviet.vn/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/qnykgwoz/production/**",
      },
    ],
  },
};

export default nextConfig;
