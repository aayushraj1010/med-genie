# Security Configuration Guide

## Environment Variables

Create a `.env` file in your project root with the following security configuration:

```bash
# Security Configuration
ALLOWED_ORIGINS=http://localhost:9003,https://med-genie-five.vercel.app
CSP_REPORT_URI=https://med-genie-five.vercel.app/csp-report
HSTS_MAX_AGE=31536000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Rate Limiting Configuration
RATE_LIMIT_LOGIN_MAX=5
RATE_LIMIT_LOGIN_WINDOW=900000
RATE_LIMIT_REGISTER_MAX=3
RATE_LIMIT_REGISTER_WINDOW=3600000
RATE_LIMIT_CHECK_EMAIL_MAX=10
RATE_LIMIT_CHECK_EMAIL_WINDOW=900000
RATE_LIMIT_GENERAL_MAX=100
RATE_LIMIT_GENERAL_WINDOW=900000
```

## Security Features Implemented

### 1. Security Headers
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Enables XSS protection
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features
- **Strict-Transport-Security**: Enforces HTTPS
- **Content-Security-Policy**: Prevents XSS and other attacks

### 2. CORS Configuration
- Restricted to allowed origins only
- Proper methods and headers configuration
- Credentials support for authenticated requests

### 3. Rate Limiting
- Login: 5 attempts per 15 minutes
- Register: 3 attempts per hour
- Check Email: 10 attempts per 15 minutes
- General API: 100 requests per 15 minutes

### 4. Cache Control
- No caching for sensitive routes
- Proper cache headers for static content

## Testing Security Headers

Use security testing tools to verify headers:

```bash
# Check security headers
curl -I https://yourdomain.com

# Test CSP
npx csp-evaluator --url https://yourdomain.com

# Security scan
npx security-headers --url https://yourdomain.com
```

## Security Best Practices

1. **Never commit .env files** - They contain sensitive information
2. **Rotate JWT secrets** regularly in production
3. **Monitor security headers** with security tools
4. **Update dependencies** regularly for security patches
5. **Use HTTPS** in production environments
6. **Regular security audits** of your application

## OWASP Compliance

This implementation addresses:
- ✅ A03:2021 – Injection
- ✅ A05:2021 – Security Misconfiguration
- ✅ A07:2021 – Identification and Authentication Failures
- ✅ A08:2021 – Software and Data Integrity Failures
