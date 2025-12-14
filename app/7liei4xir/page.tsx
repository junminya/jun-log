// ▼ SSR（動的生成）を強制
export const dynamic = 'force-dynamic';

import { client } from "@/libs/client";
import { notFound } from "next/navigation";

// microCMSからデータを取得する関数
async function getBlog(id: string) {
  try {
    // API呼び出し: IDを指定して記事を取得
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
  
  // データを取得 (この時点ではリスト形式かもしれないし、単一かもしれない)
  const rawData: any = await getBlog(id);

  if (!rawData) {
    notFound();
  }

  // ▼▼▼ ここが修正の肝です！ ▼▼▼
  // もし "contents" という箱に入っていたら、その中身の1つ目を取り出す。
  // そうでなければ、そのままデータを使う。
  const blog = rawData.contents ? rawData.contents[0] : rawData;

  // 念の為、記事データが空っぽなら404へ
  if (!blog || !blog.title) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-8 font-sans">
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
