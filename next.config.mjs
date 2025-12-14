/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    // ビルド時の型エラーを無視する（デプロイ優先）
    ignoreBuildErrors: true,
  },
  eslint: {
    // ビルド時のLintエラーを無視する
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
