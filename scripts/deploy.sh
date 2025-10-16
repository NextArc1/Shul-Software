#!/bin/bash
# Quick Deploy Script for Shul Display
# Run this on your DigitalOcean droplet after initial setup

set -e  # Exit on error

echo "========================================"
echo "Shul Display - Quick Deployment Script"
echo "========================================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and configure it first:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi

echo "✓ Running from: $(pwd)"
echo "✓ .env file found"
echo ""

# Pull latest code
echo "📥 Pulling latest code from Git..."
git pull
echo "✓ Code updated"
echo ""

# Build React frontend
echo "⚛️  Building React frontend..."
cd frontend
npm install --silent
npm run build
cd ..
echo "✓ Frontend built"
echo ""

# Stop containers
echo "🛑 Stopping containers..."
docker-compose down
echo "✓ Containers stopped"
echo ""

# Build and start containers
echo "🐳 Building and starting Docker containers..."
docker-compose up -d --build
echo "✓ Containers started"
echo ""

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations
echo "🔄 Running database migrations..."
docker-compose exec -T django python manage.py migrate --noinput
echo "✓ Migrations complete"
echo ""

# Collect static files
echo "📦 Collecting static files..."
docker-compose exec -T django python manage.py collectstatic --noinput
echo "✓ Static files collected"
echo ""

# Show container status
echo "📊 Container Status:"
docker-compose ps
echo ""

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20
echo ""

echo "========================================"
echo "✅ Deployment Complete!"
echo "========================================"
echo ""
echo "Your application should now be running at:"
echo "  https://$(grep ALLOWED_HOSTS .env | cut -d'=' -f2 | cut -d',' -f1)"
echo ""
echo "Useful commands:"
echo "  View logs:     docker-compose logs -f"
echo "  Restart:       docker-compose restart"
echo "  Stop all:      docker-compose down"
echo "  Start all:     docker-compose up -d"
echo ""
