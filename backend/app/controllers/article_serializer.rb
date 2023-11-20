class ArticleSerializer < ApplicationSerializer
  attributes :id,
             :title,
             :slug,
             :created_at

  # `with_is_mine: true` が指定されたときに表示するフィールド
  attribute :body_markdown, if: proc { |_object, params|
    params[:edit].present?
  }
end
