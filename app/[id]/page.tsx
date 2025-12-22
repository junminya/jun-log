// ▼ SSR（動的生成）を強制
export const dynamic = 'force-dynamic';

import { client } from "@/libs/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link"; // ★追加: リンク機能

type Category = {
  id: string;
  name: string;
};

type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  content: string;
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
  category?: Category;
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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await Promise.resolve(params);
  const rawData: any = await getBlog(id);
  const blog = rawData?.contents ? rawData.contents[0] : rawData;

  if (!blog) {
    return { title: "記事が見つかりません" };
  }

  return {
    title: blog.title,
    description: "My Super Blogの記事です",
    openGraph: {
      title: blog.title,
      description: "My Super Blogの記事です",
      images: [blog.eyecatch?.url || ""], 
    },
  };
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
      {/* アイキャッチ画像 */}
      {blog.eyecatch && (
        <div className="mb-8">
          <Image
            src={blog.eyecatch.url}
            width={blog.eyecatch.width}
            height={blog.eyecatch.height}
            alt="アイキャッチ画像"
            className="rounded-lg w-full h-auto object-cover"
            priority
          />
        </div>
      )}

      {/* ▼ カテゴリバッジをリンクに変更 */}
      {blog.category && (
        <div className="mb-2">
          <Link href={`/category/${blog.category.id}`}>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded hover:bg-blue-200 transition-colors cursor-pointer">
              {blog.category.name}
            </span>
          </Link>
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