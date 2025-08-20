import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
    // Node environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Database
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    // JWT Configuration
    JWT_SECRET: z.string()
        .min(32, 'JWT_SECRET must be at least 32 characters long')
        .regex(/[A-Z]/, 'JWT_SECRET must contain uppercase letters')
        .regex(/[a-z]/, 'JWT_SECRET must contain lowercase letters')
        .regex(/[0-9]/, 'JWT_SECRET must contain numbers')
        .regex(/[^A-Za-z0-9]/, 'JWT_SECRET must contain special characters'),

    JWT_EXPIRES_IN: z.string().default('15m'),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

    // API Keys
    GOOGLE_API_KEY: z.string().min(1, 'GOOGLE_API_KEY is required'),

    // Security
    ALLOWED_ORIGINS: z.string().default('http://localhost:9003'),
    RATE_LIMIT_ENABLED: z.string().transform(val => val === 'true').default('true'),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),

    // Server
    PORT: z.coerce.number().default(9003),
    HOST: z.string().default('localhost'),

    // Optional
    REDIS_URL: z.string().url().optional(),
    SENTRY_DSN: z.string().url().optional(),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Configuration class
export class Config {
    private static instance: Config;
    private config: z.infer<typeof envSchema>;

    private constructor() {
        this.validateEnvironment();
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    private validateEnvironment(): void {
        try {
            this.config = envSchema.parse(process.env);
            this.logConfiguration();
        } catch (error) {
            console.error('❌ Environment validation failed:');
            if (error instanceof z.ZodError) {
                error.errors.forEach((err) => {
                    console.error(`  - ${err.path.join('.')}: ${err.message}`);
                });
            }
            process.exit(1);
        }
    }

    private logConfiguration(): void {
        const isProduction = this.config.NODE_ENV === 'production';

        console.log('✅ Environment configuration validated');
        console.log(`   Environment: ${this.config.NODE_ENV}`);
        console.log(`   Database: ${this.config.DATABASE_URL ? '✅ Configured' : '❌ Missing'}`);
        console.log(`   JWT: ${this.config.JWT_SECRET ? '✅ Configured' : '❌ Missing'}`);
        console.log(`   Google AI: ${this.config.GOOGLE_API_KEY ? '✅ Configured' : '❌ Missing'}`);

        if (isProduction) {
            console.log('⚠️  Production environment detected');
            this.validateProductionSecurity();
        }
    }

    private validateProductionSecurity(): void {
        const warnings: string[] = [];

        if (this.config.JWT_SECRET.length < 64) {
            warnings.push('JWT_SECRET should be at least 64 characters in production');
        }

        if (this.config.ALLOWED_ORIGINS.includes('localhost')) {
            warnings.push('ALLOWED_ORIGINS should not include localhost in production');
        }

        if (this.config.NODE_ENV === 'development') {
            warnings.push('NODE_ENV should be "production" in production environment');
        }

        if (warnings.length > 0) {
            console.warn('⚠️  Production security warnings:');
            warnings.forEach(warning => console.warn(`   - ${warning}`));
        }
    }

    // Getters for configuration values
    get nodeEnv(): string { return this.config.NODE_ENV; }
    get isProduction(): boolean { return this.config.NODE_ENV === 'production'; }
    get isDevelopment(): boolean { return this.config.NODE_ENV === 'development'; }
    get databaseUrl(): string { return this.config.DATABASE_URL; }
    get jwtSecret(): string { return this.config.JWT_SECRET; }
    get jwtExpiresIn(): string { return this.config.JWT_EXPIRES_IN; }
    get refreshTokenExpiresIn(): string { return this.config.REFRESH_TOKEN_EXPIRES_IN; }
    get googleApiKey(): string { return this.config.GOOGLE_API_KEY; }
    get allowedOrigins(): string { return this.config.ALLOWED_ORIGINS; }
    get rateLimitEnabled(): boolean { return this.config.RATE_LIMIT_ENABLED; }
    get rateLimitMaxRequests(): number { return this.config.RATE_LIMIT_MAX_REQUESTS; }
    get rateLimitWindowMs(): number { return this.config.RATE_LIMIT_WINDOW_MS; }
    get port(): number { return this.config.PORT; }
    get host(): string { return this.config.HOST; }
    get redisUrl(): string | undefined { return this.config.REDIS_URL; }
    get sentryDsn(): string | undefined { return this.config.SENTRY_DSN; }
    get logLevel(): string { return this.config.LOG_LEVEL; }
}

// Export singleton instance
export const config = Config.getInstance();
