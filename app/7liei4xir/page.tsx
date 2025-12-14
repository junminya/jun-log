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
  // paramsの非同期解決
  const { id } = await Promise.resolve(params);

  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      
      <div className="text-gray-500 text-sm mb-8">
        {/* ▼ エラー回避の重要ポイント: 
          suppressHydrationWarning をつけることで、
          サーバー(UTC)とブラウザ(JST)で時間がズレていてもエラーにしないようにします 
        */}
        <span suppressHydrationWarning>
           {/* 日付が存在する場合のみ表示 */}
           {blog.publishedAt && new Date(blog.publishedAt).toLocaleDateString("ja-JP")}
        </span>
      </div>

      <div 
        className="prose prose-lg max-w-none"
        // ▼ 万が一 content が undefined だった場合に備えて || "" を追加
        dangerouslySetInnerHTML={{ __html: blog.content || "" }} 
      />
    </main>
  );
}
