import { client } from "@/libs/client";
import Link from "next/link";
import Image from "next/image";
import { Pagination, PER_PAGE } from "@/app/components/Pagination";
import { notFound } from "next/navigation";

// ▼ 動的レンダリングを強制
export const dynamic = 'force-dynamic';

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

// ページ番号に応じた記事を取得
async function getBlogs(current: number) {
  const data = await client.get({
    endpoint: "blogs",
    queries: {
      offset: (current - 1) * PER_PAGE, // ▼ ここでずらす件数を計算（例: 2ページ目なら6件ずらす）
      limit: PER_PAGE,
    },
  });
  return data;
}

export default async function Page({ params }: { params: { current: string } }) {
  const { current } = await Promise.resolve(params);
  const currentPage = parseInt(current, 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  const data = await getBlogs(currentPage);

  // 記事がないページに来たら404
  if (data.contents.length === 0) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-bold mb-12 text-center">おーたログ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.contents.map((blog: Blog) => (
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

      {/* ▼ 現在のページ番号を渡してボタンを表示 */}
      <Pagination totalCount={data.totalCount} current={currentPage} />
    </main>
  );
}