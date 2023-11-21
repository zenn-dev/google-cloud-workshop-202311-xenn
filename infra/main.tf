variable "gcp_project_id" {
  type = string
}
variable "primary_region" {
  type = string
}


terraform {
  backend "local" {
    path = ".tfstate/xenn"
  }
}

## project ##
provider "google" {
  project = var.gcp_project_id
  region  = var.primary_region
}

module "db" {
  source              = "./modules/cloud-sql"
  primary_region      = var.primary_region
}

## Cloud Run ##
module "cloud-run" {
  source         = "./modules/cloud-run"
  gcp_project_id = var.gcp_project_id
}


## Artifact Registry ##
module "artifact-registry" {
  source                     = "./modules/artifact-registry"
  gcp_project_id             = var.gcp_project_id
  artifact_registry_location = var.primary_region
}
