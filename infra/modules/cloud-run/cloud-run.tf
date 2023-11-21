# Variables
variable "gcp_project_id" {
  description = "GCPのproject_idです"
  type        = string
}

# CloudRunを実行するサービスアカウント
resource google_service_account backend_runner {
  project = var.gcp_project_id
  account_id = "xenn-cloud-run-runner"
  display_name = "Cloud Run Service Account"
}

# Cloud SQL Client
resource "google_project_iam_member" "backend_runner_cloudsql_client" {
  project = var.gcp_project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.backend_runner.email}"
}

resource "google_project_iam_member" "secret_accessor_member" {
  project = var.gcp_project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.backend_runner.email}"
}

output "backend_runner_service_account" {
  value = google_service_account.backend_runner.email
}
