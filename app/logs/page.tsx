// ▼ ビルドエラー回避のため、ここでもSSR（動的生成）を強制します
export const dynamic = 'force-dynamic';

import { client } from "@/libs/client";
import { notFound } from "next/navigation";

// 記事データの型定義
type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  content: string; // HTMLとして返ってきます
};

// microCMSから特定の記事IDのデータを取得する関数
async function getBlog(id: string) {
  try {
    const data = await client.get({
      endpoint: "blogs",
      contentId: id,
    });
    return data as Blog;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ページ本体
export default async function BlogPostPage({ params }: { params: { id: string } }) {
  // params は Promise なので await する必要がある場合があります（Next.jsのバージョンによる）
  // 最新版では params を直接使えますが、念のため非同期として扱います
  const { id } = await Promise.resolve(params); 

  const blog = await getBlog(id);

  // 記事が見つからなかったら404ページへ
  if (!blog) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      
      <div className="text-gray-500 text-sm mb-8">
        公開日: {new Date(blog.publishedAt).toLocaleDateString()}
      </div>

      {/* microCMSから返ってくるのはHTMLなので、dangerouslySetInnerHTMLで表示します 
        prose クラスは Tailwind Typography (後で導入推奨) 用ですが、今はなくてOK
      */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />
    </main>
  );
}
