// 1. 先頭に Link をインポート
import Link from "next/link"; 

// ▼ この1行を追加（動的レンダリングを強制する設定）
export const dynamic = 'force-dynamic';
import { client } from "@/libs/client";

// 記事の型定義
type Blog = {
  id: string;
  title: string;
  content: string;
};

// microCMSからデータを取得する関数
async function getBlogList() {
  const data = await client.get({ endpoint: "blogs" });
  return data.contents as Blog[];
}

export default async function Home() {
  const blogs = await getBlogList();

  return (
    <main className="p-8 font-sans">
      <h1 className="text-4xl font-bold mb-8">My Super Blog</h1>
      
      <div className="grid gap-4">
      {blogs.map((blog) => (
        <Link href={`/${blog.id}`} key={blog.id} className="block group">
    	  <article key={blog.id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold">{blog.title}</h2>
          </article>
	</Link>
        ))}
      </div>
    </main>
  );
}
