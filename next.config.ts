import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  telemetry: false,
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thedial.infura-ipfs.io",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "gw.ipfs-lens.dev",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "globaldesignernetwork.com",
        pathname: "/api/infura/**",
      },
    ],
    unoptimized: true,
  },
  trailingSlash: true,
  async headers() {
    let headersConfig: any = [];

    const allowedOrigins = [
      "https://thedial.infura-ipfs.io",
      "https://globaldesignernetwork.com",
      "https://gms.globaldesignernetwork.com",
      "https://gw.ipfs-lens.dev",
    ];
    allowedOrigins.forEach((origin) => {
      headersConfig.push({
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: origin,
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Origin, X-Requested-With, Content-Type, Accept, Authorization",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
        ],
      });
    });

    return headersConfig;
  },
};

export default nextConfig;
