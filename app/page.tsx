// ▼ ビルド時のエラーを避けるために、動的レンダリングを強制する
export const dynamic = 'force-dynamic';

import { client } from "@/libs/client";
import Link from "next/link";
import Image from "next/image";

// 記事データの型定義（一覧表示用）
type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
};

// microCMSから記事一覧を取得
async function getBlogs() {
  const data = await client.get({
    endpoint: "blogs",
  });
  return data;
}

export default async function Home() {
  const data = await getBlogs();

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-bold mb-12 text-center">My Super Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 記事の数だけ繰り返して表示 */}
        {data.contents.map((blog: Blog) => (
          <Link href={`/${blog.id}`} key={blog.id} className="block group">
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white h-full flex flex-col">
              
              {/* アイキャッチ画像がある場合のみ表示 */}
              {blog.eyecatch && (
                <div className="mb-4 overflow-hidden rounded-md">
                  <Image
                    src={blog.eyecatch.url}
                    width={500} // 一覧用なので適度なサイズ
                    height={300}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600">
                {blog.title}
              </h2>
              
              <div className="text-gray-500 text-sm mt-auto">
                <span suppressHydrationWarning>
                  {new Date(blog.publishedAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}