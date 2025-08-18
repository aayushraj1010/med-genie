import { NextRequest, NextResponse } from 'next/server';
import { getRateLimitConfig, ENV_CONFIG } from './rate-limit-config';

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    keyPrefix?: string;
    blockDurationMs?: number;
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetTime: number;
    blocked: boolean;
    blockExpiry?: number;
}

// In-memory store for development (use Redis in production)
class MemoryStore {
    private store = new Map<string, { count: number; resetTime: number; blocked: boolean; blockExpiry?: number }>();

    async get(key: string): Promise<{ count: number; resetTime: number; blocked: boolean; blockExpiry?: number } | null> {
        const data = this.store.get(key);
        if (!data) return null;

        // Check if window has expired
        if (Date.now() > data.resetTime) {
            this.store.delete(key);
            return null;
        }

        // Check if still blocked
        if (data.blocked && data.blockExpiry && Date.now() < data.blockExpiry) {
            return data;
        }

        // Unblock if block duration has expired
        if (data.blocked && data.blockExpiry && Date.now() >= data.blockExpiry) {
            data.blocked = false;
            data.blockExpiry = undefined;
        }

        return data;
    }

    async set(key: string, data: { count: number; resetTime: number; blocked: boolean; blockExpiry?: number }): Promise<void> {
        this.store.set(key, data);
    }

    async increment(key: string, windowMs: number, blockDurationMs?: number): Promise<RateLimitResult> {
        const now = Date.now();
        const resetTime = now + windowMs;

        const existing = await this.get(key);

        if (existing?.blocked) {
            return {
                success: false,
                remaining: 0,
                resetTime: existing.blockExpiry || 0,
                blocked: true,
                blockExpiry: existing.blockExpiry
            };
        }

        const count = (existing?.count || 0) + 1;
        const blocked = count > 10; // Block after 10 attempts
        const blockExpiry = blocked && blockDurationMs ? now + blockDurationMs : undefined;

        await this.set(key, { count, resetTime, blocked, blockExpiry });

        // Log violations if enabled
        if (ENV_CONFIG.GENERAL.LOG_VIOLATIONS && blocked) {
            console.warn(`Rate limit violation detected for key: ${key}, count: ${count}`);
        }

        return {
            success: count <= 10,
            remaining: Math.max(0, 10 - count),
            resetTime,
            blocked,
            blockExpiry
        };
    }

    // Cleanup expired entries (call periodically in production)
    cleanup(): void {
        const now = Date.now();
        for (const [key, data] of this.store.entries()) {
            if (now > data.resetTime && (!data.blockExpiry || now > data.blockExpiry)) {
                this.store.delete(key);
            }
        }
    }
}

// Global memory store instance
const memoryStore = new MemoryStore();

// Cleanup every 5 minutes or as configured
setInterval(() => memoryStore.cleanup(), ENV_CONFIG.GENERAL.CLEANUP_INTERVAL);

export function getClientIdentifier(req: NextRequest): string {
    // Get IP address from various headers (for different deployment scenarios)
    const ip = req.ip ||
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        req.headers.get('cf-connecting-ip') ||
        'unknown';

    return ip;
}

export async function checkRateLimit(
    key: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    const result = await memoryStore.increment(key, config.windowMs, config.blockDurationMs);
    return result;
}

export function withRateLimit(config: RateLimitConfig) {
    return function (handler: Function) {
        return async (req: NextRequest) => {
            try {
                const clientId = getClientIdentifier(req);
                const key = `${config.keyPrefix || 'rate_limit'}:${clientId}`;

                const rateLimitResult = await checkRateLimit(key, config);

                if (!rateLimitResult.success) {
                    const headers = {
                        'X-RateLimit-Limit': config.maxRequests.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
                    };

                    if (rateLimitResult.blocked) {
                        headers['X-RateLimit-Blocked'] = 'true';
                        if (rateLimitResult.blockExpiry) {
                            headers['X-RateLimit-Block-Expiry'] = rateLimitResult.blockExpiry.toString();
                        }
                    }

                    // Log violation if enabled
                    if (ENV_CONFIG.GENERAL.LOG_VIOLATIONS) {
                        console.warn(`Rate limit exceeded for ${clientId} on ${config.keyPrefix || 'endpoint'}`);
                    }

                    return NextResponse.json(
                        {
                            success: false,
                            error: rateLimitResult.blocked
                                ? 'Too many requests. Account temporarily blocked.'
                                : 'Too many requests. Please try again later.',
                            retryAfter: rateLimitResult.blocked && rateLimitResult.blockExpiry
                                ? Math.ceil((rateLimitResult.blockExpiry - Date.now()) / 1000)
                                : Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
                        },
                        {
                            status: 429,
                            headers
                        }
                    );
                }

                // Add rate limit headers to successful responses
                const response = await handler(req);

                if (response instanceof NextResponse) {
                    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
                    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
                    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
                }

                return response;
            } catch (error) {
                console.error('Rate limiting error:', error);
                // If rate limiting fails, allow the request to proceed (fail open)
                return handler(req);
            }
        };
    };
}

// Get rate limit configuration for specific endpoints
export function getEndpointRateLimit(endpoint: 'login' | 'register' | 'checkEmail'): RateLimitConfig {
    const config = getRateLimitConfig();
    const endpointConfig = config[endpoint];

    return {
        maxRequests: endpointConfig.maxRequests,
        windowMs: endpointConfig.windowMs,
        keyPrefix: `auth_${endpoint}`,
        blockDurationMs: endpointConfig.blockDurationMs
    };
}

// Specific rate limit configurations for different endpoints
export const authRateLimits = {
    login: getEndpointRateLimit('login'),
    register: getEndpointRateLimit('register'),
    checkEmail: getEndpointRateLimit('checkEmail')
};
