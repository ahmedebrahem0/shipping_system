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

  // الكود الجديد لحل مشكلة الـ HTTP والـ HTTPS
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "http://shippingiti.runasp.net/api/:path*",
      },
    ];
  },

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;