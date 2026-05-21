#!/bin/bash

# Agent Chat Platform - Quick Setup Script
# This script will set up your development environment

set -e  # Exit on error

echo "🚀 Agent Chat Platform - Quick Setup"
echo "======================================"
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
    echo "✅ pnpm installed successfully"
else
    echo "✅ pnpm is already installed"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
else
    echo "✅ Docker is running"
fi

echo ""
echo "📦 Installing dependencies..."
echo "------------------------------"

# Install root dependencies
pnpm install

# Install backend dependencies
cd apps/backend
pnpm install
cd ../..

echo "✅ Dependencies installed"
echo ""

# Setup environment files
echo "⚙️  Setting up environment files..."
echo "-----------------------------------"

if [ ! -f "apps/backend/.env" ]; then
    cp apps/backend/.env.example apps/backend/.env
    echo "✅ Created apps/backend/.env"
else
    echo "⚠️  apps/backend/.env already exists, skipping"
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env"
else
    echo "⚠️  .env already exists, skipping"
fi

echo ""
echo "🐳 Starting Docker containers..."
echo "--------------------------------"

docker-compose up -d

echo "✅ MongoDB and Redis are running"
echo ""

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 5

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Your backend is ready to run!"
echo ""
echo "Next steps:"
echo "1. Start the backend:"
echo "   pnpm dev:backend"
echo ""
echo "2. Open API documentation:"
echo "   http://localhost:3000/api/docs"
echo ""
echo "3. Test with sample requests:"
echo "   See QUICKSTART.md for examples"
echo ""
echo "Services running:"
echo "- MongoDB: localhost:27017"
echo "- Redis: localhost:6379"
echo ""
echo "To stop services: pnpm docker:down"
echo ""
