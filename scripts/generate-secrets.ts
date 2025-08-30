#!/usr/bin/env tsx

import crypto from 'crypto';

// Simple secret strength validation (without importing config)
function validateSecretStrength(secret: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
} {
    const feedback: string[] = [];
    let score = 0;

    if (secret.length >= 32) score += 2;
    else feedback.push('Secret should be at least 32 characters long');

    if (secret.length >= 64) score += 1;
    if (/[A-Z]/.test(secret)) score += 1;
    if (/[a-z]/.test(secret)) score += 1;
    if (/[0-9]/.test(secret)) score += 1;
    if (/[^A-Za-z0-9]/.test(secret)) score += 1;

    return {
        isValid: score >= 4,
        score: Math.min(score, 7),
        feedback
    };
}

console.log('🔐 Secure Secret Generator for Med-Genie');
console.log('========================================\n');

// Generate JWT secret
console.log('📝 Generating JWT Secret...');
const jwtSecret = crypto.randomBytes(64).toString('hex');
const jwtValidation = validateSecretStrength(jwtSecret);

console.log(`Generated JWT Secret: ${jwtSecret}`);
console.log(`Strength Score: ${jwtValidation.score}/7`);
console.log(`Valid: ${jwtValidation.isValid ? '✅ Yes' : '❌ No'}`);

if (!jwtValidation.isValid) {
    console.log('Feedback:', jwtValidation.feedback.join(', '));
}

console.log('\n📋 Environment Variables to Set:');
console.log('================================');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_EXPIRES_IN=15m`);
console.log(`REFRESH_TOKEN_EXPIRES_IN=7d`);

// Generate additional secrets
console.log('\n🔑 Additional Security Secrets:');
console.log('================================');

// Generate session secret
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log(`SESSION_SECRET=${sessionSecret}`);

// Generate encryption key
const encryptionKey = crypto.randomBytes(32).toString('base64');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);

// Generate API key
const apiKey = crypto.randomBytes(24).toString('base64');
console.log(`API_KEY=${apiKey}`);

console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
console.log('============================');
console.log('1. Store these secrets securely (NOT in version control)');
console.log('2. Use different secrets for each environment');
console.log('3. Rotate secrets regularly (every 90 days recommended)');
console.log('4. Use environment variables or secure secret management');
console.log('5. Never log or expose these secrets');

console.log('\n🚀 Production Deployment:');
console.log('========================');
console.log('1. Set NODE_ENV=production');
console.log('2. Use strong secrets (64+ characters for JWT)');
console.log('3. Remove localhost from ALLOWED_ORIGINS');
console.log('4. Enable HTTPS and security headers');
console.log('5. Run: npm run validate-env');

console.log('\n✅ Secret generation completed successfully!');
