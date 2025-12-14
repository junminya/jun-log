// ▼ SSR（動的生成）を強制
export const dynamic = 'force-dynamic';

import { client } from "@/libs/client";
import { notFound } from "next/navigation";

// 記事データの型定義
type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  content: string; 
};

// microCMSから特定の記事を取得
async function getBlog(id: string) {
  try {
    const data = await client.get({
      endpoint: "blogs",
      contentId: id,
    });
    return data as Blog;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  // paramsの扱いをNext.jsの仕様に合わせて安全化
  const { id } = await Promise.resolve(params);

  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      
      <div className="text-gray-500 text-sm mb-8">
        {/* 日付がある場合のみ表示する安全策を追加 */}
        {blog.publishedAt && (
          <span>公開日: {new Date(blog.publishedAt).toLocaleDateString()}</span>
        )}
      </div>

      {/* ▼ ここが修正ポイント：カッコを二重 {{ }} にする */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />
    </main>
  );
}
