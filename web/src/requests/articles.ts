import * as fetch from "@utils/fetch";

export type ArticleMeta = {
  id: number;
  slug: string;
  title: string;
  createdAt: Date;
};

export type GetArticlesResponse = {
  articles: ArticleMeta[];
};
export async function getArticles(): Promise<GetArticlesResponse> {
  return await fetch.get<GetArticlesResponse>(`/articles`);
}
