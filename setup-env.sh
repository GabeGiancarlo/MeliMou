#!/bin/bash

echo "🍯 Setting up MeliMou Environment Variables..."

# Create .env.local file for development
cat > .env.local << 'EOF'
# Database
DATABASE_URL="file:./sqlite.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-for-development-only-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional - uncomment and add real credentials when needed)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# FACEBOOK_CLIENT_ID=""
# FACEBOOK_CLIENT_SECRET=""
# INSTAGRAM_CLIENT_ID=""
# INSTAGRAM_CLIENT_SECRET=""
# TWITTER_CLIENT_ID=""
# TWITTER_CLIENT_SECRET=""
# LINKEDIN_CLIENT_ID=""
# LINKEDIN_CLIENT_SECRET=""

# Stripe (for payments - optional)
# STRIPE_SECRET_KEY=""
# STRIPE_WEBHOOK_SECRET=""
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# Development settings
NODE_ENV="development"
EOF

echo "✅ Environment file created at .env.local"
echo "🔧 You can now run the development server with proper authentication!"
echo ""
echo "🚀 Quick Start:"
echo "   1. npm run dev"
echo "   2. Open http://localhost:3000/auth/signin"
echo "   3. Use your admin credentials:"
echo "      Email: gabe@melimou.com"
echo "      Password: admin123"
echo ""
echo "🔐 Remember to change your admin password after first login!" 