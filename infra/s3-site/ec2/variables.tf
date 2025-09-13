variable "region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "public_key_path" {
  description = "Path to SSH public key"
  type        = string
  default     = "C:\\Users\\Vignesh M\\.ssh\\id_rsa.pub" # Windows path
}

variable "app_name" {
  description = "Name tag for the EC2 instance"
  type        = string
  default     = "todo-backend"
}
