// ▼ ビルド時のエラーを避けるために、動的レンダリングを強制する
export const dynamic = 'force-dynamic';

import { client } from "@/libs/client";
import Link from "next/link";
import Image from "next/image";
import { Pagination, PER_PAGE } from "@/app/components/Pagination"; // ▼ 部品を読み込み

// 記事データの型定義
type Article = {
  id: string;
  title: string;
  publishedAt: string;
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
  // 他に必要なフィールドがあればここに追加
  [key: string]: any; 
};

// microCMSから記事一覧を取得（件数制限付き）
async function getBlogs() {
  const data = await client.get({
    endpoint: "blogs",
    queries: {
      offset: 0,
      limit: PER_PAGE, // ▼ 6件だけ取得
    },
  });
  return data;
}

export default async function Home() {
  // const data = await getBlogs();
  // 1. ブログデータを取得
  // (A) ブログのデータを取得
  const blogsData = await client.get({ 
    endpoint: "blogs",
    queries: { limit: 4 } // 必要に応じて件数制限など
  });

  // (B). 読書記録データを取得（※まだAPIやデータがない場合は空配列にするか、コメントアウトでOK）
  // const booksData = await client.get({ endpoint: "reading-logs" });

  // ------------------------------------------------
  // 2. データの整形・統合（★ご質問の箇所）
  // ------------------------------------------------
  const contents = [
    // (A) ブログデータ： basePath: "/blog" を付与
    ...blogsData.contents.map((article: Article) => ({
      ...article,
      basePath: "/blog", 
    })),

    // (B) 読書記録データ： basePath: "/reading-log" を付与（※準備完了後に有効化）
    /*
    ...booksData.contents.map((article: Article) => ({
      ...post,
      basePath: "/reading-log",
    })),
    */
  ];

  // ------------------------------------------------
  // 3. 日付順に並び替え（新しい順）
  // ------------------------------------------------
  contents.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-bold mb-12 text-center">Tech Auto Log</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contents.map((article) => (
          <Link 
            key={article.id} 
            href={`${article.basePath}/${article.id}`}
            className="block p-6 border rounded-lg hover:shadow-md transition-shadow bg-white"
          >
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white h-full flex flex-col">
              
              {article.eyecatch && (
                <div className="mb-4 overflow-hidden rounded-md">
                  <Image
                    src={article.eyecatch.url}
                    width={500}
                    height={300}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600">
                {article.title}
              </h2>
              
              <div className="text-gray-500 text-sm mt-auto">
                <span suppressHydrationWarning>
                  {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ▼ ページネーションボタンを表示 */}
      <Pagination totalCount={blogsData.totalCount} />
    </main>
  );
}