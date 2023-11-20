import { getArticleEdit } from "@requests/articles";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@components/Editor"), {
  ssr: false,
});

// このファイルではキャッシュ無効
// refs: https://www.boag.online/notepad/post/how-to-stop-next-js-app-router-api-endpoint-caching
export const revalidate = 0;

export default async function Page({ params }: { params: { slug: string } }) {
  const { article } = await getArticleEdit({ slug: params.slug });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-24 py-8">
      <div className="container mx-auto px-64 flex flex-col gap-24">
        <nav className="">
          <a href="/articles" className="text-xl font-bold">
            Xenn
          </a>
        </nav>
        <Editor article={article} slug={params.slug} />
      </div>
    </main>
  );
}
