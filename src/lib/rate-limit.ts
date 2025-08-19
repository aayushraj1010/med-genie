import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    keyPrefix?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

// In-memory store for rate limiting (fallback when Redis is not available)
class MemoryRateLimitStore {
    private store: RateLimitStore = {};
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // Clean up expired entries every 5 minutes
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            Object.keys(this.store).forEach(key => {
                if (this.store[key].resetTime < now) {
                    delete this.store[key];
                }
            });
        }, 5 * 60 * 1000);
    }

    async get(key: string): Promise<number> {
        const entry = this.store[key];
        if (!entry) return 0;

        if (Date.now() > entry.resetTime) {
            delete this.store[key];
            return 0;
        }

        return entry.count;
    }

    async increment(key: string, windowMs: number): Promise<number> {
        const now = Date.now();
        const resetTime = now + windowMs;

        if (!this.store[key]) {
            this.store[key] = { count: 1, resetTime };
            return 1;
        }

        if (now > this.store[key].resetTime) {
            this.store[key] = { count: 1, resetTime };
            return 1;
        }

        this.store[key].count += 1;
        return this.store[key].count;
    }

    async reset(key: string): Promise<void> {
        delete this.store[key];
    }

    destroy(): void {
        clearInterval(this.cleanupInterval);
    }
}

// Global memory store instance
const memoryStore = new MemoryRateLimitStore();

// Get client IP address from request
function getClientIP(req: NextRequest): string {
    // Check for forwarded IPs (when behind proxy/load balancer)
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        const ips = forwarded.split(',').map(ip => ip.trim());
        return ips[0] || 'unknown';
    }

    // Check for real IP
    const realIP = req.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    // Fallback to connection remote address
    return req.ip || 'unknown';
}

// Generate rate limit key
function generateKey(ip: string, endpoint: string, config: RateLimitConfig): string {
    const prefix = config.keyPrefix || 'rate_limit';
    return `${prefix}:${endpoint}:${ip}`;
}

// Get remaining attempts and reset time
function getRateLimitInfo(currentCount: number, maxRequests: number, resetTime: number) {
    const remaining = Math.max(0, maxRequests - currentCount);
    const resetTimeMs = resetTime - Date.now();

    return {
        remaining,
        resetTime: resetTimeMs > 0 ? resetTimeMs : 0,
        retryAfter: resetTimeMs > 0 ? Math.ceil(resetTimeMs / 1000) : 0
    };
}

// Main rate limiting middleware
export function withRateLimit(config: RateLimitConfig) {
    return function (handler: (req: NextRequest) => Promise<NextResponse>) {
        return async (req: NextRequest) => {
            try {
                const ip = getClientIP(req);
                const key = generateKey(ip, req.nextUrl.pathname, config);

                // Get current count
                const currentCount = await memoryStore.get(key);

                // Check if rate limit exceeded
                if (currentCount >= config.maxRequests) {
                    const resetTime = Date.now() + config.windowMs;
                    const info = getRateLimitInfo(currentCount, config.maxRequests, resetTime);

                    return NextResponse.json(
                        {
                            success: false,
                            error: 'Too many requests',
                            message: `Rate limit exceeded. Try again in ${info.retryAfter} seconds.`,
                            retryAfter: info.retryAfter,
                            remaining: info.remaining
                        },
                        {
                            status: 429,
                            headers: {
                                'X-RateLimit-Limit': config.maxRequests.toString(),
                                'X-RateLimit-Remaining': info.remaining.toString(),
                                'X-RateLimit-Reset': new Date(resetTime).toISOString(),
                                'Retry-After': info.retryAfter.toString()
                            }
                        }
                    );
                }

                // Increment counter
                const newCount = await memoryStore.increment(key, config.windowMs);

                // Execute the actual handler
                const response = await handler(req);

                // Add rate limit headers to successful responses
                if (response.status < 400 || !config.skipSuccessfulRequests) {
                    const resetTime = Date.now() + config.windowMs;
                    const info = getRateLimitInfo(newCount, config.maxRequests, resetTime);

                    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
                    response.headers.set('X-RateLimit-Remaining', info.remaining.toString());
                    response.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString());
                }

                return response;

            } catch (error) {
                console.error('Rate limiting error:', error);
                // If rate limiting fails, still allow the request to proceed
                // but log the error for monitoring
                return handler(req);
            }
        };
    };
}

// Predefined rate limit configurations for different endpoints
export const RATE_LIMIT_CONFIGS = {
    // Login: 5 attempts per 15 minutes
    LOGIN: {
        maxRequests: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || '5'),
        windowMs: parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW || '900000'), // 15 minutes
        keyPrefix: 'login',
        skipSuccessfulRequests: false,
        skipFailedRequests: false
    },

    // Register: 3 attempts per hour
    REGISTER: {
        maxRequests: parseInt(process.env.RATE_LIMIT_REGISTER_MAX || '3'),
        windowMs: parseInt(process.env.RATE_LIMIT_REGISTER_WINDOW || '3600000'), // 1 hour
        keyPrefix: 'register',
        skipSuccessfulRequests: false,
        skipFailedRequests: false
    },

    // Check Email: 10 attempts per 15 minutes
    CHECK_EMAIL: {
        maxRequests: parseInt(process.env.RATE_LIMIT_CHECK_EMAIL_MAX || '10'),
        windowMs: parseInt(process.env.RATE_LIMIT_CHECK_EMAIL_WINDOW || '900000'), // 15 minutes
        keyPrefix: 'check_email',
        skipSuccessfulRequests: false,
        skipFailedRequests: false
    },

    // General API: 100 requests per 15 minutes
    GENERAL: {
        maxRequests: parseInt(process.env.RATE_LIMIT_GENERAL_MAX || '100'),
        windowMs: parseInt(process.env.RATE_LIMIT_GENERAL_WINDOW || '900000'), // 15 minutes
        keyPrefix: 'general',
        skipSuccessfulRequests: true,
        skipFailedRequests: false
    }
};

// Utility function to reset rate limit for a specific IP and endpoint
export async function resetRateLimit(ip: string, endpoint: string, config: RateLimitConfig): Promise<void> {
    const key = generateKey(ip, endpoint, config);
    await memoryStore.reset(key);
}

// Cleanup function for graceful shutdown
export function cleanupRateLimit(): void {
    memoryStore.destroy();
}

// Export memory store for testing purposes
export { memoryStore };
