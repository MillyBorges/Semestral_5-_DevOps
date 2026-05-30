provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_container_cluster" "primary" {
  name     = "loja-veloz-cluster"
  location = var.region

  # Recomendado usar nodes preemptíveis para economia em ambientes de teste
  node_config {
    machine_type = "e2-medium"
    preemptible  = true
  }

  initial_node_count = 3
}

variable "project_id" {
  description = "ID do projeto na GCP"
}

variable "region" {
  default = "us-central1"
}
