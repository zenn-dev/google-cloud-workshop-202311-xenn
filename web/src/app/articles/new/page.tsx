import dynamic from "next/dynamic";
import { getArticles, postArticle } from "@requests/articles";
import { formatDate } from "@utils/dayjs";

const Editor = dynamic(() => import("@components/Editor"), {
  ssr: false,
});

// このファイルではキャッシュ無効
// refs: https://www.boag.online/notepad/post/how-to-stop-next-js-app-router-api-endpoint-caching
export const revalidate = 0;

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-24 py-8">
      <div className="container mx-auto px-64 flex flex-col gap-24">
        <nav className="">
          <a href="/articles" className="text-xl font-bold">
            Xenn
          </a>
        </nav>
        <Editor article={null} slug={null} />
      </div>
    </main>
  );
}
