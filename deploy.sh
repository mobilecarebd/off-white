#!/bin/bash

# Install dependencies
npm install

# Build the application
npm run build

# Create a .env.production.local if it doesn't exist
if [ ! -f .env.production.local ]; then
  cp .env.production .env.production.local
fi

# Start the production server
npm run start