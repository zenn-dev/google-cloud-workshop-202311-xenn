variable "gcp_project_id" {
  type = string
}
variable "artifact_registry_location" {
  type = string
  # https://cloud.google.com/storage/docs/locations
  description = "Artifact Registry のロケーションをどこにするか"
}

# Xennアプリケーション用の Artifact Registry リポジトリ
resource "google_artifact_registry_repository" "xenn-repo" {
  project       = var.gcp_project_id
  location      = var.artifact_registry_location
  repository_id = "xenn-repo"
  description   = "XennアプリケーションのDockerリポジトリ"
  format        = "DOCKER"
}
