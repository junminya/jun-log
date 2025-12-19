/** @type {import('next').NextConfig} */
const nextConfig = {
  // ▼ Docker化（Cloud Run）に必須の設定
  output: 'standalone', 
  
  // ▼ 画像最適化の設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
  },
};

export default nextConfig;
