resource "aws_key_pair" "backend-project" {
  key_name   = "backend-project"
  public_key = file("C:/Users/Vignesh M/.ssh/id_rsa.pub") # Windows path
}

resource "aws_security_group" "backend_sgg" {
  name = "backend-sgg"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # ⚠️ for learning only
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical official Ubuntu
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
}

resource "aws_instance" "backend" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.backend_sgg.id]

  user_data = <<-EOF
              #!/bin/bash
              # Update system
              sudo apt-get update -y

              # Install Node.js LTS
              curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
              sudo apt-get install -y nodejs

              # Install PM2
              sudo npm install -g pm2

              # Create app directory
              mkdir -p /home/ubuntu/app
              chown ubuntu:ubuntu /home/ubuntu/app

              # Simple test app
              echo "console.log('✅ EC2 Backend running!')" > /home/ubuntu/app/index.js
              pm2 start /home/ubuntu/app/index.js --name backend-app
              pm2 startup systemd
              pm2 save
              EOF

  tags = {
    Name = "todo-backend"
  }
}

output "backend_ip" {
  value = aws_instance.backend.public_ip
}
