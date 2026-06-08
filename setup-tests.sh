#!/bin/bash

# Setup testing environment for the project
# This script helps set up and run tests in the project

echo "=== Smart Bottle Waste Bank - Testing Setup ===="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "📋 Testing commands:"
echo "  1. Run all tests:"
echo "     pnpm test"
echo ""
echo "  2. Run tests in watch mode:"
echo "     pnpm test:watch"
echo ""
echo "  3. Run tests with coverage:"
echo "     pnpm test:coverage"
echo ""
echo "  4. Run tests for specific file:"
echo "     pnpm test -- bottle-classifier.test.ts"
echo ""
echo "  5. Run tests with verbose output:"
echo "     pnpm test -- --verbose"
echo ""
echo "✨ Testing setup complete!"
