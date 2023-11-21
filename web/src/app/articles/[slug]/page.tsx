import { getArticle, getArticles } from "@requests/articles";
import { formatDate } from "@utils/dayjs";
import "zenn-content-css";
import markdownToHtml from "zenn-markdown-html";

// このファイルではキャッシュ無効
// refs: https://www.boag.online/notepad/post/how-to-stop-next-js-app-router-api-endpoint-caching
export const revalidate = 0;

export default async function Page({ params }: { params: { slug: string } }) {
  const { article } = await getArticle({ slug: params.slug });
  const html = markdownToHtml(article.bodyMarkdown);
  return (
    <main>
      <nav className="flex items-end justify-between h-[48px]">
        <a href="/articles" className="text-xl font-bold">
          Xenn
        </a>
        {/* <a
          href={`/articles/${article.slug}/edit`}
          className="text-md font-bold bg-purple-700 px-4 py-2 rounded-sm"
        >
          編集する
        </a> */}
      </nav>
      <div className="mt-24">
        <h2 className="text-4xl font-bold py-4">{article.title}</h2>
        <p className={`text-lg text-gray-400`}>
          {formatDate(article.createdAt, { format: "YYYY年MM月DD日" })}
          に作成
        </p>
      </div>
      <article className="mt-16 pb-64">
        <div
          className="znc bg-gray-700 p-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </main>
  );
}
