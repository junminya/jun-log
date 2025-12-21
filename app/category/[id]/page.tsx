import { client } from "@/libs/client";
import Link from "next/link";
import Image from "next/image";

// ▼ 常に最新データを取得
export const dynamic = 'force-dynamic';

type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  eyecatch?: { url: string; height: number; width: number };
  category?: { id: string; name: string };
};

// カテゴリIDで記事を絞り込んで取得
async function getBlogsByCategory(categoryId: string) {
  try {
    const data = await client.get({
      endpoint: "blogs",
      // ▼ 修正点: 記号を取り除きました
      queries: { filters: `category[equals]${categoryId}` },
    });
    return data;
  } catch (error) {
    return null;
  }
}

// カテゴリ自体の名前（「技術」など）を取得
async function getCategory(id: string) {
  try {
    const data = await client.get({
      endpoint: "categories",
      contentId: id,
    });
    return data;
  } catch (e) {
    return null;
  }
}

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  
  // 記事データとカテゴリ名を同時に取得
  const [data, categoryData] = await Promise.all([
    getBlogsByCategory(id),
    getCategory(id)
  ]);

  if (!data || data.contents.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">記事が見つかりません</h1>
        <p className="text-gray-600">このカテゴリにはまだ記事が投稿されていません。</p>
        <Link href="/" className="text-blue-600 hover:underline mt-6 inline-block">
          トップページへ戻る
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center border-b pb-4">
        「{categoryData?.name || "カテゴリ"}」の記事一覧
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.contents.map((blog: Blog) => (
          // ▼ 修正点: ここも記号を取り除きました
          <Link href={`/${blog.id}`} key={blog.id} className="block group">
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white h-full flex flex-col">
              {blog.eyecatch && (
                <div className="mb-4 overflow-hidden rounded-md">
                  <Image
                    src={blog.eyecatch.url}
                    width={500}
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