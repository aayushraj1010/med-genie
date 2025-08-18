// Rate limiting configuration for different environments
export const RATE_LIMIT_CONFIG = {
    // Development environment (more permissive)
    development: {
        login: {
            maxRequests: 10,           // 10 login attempts
            windowMs: 15 * 60 * 1000, // 15 minutes
            blockDurationMs: 30 * 60 * 1000 // Block for 30 minutes
        },
        register: {
            maxRequests: 5,            // 5 registration attempts
            windowMs: 60 * 60 * 1000, // 1 hour
            blockDurationMs: 60 * 60 * 1000 // Block for 1 hour
        },
        checkEmail: {
            maxRequests: 20,           // 20 email checks
            windowMs: 5 * 60 * 1000,  // 5 minutes
            blockDurationMs: 15 * 60 * 1000 // Block for 15 minutes
        }
    },

    // Production environment (more restrictive)
    production: {
        login: {
            maxRequests: 5,            // 5 login attempts
            windowMs: 15 * 60 * 1000, // 15 minutes
            blockDurationMs: 30 * 60 * 1000 // Block for 30 minutes
        },
        register: {
            maxRequests: 3,            // 3 registration attempts
            windowMs: 60 * 60 * 1000, // 1 hour
            blockDurationMs: 60 * 60 * 1000 // Block for 1 hour
        },
        checkEmail: {
            maxRequests: 10,           // 10 email checks
            windowMs: 5 * 60 * 1000,  // 5 minutes
            blockDurationMs: 15 * 60 * 1000 // Block for 15 minutes
        }
    },

    // Testing environment (very permissive)
    test: {
        login: {
            maxRequests: 100,          // 100 login attempts
            windowMs: 15 * 60 * 1000, // 15 minutes
            blockDurationMs: 5 * 60 * 1000  // Block for 5 minutes
        },
        register: {
            maxRequests: 50,           // 50 registration attempts
            windowMs: 60 * 60 * 1000, // 1 hour
            blockDurationMs: 10 * 60 * 1000 // Block for 10 minutes
        },
        checkEmail: {
            maxRequests: 200,          // 200 email checks
            windowMs: 5 * 60 * 1000,  // 5 minutes
            blockDurationMs: 2 * 60 * 1000  // Block for 2 minutes
        }
    }
};

// Get current environment configuration
export function getRateLimitConfig() {
    const env = process.env.NODE_ENV || 'development';
    return RATE_LIMIT_CONFIG[env as keyof typeof RATE_LIMIT_CONFIG] || RATE_LIMIT_CONFIG.development;
}

// Environment-specific settings
export const ENV_CONFIG = {
    // Rate limiting store type
    STORE_TYPE: process.env.RATE_LIMIT_STORE || 'memory', // 'memory' | 'redis'

    // Redis configuration (if using Redis)
    REDIS: {
        HOST: process.env.REDIS_HOST || 'localhost',
        PORT: parseInt(process.env.REDIS_PORT || '6379'),
        PASSWORD: process.env.REDIS_PASSWORD,
        DB: parseInt(process.env.REDIS_DB || '0'),
        KEY_PREFIX: process.env.REDIS_KEY_PREFIX || 'med_genie_rate_limit'
    },

    // General rate limiting settings
    GENERAL: {
        ENABLE_LOGGING: process.env.RATE_LIMIT_LOGGING === 'true',
        LOG_VIOLATIONS: process.env.RATE_LIMIT_LOG_VIOLATIONS === 'true',
        ALERT_ON_VIOLATIONS: process.env.RATE_LIMIT_ALERT === 'true',
        CLEANUP_INTERVAL: parseInt(process.env.RATE_LIMIT_CLEANUP_INTERVAL || '300000'), // 5 minutes
    }
};

// Validation function for configuration
export function validateRateLimitConfig() {
    const config = getRateLimitConfig();
    const errors: string[] = [];

    Object.entries(config).forEach(([endpoint, settings]) => {
        if (settings.maxRequests <= 0) {
            errors.push(`${endpoint}: maxRequests must be greater than 0`);
        }
        if (settings.windowMs <= 0) {
            errors.push(`${endpoint}: windowMs must be greater than 0`);
        }
        if (settings.blockDurationMs && settings.blockDurationMs <= 0) {
            errors.push(`${endpoint}: blockDurationMs must be greater than 0`);
        }
    });

    if (errors.length > 0) {
        throw new Error(`Invalid rate limit configuration: ${errors.join(', ')}`);
    }

    return true;
}

// Export default configuration
export default getRateLimitConfig();

