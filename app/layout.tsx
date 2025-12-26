import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google"; // ▼ 追加

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Tech Auto Log',
    default: 'Tech Auto Log',
  },
  description: "Tech Auto Log made by Next.js& microCMS",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Tech Auto Log",
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
        <div className="flex flex-col min-h-screen">
          
          <header className="bg-gray-900 text-white shadow-md">
            <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
              <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
                Tech Auto Log
              </Link>
              {/* ▼ ここに追加：プロフィールへのリンク */}
              <nav>
                <Link href="/profile" className="text-sm font-medium hover:text-gray-300 transition-colors">
                  Profile
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-gray-100 text-center py-6 mt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Tech Auto Log. All rights reserved.
            </p>
          </footer>

        </div>
        {/* ▼ Google Analyticsコンポーネントを追加 */}
        {/* 環境変数からIDを読み込みます */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}