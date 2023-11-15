class ArticlesController < ApplicationController
  def index
    articles = Article.all.order(created_at: :desc)
    render json: {articles: ArticleSerializer.new(articles).to_h}
  end
end
