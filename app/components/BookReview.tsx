import { format } from "date-fns"; // 日付フォーマット用（npm install date-fns していれば）

type Takeaway = {
  heading: string;
  claim: string;
  evidence: string;
  interpretation: string;
};

type Action = {
  task: string;
  type: string[];
};

type Props = {
  blog: any; // 面倒ならany、厳密にやるならさっきのBlog型
};

export const BookReview = ({ blog }: Props) => {
  return (
    <div className="font-sans text-gray-800 space-y-12">
      
      {/* ヘッダー：書籍情報 */}
      <header className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex-1">
            {blog.bookTitle || blog.title}
          </h1>
          <div className="text-sm text-gray-500 text-right">
            <div>著：{blog.author}</div>
            <div>読了：{blog.finishedAt ? new Date(blog.finishedAt).toLocaleDateString() : "-"}</div>
          </div>
        </div>
        
        {/* 結論（1行） */}
        <div className="mt-4 bg-white p-4 rounded border-l-4 border-blue-600 shadow-sm">
          <p className="text-xs font-bold text-blue-600 mb-1">【結論】</p>
          <p className="text-lg font-bold">{blog.oneLineConclusion}</p>
        </div>
      </header>

      {/* 1. Why Now */}
      <section>
        <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4">1. なぜ今この本か（Context）</h2>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.context || "" }}
        />
      </section>

      {/* 2. 3行サマリー */}
      {blog.summary3 && (
        <section>
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4">2. 3行サマリー</h2>
          <ul className="list-decimal list-inside space-y-2 bg-yellow-50 p-6 rounded-lg text-lg font-medium text-gray-800">
            {/* microCMSの繰り返しフィールドの形式に合わせて調整してください */}
            {blog.summary3.map((item: any, i: number) => (
              <li key={i}>{item.text || item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 3. Key Takeaways */}
      {blog.takeaways && (
        <section>
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4">3. Key Takeaways</h2>
          <div className="grid gap-6">
            {blog.takeaways.map((t: Takeaway, i: number) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 font-bold border-b border-gray-200">
                  Takeaway {i + 1}：{t.heading}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <span className="font-bold text-blue-700 block text-sm">主張</span>
                    <p>{t.claim}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-600 block text-sm">根拠</span>
                    <p className="text-sm text-gray-600">{t.evidence}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <span className="font-bold text-blue-800 block text-sm">解釈・現場での意味</span>
                    <p className="text-blue-900 font-medium">{t.interpretation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. 前提条件 */}
      <section>
        <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4">4. 反論・前提・適用条件</h2>
        <div 
          className="prose max-w-none bg-gray-50 p-4 rounded"
          dangerouslySetInnerHTML={{ __html: blog.assumptions || "" }}
        />
      </section>

      {/* 5. Next Actions */}
      {blog.actions && (
        <section>
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4">5. Next Actions</h2>
          <div className="space-y-2">
            {blog.actions.map((action: Action, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50 transition">
                <input type="checkbox" className="mt-1.5 w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-xs font-bold text-white bg-gray-500 px-2 py-0.5 rounded mr-2">
                    {action.type[0]}
                  </span>
                  <span className="font-medium">{action.task}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. 実践ログ */}
      {blog.practiceLog && (
        <section>
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4">6. 実践ログ（追記）</h2>
          <div 
            className="prose max-w-none border-l-4 border-green-500 pl-4"
            dangerouslySetInnerHTML={{ __html: blog.practiceLog }}
          />
        </section>
      )}

      {/* 7. ターゲット */}
      {blog.targetRoles && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 mb-2">この記事のおすすめターゲット</h2>
          <div className="flex flex-wrap gap-2">
            {blog.targetRoles.map((role: string, i: number) => (
              <span key={i} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                {role}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};