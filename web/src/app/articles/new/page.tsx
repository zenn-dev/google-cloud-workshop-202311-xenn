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
    <main className="flex flex-col gap-24">
      <nav className="flex items-end justify-between h-[48px]">
        <a href="/articles" className="text-xl font-bold">
          Xenn
        </a>
      </nav>
      <Editor article={null} slug={null} />
    </main>
  );
}
