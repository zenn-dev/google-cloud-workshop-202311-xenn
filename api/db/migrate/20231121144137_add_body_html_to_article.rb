class AddBodyHtmlToArticle < ActiveRecord::Migration[7.1]
  def change
    add_column :articles, :body_html, :text
  end
end
