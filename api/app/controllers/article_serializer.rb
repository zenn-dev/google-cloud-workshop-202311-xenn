class ArticleSerializer < ApplicationSerializer
  attributes :id,
             :title,
             :slug,
             :created_at

  attribute :body_markdown, if: proc { |_object, params|
    params[:edit].present?
  }
end
