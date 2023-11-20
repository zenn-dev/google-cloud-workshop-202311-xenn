import * as fetch from "@utils/fetch";

export type ArticleMeta = {
  id: number;
  slug: string;
  title: string;
  createdAt: Date;
};

export type Article = ArticleMeta & {
  bodyMarkdown: string;
};

export type GetArticlesResponse = {
  articles: ArticleMeta[];
};
export async function getArticles(): Promise<GetArticlesResponse> {
  return await fetch.get<GetArticlesResponse>(`/articles`);
}

export type GetArticleResponse = {
  article: Article;
};
export async function getArticle(param: {
  slug: string;
}): Promise<GetArticleResponse> {
  return await fetch.get<GetArticleResponse>(`/articles/${param.slug}`);
}
