#!/bin/bash

echo "🚀 Production Deployment Security Checklist"
echo "=========================================="

# Check environment variables
echo "1. Checking environment variables..."
if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET is not set"
    exit 1
fi

if [ ${#JWT_SECRET} -lt 64 ]; then
    echo "❌ JWT_SECRET is too short (minimum 64 characters)"
    echo "   Current length: ${#JWT_SECRET} characters"
    exit 1
fi

if [ -z "$GOOGLE_API_KEY" ]; then
    echo "❌ GOOGLE_API_KEY is not set"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set"
    exit 1
fi

echo "✅ Environment variables validated"

# Check for development values
echo "2. Checking for development values..."
if [[ "$JWT_SECRET" == *"your-super-secret"* ]] || [[ "$JWT_SECRET" == *"change-in-production"* ]]; then
    echo "❌ JWT_SECRET contains development placeholder"
    exit 1
fi

if [[ "$JWT_SECRET" == *"your-64-character"* ]]; then
    echo "❌ JWT_SECRET contains template placeholder"
    exit 1
fi

if [[ "$ALLOWED_ORIGINS" == *"localhost"* ]]; then
    echo "⚠️  Warning: ALLOWED_ORIGINS contains localhost"
    echo "   Consider removing localhost for production"
fi

echo "✅ Development values check completed"

# Check environment
echo "3. Checking environment configuration..."
if [ "$NODE_ENV" != "production" ]; then
    echo "❌ NODE_ENV is not set to 'production'"
    echo "   Current value: $NODE_ENV"
    exit 1
fi

echo "✅ Environment configuration validated"

# Check for .env files in production
echo "4. Checking for environment files..."
if [ -f ".env" ] || [ -f ".env.local" ] || [ -f ".env.production" ]; then
    echo "⚠️  Warning: Environment files found in production directory"
    echo "   Ensure these don't contain sensitive information"
fi

echo "✅ Environment files check completed"

# Validate configuration
echo "5. Running configuration validation..."
if command -v npm &> /dev/null; then
    npm run validate-env
    if [ $? -ne 0 ]; then
        echo "❌ Configuration validation failed"
        exit 1
    fi
else
    echo "⚠️  npm not found, skipping configuration validation"
fi

echo "✅ Configuration validation completed"

# Security checklist
echo "6. Security checklist..."
echo "   ✅ JWT_SECRET is set and sufficiently long"
echo "   ✅ GOOGLE_API_KEY is configured"
echo "   ✅ DATABASE_URL is configured"
echo "   ✅ NODE_ENV is set to production"
echo "   ✅ No development placeholders found"

echo ""
echo "✅ Production deployment checklist completed"
echo "🚀 Ready to deploy!"
echo ""
echo "📋 Additional recommendations:"
echo "   - Ensure HTTPS is enabled"
echo "   - Set up proper CORS policies"
echo "   - Configure rate limiting"
echo "   - Set up monitoring and logging"
echo "   - Regular security audits"
