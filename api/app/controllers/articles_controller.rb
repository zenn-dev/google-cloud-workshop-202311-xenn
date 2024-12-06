class ArticlesController < ApplicationController
  def index
    articles = Article.all.order(created_at: :desc)
    render json: { articles: ArticleSerializer.new(articles).to_h }
  end

  def show
    article = Article.find_by(slug: params[:slug])
    render json: { article: ArticleSerializer.new(article, params: { detail: true }).to_h }
  end

  def edit
    article = Article.find_by(slug: params[:slug])
    render json: { article: ArticleSerializer.new(article, params: { edit: true }).to_h }
  end

  def create
    create_params = article_params.merge(slug: SecureRandom.hex(10))

    article = Article.new(**create_params)
    if article.save
      render json: { article: ArticleSerializer.new(article).to_h }
    else
      render json: { message: "error" }, status: :internal_server_error
    end
  end

  def update
    article = Article.find_by(slug: params[:slug])
    article.update(**article_params)
    render json: { article: ArticleSerializer.new(article, params: { edit: true }).to_h }
  end

  private

  def article_params
    params.require(:article).permit(:title, :body_markdown)
  end
end
