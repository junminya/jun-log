import React from 'react';

type Props = {
  id: string;
  title: string;
};

export const ShareButton = ({ id, title }: Props) => {
  // ▼ 変更点：環境変数からドメインを読み込む
  // 設定がない場合は localhost:3000 を使う（開発用）
  const domain = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  
  const url = `${domain}/${id}`;
  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="mt-12 border-t pt-8">
      <p className="font-bold mb-4 text-center">この記事をシェアする</p>
      <div className="flex justify-center">
        <a
          href={twitterLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
          X でポストする
        </a>
      </div>
    </div>
  );
};