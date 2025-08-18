import { NextRequest } from 'next/server';
import { RateLimitResult } from './rate-limit';

export interface RateLimitEvent {
    timestamp: number;
    clientId: string;
    endpoint: string;
    action: 'request' | 'blocked' | 'violation' | 'reset';
    details: {
        ip: string;
        userAgent?: string;
        method: string;
        path: string;
        remaining: number;
        blocked: boolean;
        blockExpiry?: number;
    };
}

export interface SecurityAlert {
    level: 'low' | 'medium' | 'high' | 'critical';
    type: 'brute_force' | 'dos_attack' | 'suspicious_activity' | 'rate_limit_bypass';
    message: string;
    clientId: string;
    endpoint: string;
    timestamp: number;
    details: Record<string, any>;
}

class RateLimitMonitor {
    private events: RateLimitEvent[] = [];
    private alerts: SecurityAlert[] = [];
    private maxEvents = 1000; // Keep last 1000 events
    private maxAlerts = 100;  // Keep last 100 alerts

    // Track rate limit event
    trackEvent(event: RateLimitEvent): void {
        this.events.push(event);

        // Keep only recent events
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(-this.maxEvents);
        }

        // Check for security threats
        this.analyzeSecurityThreats(event);
    }

    // Track security alert
    trackAlert(alert: SecurityAlert): void {
        this.alerts.push(alert);

        // Keep only recent alerts
        if (this.alerts.length > this.maxAlerts) {
            this.alerts = this.alerts.slice(-this.maxAlerts);
        }

        // Log critical alerts
        if (alert.level === 'critical') {
            console.error(`🚨 CRITICAL SECURITY ALERT: ${alert.message}`, alert);
        } else if (alert.level === 'high') {
            console.warn(`⚠️ HIGH SECURITY ALERT: ${alert.message}`, alert);
        }
    }

    // Analyze events for security threats
    private analyzeSecurityThreats(event: RateLimitEvent): void {
        const { clientId, endpoint, action, details } = event;

        // Check for brute force attacks
        if (action === 'blocked' || action === 'violation') {
            const recentEvents = this.events.filter(e =>
                e.clientId === clientId &&
                e.endpoint === endpoint &&
                e.timestamp > Date.now() - (15 * 60 * 1000) // Last 15 minutes
            );

            if (recentEvents.length >= 5) {
                this.trackAlert({
                    level: 'high',
                    type: 'brute_force',
                    message: `Potential brute force attack detected on ${endpoint}`,
                    clientId,
                    endpoint,
                    timestamp: Date.now(),
                    details: {
                        recentEvents: recentEvents.length,
                        timeWindow: '15 minutes',
                        ip: details.ip
                    }
                });
            }
        }

        // Check for DoS attacks
        const recentRequests = this.events.filter(e =>
            e.clientId === clientId &&
            e.timestamp > Date.now() - (60 * 1000) // Last minute
        );

        if (recentRequests.length >= 20) {
            this.trackAlert({
                level: 'critical',
                type: 'dos_attack',
                message: `Potential DoS attack detected from ${clientId}`,
                clientId,
                endpoint,
                timestamp: Date.now(),
                details: {
                    requestsPerMinute: recentRequests.length,
                    ip: details.ip
                }
            });
        }

        // Check for suspicious patterns
        this.detectSuspiciousPatterns(clientId, endpoint);
    }

    // Detect suspicious patterns
    private detectSuspiciousPatterns(clientId: string, endpoint: string): void {
        const recentEvents = this.events.filter(e =>
            e.clientId === clientId &&
            e.timestamp > Date.now() - (5 * 60 * 1000) // Last 5 minutes
        );

        // Multiple endpoints being hit rapidly
        const uniqueEndpoints = new Set(recentEvents.map(e => e.endpoint));
        if (uniqueEndpoints.size >= 3 && recentEvents.length >= 15) {
            this.trackAlert({
                level: 'medium',
                type: 'suspicious_activity',
                message: `Suspicious activity: Multiple endpoints hit rapidly`,
                clientId,
                endpoint,
                timestamp: Date.now(),
                details: {
                    endpoints: Array.from(uniqueEndpoints),
                    totalRequests: recentEvents.length,
                    timeWindow: '5 minutes'
                }
            });
        }
    }

    // Get recent events for a client
    getClientEvents(clientId: string, timeWindowMs: number = 60 * 60 * 1000): RateLimitEvent[] {
        const cutoff = Date.now() - timeWindowMs;
        return this.events.filter(e => e.clientId === clientId && e.timestamp > cutoff);
    }

    // Get recent alerts
    getRecentAlerts(level?: SecurityAlert['level'], timeWindowMs: number = 24 * 60 * 60 * 1000): SecurityAlert[] {
        const cutoff = Date.now() - timeWindowMs;
        let filtered = this.alerts.filter(a => a.timestamp > cutoff);

        if (level) {
            filtered = filtered.filter(a => a.level === level);
        }

        return filtered.sort((a, b) => b.timestamp - a.timestamp);
    }

    // Get statistics
    getStats(timeWindowMs: number = 24 * 60 * 60 * 1000): {
        totalEvents: number;
        totalAlerts: number;
        blockedRequests: number;
        uniqueClients: number;
        topEndpoints: Array<{ endpoint: string; count: number }>;
        topClients: Array<{ clientId: string; count: number }>;
    } {
        const cutoff = Date.now() - timeWindowMs;
        const recentEvents = this.events.filter(e => e.timestamp > cutoff);
        const recentAlerts = this.alerts.filter(a => a.timestamp > cutoff);

        // Count blocked requests
        const blockedRequests = recentEvents.filter(e => e.action === 'blocked').length;

        // Count unique clients
        const uniqueClients = new Set(recentEvents.map(e => e.clientId)).size;

        // Top endpoints
        const endpointCounts = new Map<string, number>();
        recentEvents.forEach(e => {
            endpointCounts.set(e.endpoint, (endpointCounts.get(e.endpoint) || 0) + 1);
        });
        const topEndpoints = Array.from(endpointCounts.entries())
            .map(([endpoint, count]) => ({ endpoint, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Top clients
        const clientCounts = new Map<string, number>();
        recentEvents.forEach(e => {
            clientCounts.set(e.clientId, (clientCounts.get(e.clientId) || 0) + 1);
        });
        const topClients = Array.from(clientCounts.entries())
            .map(([clientId, count]) => ({ clientId, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            totalEvents: recentEvents.length,
            totalAlerts: recentAlerts.length,
            blockedRequests,
            uniqueClients,
            topEndpoints,
            topClients
        };
    }

    // Clear old data
    cleanup(): void {
        const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // Keep 7 days
        this.events = this.events.filter(e => e.timestamp > cutoff);
        this.alerts = this.alerts.filter(a => a.timestamp > cutoff);
    }
}

// Global monitor instance
export const rateLimitMonitor = new RateLimitMonitor();

// Cleanup every hour
setInterval(() => rateLimitMonitor.cleanup(), 60 * 60 * 1000);

// Helper function to create rate limit event
export function createRateLimitEvent(
    req: NextRequest,
    endpoint: string,
    result: RateLimitResult,
    action: RateLimitEvent['action']
): RateLimitEvent {
    const clientId = req.ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    return {
        timestamp: Date.now(),
        clientId,
        endpoint,
        action,
        details: {
            ip: clientId,
            userAgent: req.headers.get('user-agent'),
            method: req.method,
            path: req.nextUrl?.pathname || 'unknown',
            remaining: result.remaining,
            blocked: result.blocked,
            blockExpiry: result.blockExpiry
        }
    };
}

// Export monitor for use in other modules
export default rateLimitMonitor;

