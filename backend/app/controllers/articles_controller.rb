class ArticlesController < ApplicationController
  def index
    articles = Article.all.order(created_at: :desc)
    render json: { articles: ArticleSerializer.new(articles).to_h }
  end

  def show
    article = Article.find_by(slug: params[:slug])
    render json: { article: ArticleSerializer.new(article, params: { edit: true }).to_h }
  end
end
