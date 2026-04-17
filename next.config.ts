import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

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
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
