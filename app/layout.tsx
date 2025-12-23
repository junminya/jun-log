import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link"; // ▼ リンク機能を追加

const inter = Inter({ subsets: ["latin"] });

// ▼ SEO設定（以前の設定を維持）
export const metadata: Metadata = {
  title: {
    template: '%s | My super blog',
    default: 'My super blog',
  },
  description: "Next.jsとmicroCMSで作った高速サイト",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "My super blog",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} text-gray-800`}>
        {/* ▼ 画面全体を縦並びの箱にする */}
        <div className="flex flex-col min-h-screen">
          
          {/* ▼ ヘッダー（全ページ共通） */}
          <header className="bg-gray-900 text-white shadow-md">
            <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
              <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
                My Super Blog
              </Link>
              {/* 将来ここにメニュー（Aboutなど）を追加できます */}
            </div>
          </header>

          {/* ▼ メインコンテンツ（記事の中身が入る場所） */}
          <main className="flex-grow">
            {children}
          </main>

          {/* ▼ フッター（全ページ共通） */}
          <footer className="bg-gray-100 text-center py-6 mt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} My super blog. All rights reserved.
            </p>
          </footer>

        </div>
      </body>
    </html>
  );
}