#!/bin/bash

# Load environment variables from .env.local if it exists
if [ -f ".env.local" ]; then
  echo "📄 Loading environment variables from .env.local"
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ NEXT_PUBLIC_SUPABASE_URL is not set"
  echo "Please set it in your .env.local file or environment"
  exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ SUPABASE_SERVICE_ROLE_KEY is not set"
  echo "Please set it in your .env.local file or environment"
  exit 1
fi

echo "🚀 Running database population script..."
echo "Target User ID: 64702a46-9951-43e7-b4ab-076c66877b55"
echo ""

# Run the TypeScript script using tsx (or ts-node if available)
if command -v tsx &> /dev/null; then
  tsx data/scaffold/populate-db.ts
elif command -v npx &> /dev/null; then
  npx tsx data/scaffold/populate-db.ts
else
  echo "❌ tsx is not installed. Please install it with: pnpm add -D tsx"
  exit 1
fi 