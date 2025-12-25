import Link from "next/link";

type Props = {
  totalCount: number;
  current?: number;
};

// 1ページあたりの記事数（重要！後で他のファイルとも数字を合わせます）
export const PER_PAGE = 6;

export const Pagination = ({ totalCount, current = 1 }: Props) => {
  const pages = [];
  const totalPage = Math.ceil(totalCount / PER_PAGE);

  // 記事が少なくて1ページで収まるなら、何も表示しない
  if (totalPage <= 1) return null;

  for (let i = 1; i <= totalPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center gap-2 mt-12">
      {pages.map((p) => (
        <Link
          key={p}
          href={p === 1 ? "/" : `/p/${p}`}
          className={`px-4 py-2 border rounded transition-colors ${
            p === current
              ? "bg-blue-600 text-white border-blue-600" // 現在のページ
              : "bg-white text-gray-700 hover:bg-gray-100" // その他のページ
          }`}
        >
          {p}
        </Link>
      ))}
    </div>
  );
};