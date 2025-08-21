import { InputSanitizer } from './input-sanitizer';

export interface DatabaseAuditLog {
    userId?: number;
    action: string;
    table: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
    query?: string;
    params?: any;
    duration?: number;
    success: boolean;
    error?: string;
}

export interface DatabaseQueryLog {
    query: string;
    params: any;
    duration: number;
    timestamp: Date;
    userId?: number;
    ipAddress?: string;
}

export class DatabaseSecurity {
    private static readonly SENSITIVE_FIELDS = [
        'password', 'token', 'secret', 'key', 'credential', 'auth'
    ];

    private static readonly SENSITIVE_TABLES = [
        'users', 'auth', 'tokens', 'sessions', 'passwords'
    ];

    private static readonly MAX_QUERY_DURATION = 5000; // 5 seconds
    private static readonly MAX_INPUT_LENGTH = 1000;
    private static readonly MAX_EMAIL_LENGTH = 254;
    private static readonly MAX_NAME_LENGTH = 100;

    /**
     * Validate email format and length
     */
    static validateEmail(email: string): boolean {
        if (!email || typeof email !== 'string') return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidFormat = emailRegex.test(email);
        const isValidLength = email.length <= this.MAX_EMAIL_LENGTH;
        const isNotTooShort = email.length >= 5;

        return isValidFormat && isValidLength && isNotTooShort;
    }

    /**
     * Sanitize and validate database input
     */
    static sanitizeInput(input: string, maxLength: number = this.MAX_INPUT_LENGTH): string {
        if (!input || typeof input !== 'string') return '';

        // Remove dangerous characters and patterns
        let sanitized = input
            .trim()
            .replace(/[<>]/g, '') // Remove HTML tags
            .replace(/javascript:/gi, '') // Remove javascript protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .replace(/['"\\]/g, '') // Remove quotes and backslashes
            .replace(/\s+/g, ' '); // Normalize whitespace

        // Limit length
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        return sanitized;
    }

    /**
     * Validate name input
     */
    static validateName(name: string): boolean {
        if (!name || typeof name !== 'string') return false;

        const sanitized = this.sanitizeInput(name, this.MAX_NAME_LENGTH);
        const isValidLength = sanitized.length >= 2 && sanitized.length <= this.MAX_NAME_LENGTH;
        const containsValidChars = /^[a-zA-Z\s\-'\.]+$/.test(sanitized);

        return isValidLength && containsValidChars;
    }

    /**
     * Check if query contains sensitive operations
     */
    static isSensitiveQuery(query: string): boolean {
        if (!query || typeof query !== 'string') return false;

        const lowerQuery = query.toLowerCase();

        // Check for sensitive operations
        const sensitiveOperations = [
            'delete', 'drop', 'truncate', 'alter', 'create', 'grant', 'revoke',
            'insert into', 'update', 'select *', 'union', 'exec', 'execute'
        ];

        return sensitiveOperations.some(op => lowerQuery.includes(op));
    }

    /**
     * Check if query contains sensitive fields
     */
    static containsSensitiveFields(query: string): boolean {
        if (!query || typeof query !== 'string') return false;

        const lowerQuery = query.toLowerCase();
        return this.SENSITIVE_FIELDS.some(field => lowerQuery.includes(field));
    }

    /**
     * Validate query parameters
     */
    static validateQueryParams(params: any): boolean {
        if (!params || typeof params !== 'object') return true;

        for (const [key, value] of Object.entries(params)) {
            if (typeof value === 'string') {
                // Check for SQL injection patterns
                const lowerValue = value.toLowerCase();
                const dangerousPatterns = [
                    'union', 'select', 'insert', 'update', 'delete', 'drop', 'create',
                    'alter', 'exec', 'execute', 'script', 'javascript:', 'onerror='
                ];

                if (dangerousPatterns.some(pattern => lowerValue.includes(pattern))) {
                    return false;
                }

                // Check length limits
                if (value.length > this.MAX_INPUT_LENGTH) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Log database access for security monitoring
     */
    static logDatabaseAccess(auditLog: DatabaseAuditLog): void {
        const timestamp = new Date().toISOString();

        // Console logging for development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DB AUDIT] ${timestamp} - User: ${auditLog.userId || 'anonymous'}, Action: ${auditLog.action}, Table: ${auditLog.table}`);

            if (auditLog.details) {
                console.log(`[DB AUDIT] Details: ${auditLog.details}`);
            }

            if (auditLog.error) {
                console.error(`[DB AUDIT] Error: ${auditLog.error}`);
            }
        }

        // TODO: In production, send to logging service or database
        // This could be Sentry, LogRocket, or a custom logging solution
    }

    /**
     * Log database queries for performance and security monitoring
     */
    static logDatabaseQuery(queryLog: DatabaseQueryLog): void {
        const timestamp = queryLog.timestamp.toISOString();

        // Check for suspicious queries
        if (this.isSensitiveQuery(queryLog.query)) {
            console.warn(`[DB SECURITY] Sensitive query detected at ${timestamp}:`, {
                userId: queryLog.userId,
                ipAddress: queryLog.ipAddress,
                query: queryLog.query.substring(0, 100) + '...',
                duration: queryLog.duration
            });
        }

        // Check for slow queries
        if (queryLog.duration > this.MAX_QUERY_DURATION) {
            console.warn(`[DB PERFORMANCE] Slow query detected at ${timestamp}:`, {
                userId: queryLog.userId,
                duration: queryLog.duration,
                query: queryLog.query.substring(0, 100) + '...'
            });
        }

        // Check for sensitive field access
        if (this.containsSensitiveFields(queryLog.query)) {
            console.warn(`[DB SECURITY] Sensitive fields accessed at ${timestamp}:`, {
                userId: queryLog.userId,
                query: queryLog.query.substring(0, 100) + '...'
            });
        }
    }

    /**
     * Sanitize user data before database operations
     */
    static sanitizeUserData(userData: any): any {
        if (!userData || typeof userData !== 'object') return userData;

        const sanitized: any = {};

        for (const [key, value] of Object.entries(userData)) {
            if (typeof value === 'string') {
                switch (key) {
                    case 'email':
                        sanitized[key] = value.trim().toLowerCase();
                        break;
                    case 'name':
                        sanitized[key] = this.sanitizeInput(value, this.MAX_NAME_LENGTH);
                        break;
                    case 'password':
                        // Don't sanitize passwords - they should be hashed
                        sanitized[key] = value;
                        break;
                    default:
                        sanitized[key] = this.sanitizeInput(value);
                }
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }

    /**
     * Validate user data before database operations
     */
    static validateUserData(userData: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!userData || typeof userData !== 'object') {
            errors.push('Invalid user data format');
            return { isValid: false, errors };
        }

        // Validate email
        if (userData.email && !this.validateEmail(userData.email)) {
            errors.push('Invalid email format or length');
        }

        // Validate name
        if (userData.name && !this.validateName(userData.name)) {
            errors.push('Invalid name format or length');
        }

        // Validate password (if present)
        if (userData.password) {
            if (typeof userData.password !== 'string' || userData.password.length < 8) {
                errors.push('Password must be at least 8 characters long');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Create audit log entry
     */
    static createAuditLog(
        userId: number | undefined,
        action: string,
        table: string,
        details?: string,
        ipAddress?: string,
        userAgent?: string
    ): DatabaseAuditLog {
        return {
            userId,
            action,
            table,
            details,
            ipAddress,
            userAgent,
            timestamp: new Date(),
            success: true
        };
    }

    /**
     * Check if IP address is suspicious
     */
    static isSuspiciousIP(ipAddress: string): boolean {
        if (!ipAddress) return false;

        // Check for localhost abuse
        if (ipAddress === '127.0.0.1' || ipAddress === '::1') {
            return false; // Allow localhost for development
        }

        // Check for private network abuse
        const privateRanges = [
            /^10\./,
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
            /^192\.168\./
        ];

        return privateRanges.some(range => range.test(ipAddress));
    }

    /**
     * Rate limiting for database operations
     */
    private static operationCounts = new Map<string, { count: number; resetTime: number }>();

    static checkRateLimit(operation: string, userId: number | undefined, maxAttempts: number = 10, windowMs: number = 60000): boolean {
        const key = `${operation}:${userId || 'anonymous'}`;
        const now = Date.now();

        const current = this.operationCounts.get(key);

        if (!current || now > current.resetTime) {
            this.operationCounts.set(key, { count: 1, resetTime: now + windowMs });
            return true;
        }

        if (current.count >= maxAttempts) {
            return false;
        }

        current.count++;
        return true;
    }
}
