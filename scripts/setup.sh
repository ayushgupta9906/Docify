#!/bin/bash

# Docify - Quick Start Script

echo "=================================="
echo "Docify - Quick Start"
echo "=================================="

# Check if .env exists
if [ ! -f .env ]; then
  echo "Creating .env file from template..."
  cp .env.example .env
  echo "✅ .env created. Please configure it before production use."
fi

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
npm install

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Build applications
echo ""
echo "Building applications..."
echo "Building frontend..."
npm run build

echo "Building backend..."
cd backend
npm run build
cd ..

# Create directories
echo ""
echo "Creating required directories..."
mkdir -p uploads/temp uploads/results logs backend/logs

echo ""
echo "=================================="
echo "✅ Build completed successfully!"
echo "=================================="

echo ""
echo "Next steps:"
echo "1. Configure .env file with your settings"
echo "2. Install system dependencies: sudo ./scripts/install-dependencies.sh"
echo "3. Start with PM2: pm2 start ecosystem.config.js"
echo "4. Or run in development: npm run dev"
