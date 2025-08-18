import { NextRequest, NextResponse } from 'next/server';
import rateLimitMonitor from '@/lib/rate-limit-monitor';

// Admin endpoint to view rate limiting statistics
export async function GET(req: NextRequest) {
    try {
        // Basic security check - in production, implement proper admin authentication
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get query parameters
        const { searchParams } = new URL(req.url);
        const timeWindow = searchParams.get('timeWindow') || '24h';
        const level = searchParams.get('level') as any;
        const clientId = searchParams.get('clientId');

        // Convert time window to milliseconds
        const timeWindowMs = parseTimeWindow(timeWindow);

        // Get statistics
        const stats = rateLimitMonitor.getStats(timeWindowMs);

        // Get recent alerts
        const alerts = level
            ? rateLimitMonitor.getRecentAlerts(level, timeWindowMs)
            : rateLimitMonitor.getRecentAlerts(undefined, timeWindowMs);

        // Get client-specific events if requested
        let clientEvents = null;
        if (clientId) {
            clientEvents = rateLimitMonitor.getClientEvents(clientId, timeWindowMs);
        }

        return NextResponse.json({
            success: true,
            data: {
                timeWindow,
                timeWindowMs,
                timestamp: new Date().toISOString(),
                stats,
                alerts: alerts.slice(0, 50), // Limit to 50 most recent alerts
                clientEvents,
                summary: {
                    totalEvents: stats.totalEvents,
                    totalAlerts: stats.totalAlerts,
                    blockedRequests: stats.blockedRequests,
                    uniqueClients: stats.uniqueClients,
                    topEndpoints: stats.topEndpoints,
                    topClients: stats.topClients
                }
            }
        });

    } catch (error: any) {
        console.error('Error fetching rate limit stats:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Internal server error'
            },
            { status: 500 }
        );
    }
}

// Helper function to parse time window
function parseTimeWindow(timeWindow: string): number {
    const now = Date.now();

    switch (timeWindow) {
        case '1h':
            return 60 * 60 * 1000;
        case '6h':
            return 6 * 60 * 60 * 1000;
        case '12h':
            return 12 * 60 * 60 * 1000;
        case '24h':
        case '1d':
            return 24 * 60 * 60 * 1000;
        case '7d':
            return 7 * 24 * 60 * 60 * 1000;
        case '30d':
            return 30 * 24 * 60 * 60 * 1000;
        default:
            // Try to parse as custom hours
            const hours = parseInt(timeWindow);
            if (!isNaN(hours)) {
                return hours * 60 * 60 * 1000;
            }
            // Default to 24 hours
            return 24 * 60 * 60 * 1000;
    }
}

