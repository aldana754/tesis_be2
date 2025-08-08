#!/bin/bash

# Railway Build Script
echo "🚀 Starting Railway deployment build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
  echo "❌ Build failed - dist directory not found"
  exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build output:"
ls -la dist/

echo "🌱 Ready for deployment!"
