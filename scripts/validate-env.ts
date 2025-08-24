import { config } from '../src/lib/config';
import { signToken, verifyToken, validateSecretStrength, generateSecureSecret } from '../src/lib/jwt';

async function validateEnvironment() {
    try {
        console.log('🔍 Validating environment configuration...');

        // Test JWT functionality
        console.log('\n📝 Testing JWT configuration...');
        const testPayload = { userId: 1, email: 'test@example.com', name: 'Test User', tokenId: 'test' };
        const token = signToken(testPayload);
        const decoded = verifyToken(token);

        if (decoded && decoded.userId === testPayload.userId) {
            console.log('✅ JWT configuration is working correctly');
        } else {
            console.error('❌ JWT configuration failed');
            process.exit(1);
        }

        // Test secret strength validation
        console.log('\n🔐 Testing secret strength validation...');
        const weakSecret = 'weak';
        const strongSecret = generateSecureSecret(64);

        const weakValidation = validateSecretStrength(weakSecret);
        const strongValidation = validateSecretStrength(strongSecret);

        console.log(`Weak secret score: ${weakValidation.score}/7 - ${weakValidation.isValid ? '✅ Valid' : '❌ Invalid'}`);
        if (!weakValidation.isValid) {
            console.log('   Feedback:', weakValidation.feedback.join(', '));
        }

        console.log(`Strong secret score: ${strongValidation.score}/7 - ${strongValidation.isValid ? '✅ Valid' : '❌ Invalid'}`);

        // Test database connection
        console.log('\n🗄️  Testing database configuration...');
        if (config.databaseUrl) {
            console.log('✅ Database URL is configured');
            console.log(`   URL: ${config.databaseUrl.substring(0, 20)}...`);
        } else {
            console.error('❌ Database URL is missing');
        }

        // Test API keys
        console.log('\n🔑 Testing API key configuration...');
        if (config.googleApiKey) {
            console.log('✅ Google API key is configured');
        } else {
            console.error('❌ Google API key is missing');
        }

        // Test rate limiting configuration
        console.log('\n🚦 Testing rate limiting configuration...');
        console.log(`   Enabled: ${config.rateLimitEnabled ? '✅ Yes' : '❌ No'}`);
        console.log(`   Max Requests: ${config.rateLimitMaxRequests}`);
        console.log(`   Window: ${config.rateLimitWindowMs}ms`);

        // Test environment-specific settings
        console.log('\n🌍 Testing environment-specific settings...');
        console.log(`   Environment: ${config.nodeEnv}`);
        console.log(`   Is Production: ${config.isProduction ? '✅ Yes' : '❌ No'}`);
        console.log(`   Is Development: ${config.isDevelopment ? '✅ Yes' : '❌ No'}`);

        if (config.isProduction) {
            console.log('⚠️  Production environment detected - checking security settings...');

            if (config.jwtSecret.length < 64) {
                console.warn('   ⚠️  JWT_SECRET should be at least 64 characters in production');
            }

            if (config.allowedOrigins.includes('localhost')) {
                console.warn('   ⚠️  ALLOWED_ORIGINS should not include localhost in production');
            }
        }

        console.log('\n✅ Environment validation completed successfully');
        console.log('\n📋 Configuration Summary:');
        console.log(`   JWT Secret Length: ${config.jwtSecret.length} characters`);
        console.log(`   Database: ${config.databaseUrl ? 'Configured' : 'Missing'}`);
        console.log(`   Google AI: ${config.googleApiKey ? 'Configured' : 'Missing'}`);
        console.log(`   Rate Limiting: ${config.rateLimitEnabled ? 'Enabled' : 'Disabled'}`);
        console.log(`   Environment: ${config.nodeEnv}`);

    } catch (error) {
        console.error('❌ Environment validation failed:', error);
        process.exit(1);
    }
}

// Run validation if called directly
if (require.main === module) {
    validateEnvironment();
}

export { validateEnvironment };
