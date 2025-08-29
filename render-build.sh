#!/bin/bash
# Exit on error
set -o errexit

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the frontend
echo "Building frontend..."
cd client
npm install
npm run build
cd ..

# Install production dependencies for the backend
echo "Installing production dependencies..."
npm install --production

# Create necessary directories
echo "Setting up directories..."
mkdir -p public
cp -r client/build/* public/

echo "Build completed successfully!"
