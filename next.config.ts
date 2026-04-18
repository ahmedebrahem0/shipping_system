import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://shippingiti.runasp.net/api/:path*",
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5050",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
