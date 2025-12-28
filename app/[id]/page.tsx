// ▼ SSR（動的生成）を強制
export const dynamic = 'force-dynamic';

import { client } from "@/libs/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import * as cheerio from "cheerio";
import hljs from "highlight.js"; 
import { ShareButton } from "@/app/components/ShareButton";
import { Breadcrumb } from "@/app/components/Breadcrumb";

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

// 目次のデータ型
type TOC = {
  id: string;
  text: string;
  tag: string;
};

// 記事取得関数（draftKeyを受け取れるように変更）
async function getBlog(id: string, draftKey?: string) {
  try {
    const data = await client.get({
      endpoint: "blogs",
      contentId: id,
      // ▼ 下書きキーがあればクエリに追加する
      queries: draftKey ? { draftKey } : undefined,
    });
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// メタデータ生成（ここも下書き対応は可能ですが、簡易化のため公開データのみ参照にします）
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await Promise.resolve(params);
  const rawData: any = await getBlog(id);
  const blog = rawData?.contents ? rawData.contents[0] : rawData;

  if (!blog) {
    return { title: "記事が見つかりません" };
  }

  return {
    title: blog.title,
    description: "おーたログの記事です",
    openGraph: {
      title: blog.title,
      description: "おーたログの記事です",
      images: [blog.eyecatch?.url || ""], 
    },
  };
}

// ▼ searchParams（クエリパラメータ）を受け取る設定を追加
export default async function BlogPostPage({ 
  params, 
  searchParams 
}: { 
  params: { id: string }, 
  searchParams: { draftKey?: string } 
}) {
  const { id } = await Promise.resolve(params);
  const { draftKey } = await Promise.resolve(searchParams);
  
  // getBlogにdraftKeyを渡す
  const rawData: any = await getBlog(id, draftKey);

  if (!rawData) {
    notFound();
  }

  const blog = rawData.contents ? rawData.contents[0] : rawData;

  if (!blog || !blog.title) {
    notFound();
  }

  // ▼▼▼ 目次生成ロジック ▼▼▼
  const $ = cheerio.load(blog.content);
  const headings = $("h2, h3").toArray();
  const toc: TOC[] = headings.map((data: any) => ({
    text: $(data).text(),
    id: $(data).text(),
    tag: data.tagName,
  }));

  $("h2, h3").each((_, elm) => {
    $(elm).attr("id", $(elm).text());
  });

// ▼▼▼ ここから追加（コードブロックの色付け） ▼▼▼
  $('pre code').each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass('hljs');
  });
  // ▲▲▲ ここまで追加 ▲▲▲
  
  const contentWithId = $.html();
  // ▲▲▲ 目次生成ロジック終了 ▲▲▲

  // ▼▼▼ パンくずリストのデータ作成 ▼▼▼
  const breadcrumbs = [
    { name: "HOME", path: "/" },
    // カテゴリがあれば真ん中に入れる
    ...(blog.category ? [{ name: blog.category.name, path: `/category/${blog.category.id}` }] : []),
    { name: blog.title }, // 最後に記事タイトル
  ];
  // ▲▲▲ ここまで追加 ▲▲▲

  return (
    <main className="max-w-3xl mx-auto p-8 font-sans">
      
      {/* ▼▼▼ ここに表示！ ▼▼▼ */}
      <Breadcrumb lists={breadcrumbs} />
      
      {/* ▼ プレビュー中であることを表示するバー */}
      {draftKey && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8" role="alert">
          <p className="font-bold">プレビューモード</p>
          <p>現在は下書きを表示しています。</p>
        </div>
      )}

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

      {/* カテゴリバッジ */}
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

      {/* 目次 */}
      {toc.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
          <p className="font-bold mb-4 text-lg">目次</p>
          <ul className="space-y-2">
            {toc.map((item) => (
              <li key={item.id} className={item.tag === "h3" ? "ml-6 list-disc" : ""}>
                <a 
                  href={`#${item.id}`} 
                  className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: contentWithId }} 
      />
      <ShareButton id={blog.id} title={blog.title} />
    </main>
  );
}