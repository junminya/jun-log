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
    <div className="font-sans text-stone-800 max-w-3xl mx-auto py-8">
      
      {/* Header: 雑誌の見出しのようなレイアウト */}
      <header className="mb-12 text-center">
        <p className="text-stone-500 font-serif italic mb-2">Reading Log / {blog.finishedAt ? new Date(blog.finishedAt).toLocaleDateString() : "-"}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">
          {blog.bookTitle || blog.title}
        </h1>
        <p className="text-sm text-stone-600 mb-8">by {blog.author}</p>
        
        <div className="inline-block relative">
          <span className="absolute -inset-1 bg-yellow-200 transform -skew-y-2 rounded-sm" aria-hidden="true"></span>
          <p className="relative px-2 py-1 text-xl font-bold text-stone-900">
            {blog.oneLineConclusion}
          </p>
        </div>
      </header>

      {/* 1. Context & 2. Summary */}
      <div className="space-y-8 mb-16">
        <section className="prose prose-stone prose-lg mx-auto">
          <h2 className="font-serif italic text-2xl text-stone-900">Context</h2>
          <div dangerouslySetInnerHTML={{ __html: blog.context || "" }} />
        </section>

        {blog.summary3 && (
          <section className="bg-stone-100 p-8 rounded-tl-3xl rounded-br-3xl">
            <h2 className="font-bold text-stone-900 mb-6 text-center text-lg tracking-widest uppercase">Summary</h2>
            <ul className="space-y-4">
              {blog.summary3.map((item: any, i: number) => (
                <li key={i} className="text-lg font-medium leading-relaxed text-stone-800 text-center">
                  <span className="text-yellow-600 font-bold mr-2">✦</span>
                  {item.text || item}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <hr className="border-stone-200 mb-16 w-1/2 mx-auto" />

      {/* 3. Takeaways: 引用のようなデザイン */}
      {blog.takeaways && (
        <section className="mb-16">
          <h2 className="font-serif italic text-3xl text-stone-900 mb-8 text-center">Key Takeaways</h2>
          <div className="space-y-12">
            {blog.takeaways.map((t: Takeaway, i: number) => (
              <div key={i} className="relative pl-6 md:pl-0">
                {/* 装飾線 */}
                <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-stone-300"></div>
                <div className="hidden md:block absolute left-[-4px] top-6 w-2 h-2 rounded-full bg-stone-400"></div>
                
                <div className="md:pl-12">
                   <h3 className="text-xl font-bold text-stone-900 mb-3">{t.heading}</h3>
                   <div className="bg-yellow-50/50 border-l-4 border-yellow-300 p-4 mb-4">
                     <p className="text-lg font-bold text-stone-800">{t.claim}</p>
                   </div>
                   <p className="text-stone-600 text-sm mb-2">Evidence: {t.evidence}</p>
                   <p className="text-stone-700 italic font-medium">“ {t.interpretation} ”</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Actions */}
      {blog.actions && (
        <section className="mb-16">
          <h2 className="font-serif italic text-2xl text-stone-900 mb-6">Next Actions</h2>
          <div className="border-t-2 border-b-2 border-stone-900 py-6">
            <ul className="grid gap-4">
              {blog.actions.map((action: Action, i: number) => (
                <li key={i} className="flex items-baseline gap-4">
                  <span className="font-mono text-stone-400">0{i+1}</span>
                  <div>
                    <span className="text-xs font-bold border border-stone-800 px-2 py-0.5 rounded-full mr-2">
                      {action.type[0]}
                    </span>
                    <span className="font-medium text-lg decoration-stone-300 underline underline-offset-4">{action.task}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="text-center">
         {/* AssumptionsやLogは控えめに配置 */}
         <div className="prose prose-sm prose-stone mx-auto text-stone-500" dangerouslySetInnerHTML={{ __html: blog.assumptions || "" }} />
      </section>
    </div>
  );
};