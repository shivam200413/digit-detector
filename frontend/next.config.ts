import type { NextConfig } from "next";

// const isProd = process.env.NODE_ENV === 'production';
const nextConfig: NextConfig = {
  output: 'export', // Required for `next export`
  distDir: 'dist',
  images:{
    unoptimized:true,
  }
};

export default nextConfig;
