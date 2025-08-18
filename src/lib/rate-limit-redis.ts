import { NextRequest } from 'next/server';

export interface RedisRateLimitConfig {
    maxRequests: number;
    windowMs: number;
    keyPrefix?: string;
    blockDurationMs?: number;
}

export interface RedisRateLimitResult {
    success: boolean;
    remaining: number;
    resetTime: number;
    blocked: boolean;
    blockExpiry?: number;
}

// Redis client interface (implement with your preferred Redis client)
export interface RedisClient {
    get(key: string): Promise<string | null>;
    setex(key: string, seconds: number, value: string): Promise<void>;
    incr(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<void>;
    del(key: string): Promise<void>;
}

// Redis-based rate limiting implementation
export class RedisRateLimiter {
    private redis: RedisClient;

    constructor(redis: RedisClient) {
        this.redis = redis;
    }

    async checkRateLimit(
        key: string,
        config: RedisRateLimitConfig
    ): Promise<RedisRateLimitResult> {
        const now = Date.now();
        const windowSeconds = Math.ceil(config.windowMs / 1000);
        const blockSeconds = config.blockDurationMs ? Math.ceil(config.blockDurationMs / 1000) : 0;

        try {
            // Check if blocked
            const blockedKey = `${key}:blocked`;
            const blockedData = await this.redis.get(blockedKey);

            if (blockedData) {
                const { blockExpiry } = JSON.parse(blockedData);
                if (now < blockExpiry) {
                    return {
                        success: false,
                        remaining: 0,
                        resetTime: blockExpiry,
                        blocked: true,
                        blockExpiry
                    };
                } else {
                    // Unblock if expired
                    await this.redis.del(blockedKey);
                }
            }

            // Get current count
            const countKey = `${key}:count`;
            const currentCount = await this.redis.incr(countKey);

            // Set expiry for count key
            await this.redis.expire(countKey, windowSeconds);

            // Check if should block
            if (currentCount > 10) {
                const blockExpiry = now + (config.blockDurationMs || 0);
                await this.redis.setex(
                    blockedKey,
                    blockSeconds,
                    JSON.stringify({ blockExpiry })
                );

                return {
                    success: false,
                    remaining: 0,
                    resetTime: blockExpiry,
                    blocked: true,
                    blockExpiry
                };
            }

            // Calculate remaining requests
            const remaining = Math.max(0, 10 - currentCount);
            const resetTime = now + config.windowMs;

            return {
                success: currentCount <= 10,
                remaining,
                resetTime,
                blocked: false
            };

        } catch (error) {
            console.error('Redis rate limiting error:', error);
            // Fail open - allow request if Redis fails
            return {
                success: true,
                remaining: 10,
                resetTime: now + config.windowMs,
                blocked: false
            };
        }
    }

    async resetRateLimit(key: string): Promise<void> {
        try {
            await this.redis.del(`${key}:count`);
            await this.redis.del(`${key}:blocked`);
        } catch (error) {
            console.error('Error resetting rate limit:', error);
        }
    }
}

// Example Redis client setup (using ioredis)
export async function createRedisClient(): Promise<RedisClient | null> {
    try {
        // Only import Redis in production
        if (process.env.NODE_ENV === 'production') {
            const Redis = require('ioredis');

            const redis = new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                password: process.env.REDIS_PASSWORD,
                db: parseInt(process.env.REDIS_DB || '0'),
                retryDelayOnFailover: 100,
                maxRetriesPerRequest: 3,
            });

            // Test connection
            await redis.ping();
            console.log('Redis connected successfully');

            return redis;
        }

        return null;
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        return null;
    }
}

// Factory function to create rate limiter
export async function createRateLimiter(): Promise<RedisRateLimiter | null> {
    const redis = await createRedisClient();
    return redis ? new RedisRateLimiter(redis) : null;
}

