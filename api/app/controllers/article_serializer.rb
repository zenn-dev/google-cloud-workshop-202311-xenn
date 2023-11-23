class ArticleSerializer < ApplicationSerializer
  attributes :id,
             :title,
             :slug,
             :created_at

  attribute :body_markdown, if: proc { |_object, params|
    params[:edit].present?
  }

  attribute :body_html, if: proc { |_object, params|
    params[:detail].present?
  }
end
