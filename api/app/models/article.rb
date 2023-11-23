class Article < ApplicationRecord
  FUNCTION_URL = "https://asia-northeast1-zenn-dev-integration.cloudfunctions.net/markdownHtml".freeze

  before_save :set_body_html

  def set_body_html
    self.body_html = convert(body_markdown)
  end

  private

  def convert(markdown)
    if markdown.blank?
      ""
    else
      res = HTTP.headers(accept: "application/json")
                .post(
                  FUNCTION_URL,
                  json: { markdown: }
                )
      res.parse["html"]
    end
  end
end
