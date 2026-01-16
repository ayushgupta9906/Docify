#!/bin/bash

# Docify - System Dependencies Installation Script
# For Ubuntu/Debian-based Linux systems

set -e

echo "================================================"
echo "Docify - Installing System Dependencies"
echo "================================================"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run with sudo: sudo ./install-dependencies.sh"
  exit 1
fi

echo ""
echo "Updating package lists..."
apt-get update

echo ""
echo "Installing LibreOffice (headless)..."
apt-get install -y libreoffice libreoffice-writer libreoffice-calc libreoffice-impress --no-install-recommends

echo ""
echo "Installing Ghostscript..."
apt-get install -y ghostscript

echo ""
echo "Installing ImageMagick..."
apt-get install -y imagemagick

echo ""
echo "Installing Tesseract OCR..."
apt-get install -y tesseract-ocr tesseract-ocr-eng

# Optional: Install additional language packs for Tesseract
# apt-get install -y tesseract-ocr-spa tesseract-ocr-fra tesseract-ocr-deu

echo ""
echo "Installing MongoDB (optional - skip if using remote MongoDB)..."
read -p "Install MongoDB locally? (y/n): " install_mongo

if [ "$install_mongo" = "y" ] || [ "$install_mongo" = "Y" ]; then
  # Import MongoDB GPG key
  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

  # Add MongoDB repository
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list

  # Update and install
  apt-get update
  apt-get install -y mongodb-org

  # Start MongoDB
  systemctl start mongod
  systemctl enable mongod

  echo "MongoDB installed and started"
else
  echo "Skipping MongoDB installation"
fi

echo ""
echo "Installing Nginx (if not already installed)..."
if ! command -v nginx &> /dev/null; then
  apt-get install -y nginx
  echo "Nginx installed"
else
  echo "Nginx already installed"
fi

echo ""
echo "================================================"
echo "✅ All dependencies installed successfully!"
echo "================================================"

echo ""
echo "Verify installations:"
echo "  LibreOffice: $(libreoffice --version 2>&1 | head -n 1 || echo 'Not found')"
echo "  Ghostscript: $(gs --version 2>&1 || echo 'Not found')"
echo "  ImageMagick: $(convert --version 2>&1 | head -n 1 || echo 'Not found')"
echo "  Tesseract: $(tesseract --version 2>&1 | head -n 1 || echo 'Not found')"
echo "  MongoDB: $(mongod --version 2>&1 | head -n 1 || echo 'Not installed')"
echo "  Nginx: $(nginx -v 2>&1 || echo 'Not found')"

echo ""
echo "Next steps:"
echo "  1. Copy .env.example to .env and configure"
echo "  2. Install Node.js dependencies: npm install"
echo "  3. Build the application: npm run build"
echo "  4. Configure Nginx: sudo cp nginx/docify.conf /etc/nginx/sites-available/"
echo "  5. Start with PM2: pm2 start ecosystem.config.js"
