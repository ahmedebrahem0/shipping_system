import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false, // Use true for permanent (301), false for temporary (302)
      },
    ];
  },

  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,
};

export default nextConfig;
