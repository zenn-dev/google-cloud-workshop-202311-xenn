class ArticlesController < ApplicationController
  def index
    articles = Article.all.order(created_at: :desc)
    render json: { articles: ArticleSerializer.new(articles).to_h }
  end

  def show
    article = Article.find_by(slug: params[:slug])
    render json: { article: ArticleSerializer.new(article, params: { edit: true }).to_h }
  end

  def new
    create_params = article_params.merge(slug: SecureRandom.hex(10))

    if Article.new(**create_params).save
      render json: { message: "success" }, status: :ok
    else
      render json: { message: "error" }, status: :internal_server_error
    end
  end

  private

  def article_params
    params.require(:article).permit(:title, :body_markdown)
  end
end
