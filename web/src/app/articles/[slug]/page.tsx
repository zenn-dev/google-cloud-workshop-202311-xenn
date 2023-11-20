import { getArticle, getArticles } from "@requests/articles";
import { formatDate } from "@utils/dayjs";
import "zenn-content-css";
import markdownToHtml from "zenn-markdown-html";

// このファイルではキャッシュ無効
// refs: https://www.boag.online/notepad/post/how-to-stop-next-js-app-router-api-endpoint-caching
export const revalidate = 0;

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getArticle({ slug: params.slug });
  const article = data.article;
  const html = markdownToHtml(article.bodyMarkdown);
  return (
    <main className="flex min-h-screen flex-col justify-between gap-64 pl-64 pr-64">
      <div className="flex flex-col gap-32">
        <nav className="pt-4">
          <a href="/articles" className="text-lg font-bold">
            もどる
          </a>
        </nav>
        <div className="flex flex-col gap-16 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left pb-64">
          <div>
            <h2 className="text-4xl font-bold">{article.title}</h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              {formatDate(article.createdAt, { format: "YYYY年MM月DD日" })}
              に作成
            </p>
          </div>
          <article>
            <div
              className="prose prose-lg znc"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>
        </div>
      </div>
    </main>
  );
}
