import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プロフィール",
  description: "Tech Auto Logの管理人プロフィール",
};

export default function ProfilePage() {
  return (
    <main className="max-w-3xl mx-auto p-8 font-sans">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        
        {/* ▼ ヘッダー部分：画像と名前 */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="relative w-32 h-32 flex-shrink-0">
            {/* Step 1で入れた画像を表示（ファイル名が違う場合は修正してください） */}
            <Image
              src="/avatar.jpg" 
              alt="プロフィール画像"
              fill
              className="rounded-full object-cover border-4 border-gray-100"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">Jun@3</h1>
            <p className="text-gray-600">Project manager / Enterprise Architecht</p>
          </div>
        </div>

        {/* ▼ 自己紹介文 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">About Me</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            はじめまして！「Tech Auto Log」を運営しています。
            テクノロジーとビジネスを中心に日々、学んだことを整理してアウトプットしています。
          </p>
          <p className="text-gray-700 leading-relaxed">
            情報科学修士。エンジニア、PM→マーケ（CMO/事業責任者）→外資コンサルファームのシニア・マネージャーを経て、
            現在はデジタルファームで大型案件中心に、Biz＆システムの企画・構想から実装・導入までのプロマネ
          </p>
        </section>

        {/* ▼ スキルセット */}
        <section className="mb-8">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {/* 自分のスキルに合わせて書き換えてください */}
            {["プロジェクトマネジメント", "事業開発", "BPR", "Enterprise Architecture"].map((skill) => (
              <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* ▼ リンク（SNSなど） */}
        <section>
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Links</h2>
          <ul className="space-y-2 text-blue-600">
            <li>
              <a href="https://github.com/junminya" target="_blank" rel="noopener noreferrer" className="hover:underline">
                GitHub (@junminya)
              </a>
            </li>
          </ul>
        </section>

      </div>
    </main>
  );
}