import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('slug');
  const draftKey = searchParams.get('draftKey');

  // IDがない場合はエラー
  if (!slug) {
    return new Response('Invalid slug', { status: 401 });
  }

  // 記事詳細ページへ、下書きキーを持った状態でリダイレクト
  // 例: /article-id?draftKey=abcdef12345
  redirect(`/${slug}?draftKey=${draftKey}`);
}