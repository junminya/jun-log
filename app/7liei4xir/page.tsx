// ▼ SSR（動的生成）を強制
export const dynamic = 'force-dynamic';

import { client } from "@/libs/client";
import { notFound } from "next/navigation";
import Image from "next/image"; // ▼ 画像最適化コンポーネント

// 記事データの型定義
type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  content: string;
  // ▼ 画像用の型を追加
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
};

async function getBlog(id: string) {
  try {
    const data = await client.get({
      endpoint: "blogs",
      contentId: id, 
    });
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  
  const rawData: any = await getBlog(id);

  if (!rawData) {
    notFound();
  }

  const blog = rawData.contents ? rawData.contents[0] : rawData;

  if (!blog || !blog.title) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-8 font-sans">
      {/* アイキャッチ画像があれば表示 */}
      {blog.eyecatch && (
        <div className="mb-8">
          <Image
            src={blog.eyecatch.url}
            width={blog.eyecatch.width}
            height={blog.eyecatch.height}
            alt="アイキャッチ画像"
            className="rounded-lg w-full h-auto object-cover"
            priority // 最初に表示される重要な画像なので優先読み込み
          />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      
      <div className="text-gray-500 text-sm mb-8">
        <span suppressHydrationWarning>
           {blog.publishedAt && new Date(blog.publishedAt).toLocaleDateString("ja-JP")}
        </span>
      </div>

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content || "" }} 
      />
    </main>
  );
}
