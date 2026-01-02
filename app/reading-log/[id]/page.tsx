import { client } from "@/libs/client";
import { notFound } from "next/navigation";
// もし BookReview コンポーネントがまだない場合は、ここを一旦コメントアウトし、
// 下の return 内を simple な <div>{post.title}</div> などに書き換えてください。
import { ShareButton } from "@/app/components/ShareButton";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { BookReview } from "@/app/components/BookReview";

// ★ここが重要：microCMSのエンドポイントIDと完全に一致させる
const ENDPOINT = "reading-logs"; 

// 1. 静的パスの生成（SSG用）
export async function generateStaticParams() {
  // ブログではなく、必ず「読書記録」の一覧を取得する
  const { contents } = await client.get({ endpoint: ENDPOINT });
  
  return contents.map((post: any) => ({
    id: post.id,
  }));
}

// 2. ページ本体
export default async function ReadingLogPage({ 
  params }: { 
params: Promise<{ id: string }>  // ★型をPromiseで包む
}) {

  // ★awaitして取り出す
  const { id } = await params;

  const post = await client.get({
    endpoint: ENDPOINT,
    contentId: id,
  }).catch(() => null);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fdfbf7]">
       {/* 読書記録専用のデザインコンポーネントを表示 */}
       <BookReview blog={post} />
    </main>
  );
}