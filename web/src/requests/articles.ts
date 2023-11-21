import * as fetch from "@utils/fetch";

export type ArticleMeta = {
  id: number;
  slug: string;
  title: string;
  createdAt: Date;
};

export type Article = ArticleMeta & {
  bodyHtml: string;
};
export type ArticleEdit = Article;

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

export type PostArticleParams = {
  title: string;
  bodyMarkdown: string;
};
type PostArticleResponse = {
  article: Article;
};
export async function postArticle(
  param: PostArticleParams
): Promise<PostArticleResponse> {
  return fetch.post<PostArticleParams, PostArticleResponse>(`/articles`, param);
}

export type GetArticleEditResponse = {
  article: ArticleEdit;
};
export async function getArticleEdit(param: {
  slug: string;
}): Promise<GetArticleEditResponse> {
  return await fetch.get<GetArticleResponse>(`/articles/${param.slug}/edit`);
}

export type PutArticleParams = {
  article: { title: string; bodyMarkdown: string };
  slug: string;
};
export async function putArticle(param: PutArticleParams): Promise<void> {
  fetch.put<PostArticleParams>(`/articles/${param.slug}`, param.article);
}
