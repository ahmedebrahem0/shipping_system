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

  // الكود ده هيخلي أي طلب بيبدأ بـ /api يروح للسيرفر بتاعك من غير مشكلة Mixed Content
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://shippingiti.runasp.net/api/:path*",
      },
    ];
  },

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;