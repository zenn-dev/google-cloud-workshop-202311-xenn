variable "primary_region" {
  type = string
}

resource "google_sql_database_instance" "xenn-db" {
  name                = "xenn-db"
  database_version    = "POSTGRES_14"
  region              = var.primary_region
  deletion_protection = false

  settings {
    tier              = "db-f1-micro"
    availability_type = "ZONAL"
    disk_size         = 10
    disk_type         = "PD_SSD"

    ip_configuration {
      ipv4_enabled = "true"
    }
  }
}
