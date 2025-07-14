#!/bin/bash

# Build script for Music Player
echo "Building Music Player..."

# Create public directory if it doesn't exist
mkdir -p public

# Copy main files to public directory
cp index.html public/
cp styles.css public/
cp script.js public/
cp sw.js public/

# Create assets directory in public
mkdir -p public/assets

echo "Build completed successfully!"
echo "Files copied to public directory:"
echo "- index.html"
echo "- styles.css"
echo "- script.js"
echo "- sw.js"
echo ""
echo "Deploy the 'public' directory to your hosting platform."
