# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

return if Article.count >= 5

Faker::Config.locale = 'ja'
3.times do |_i|
  Article.create!(
    title: Faker::Restaurant.name,
    slug:  SecureRandom.hex(7),
    body_markdown: Faker::Markdown.sandwich(sentences: 10, repeat: 5),
  )
end

Article.create!(
  title: "プロンプト",
  slug:  "prompt",
  body_markdown: File.read(Rails.root.join('db', 'prompt.md'))
)

Article.create!(
    title: "Google Cloud Next Tokyo ’23 で アプリ・生成AI・BigQueryあたりのセッションに参加したレポート",
    slug:  "google-cloud-next-tokyo-2023-report",
    body_markdown: File.read(Rails.root.join('db', 'google_cloud_next.md'))
  )
