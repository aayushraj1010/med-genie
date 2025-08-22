import { PrismaClient } from '@prisma/client';
import { DatabaseSecurity, DatabaseQueryLog } from './database-security';

class SecurePrismaClient extends PrismaClient {
    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'error' },
                { emit: 'event', level: 'info' },
                { emit: 'event', level: 'warn' },
            ],
        });

        this.setupSecurityHooks();
    }

    private setupSecurityHooks() {
        // Monitor all queries for security threats
        this.$on('query', (e) => {
            const startTime = Date.now();

            // Log query for security analysis
            this.logQuery(e.query, e.params, startTime);

            // Check for suspicious queries
            if (DatabaseSecurity.isSensitiveQuery(e.query)) {
                console.warn('[DB SECURITY] Sensitive query detected:', {
                    query: e.query.substring(0, 100) + '...',
                    params: e.params,
                    duration: e.duration
                });
            }

            // Check for sensitive field access
            if (DatabaseSecurity.containsSensitiveFields(e.query)) {
                console.warn('[DB SECURITY] Sensitive fields accessed:', {
                    query: e.query.substring(0, 100) + '...',
                    params: e.params
                });
            }
        });

        // Monitor errors for security analysis
        this.$on('error', (e) => {
            console.error('[DB ERROR] Database error occurred:', {
                message: e.message,
                target: e.target,
                timestamp: new Date().toISOString()
            });

            // Log security-relevant errors
            if (e.message.includes('syntax') || e.message.includes('invalid')) {
                console.warn('[DB SECURITY] Potential SQL injection attempt detected');
            }
        });

        // Monitor info events
        this.$on('info', (e) => {
            if (process.env.NODE_ENV === 'development') {
                console.log('[DB INFO]', e.message);
            }
        });

        // Monitor warnings
        this.$on('warn', (e) => {
            console.warn('[DB WARN]', e.message);
        });
    }

    private logQuery(query: string, params: any, startTime: number) {
        const duration = Date.now() - startTime;

        const queryLog: DatabaseQueryLog = {
            query,
            params,
            duration,
            timestamp: new Date(),
            userId: this.extractUserIdFromParams(params),
            ipAddress: this.extractIPFromParams(params)
        };

        DatabaseSecurity.logDatabaseQuery(queryLog);
    }

    private extractUserIdFromParams(params: any): number | undefined {
        if (!params) return undefined;

        // Try to extract user ID from common parameter names
        const userIdFields = ['userId', 'user_id', 'id', 'user'];
        for (const field of userIdFields) {
            if (params[field] && typeof params[field] === 'number') {
                return params[field];
            }
        }

        return undefined;
    }

    private extractIPFromParams(params: any): string | undefined {
        if (!params) return undefined;

        // Try to extract IP from common parameter names
        const ipFields = ['ipAddress', 'ip_address', 'ip', 'clientIP'];
        for (const field of ipFields) {
            if (params[field] && typeof params[field] === 'string') {
                return params[field];
            }
        }

        return undefined;
    }

    // Secure user operations with validation
    async findUserByEmail(email: string, ipAddress?: string) {
        // Validate email format
        if (!DatabaseSecurity.validateEmail(email)) {
            throw new Error('Invalid email format');
        }

        // Check rate limiting
        if (!DatabaseSecurity.checkRateLimit('findUserByEmail', undefined, 20, 60000)) {
            throw new Error('Rate limit exceeded for user lookup');
        }

        // Sanitize email
        const sanitizedEmail = email.trim().toLowerCase();

        // Log database access
        DatabaseSecurity.logDatabaseAccess({
            userId: undefined,
            action: 'FIND_USER_BY_EMAIL',
            table: 'user',
            details: `Email lookup: ${sanitizedEmail}`,
            ipAddress,
            success: true
        });

        return this.user.findUnique({
            where: { email: sanitizedEmail },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                createdAt: true,
                updatedAt: true,
                lastLoginAt: true,
                isActive: true,
                role: true,
                failedLoginAttempts: true,
                lockedUntil: true,
                lastPasswordChange: true,
                passwordVersion: true
            }
        });
    }

    async createUser(userData: any, ipAddress?: string) {
        // Validate user data
        const validation = DatabaseSecurity.validateUserData(userData);
        if (!validation.isValid) {
            throw new Error(`Invalid user data: ${validation.errors.join(', ')}`);
        }

        // Check rate limiting
        if (!DatabaseSecurity.checkRateLimit('createUser', undefined, 5, 3600000)) { // 5 per hour
            throw new Error('Rate limit exceeded for user creation');
        }

        // Sanitize user data
        const sanitizedData = DatabaseSecurity.sanitizeUserData(userData);

        // Log database access
        DatabaseSecurity.logDatabaseAccess({
            userId: undefined,
            action: 'CREATE_USER',
            table: 'user',
            details: `New user: ${sanitizedData.email}`,
            ipAddress,
            success: true
        });

        return this.user.create({
            data: {
                name: sanitizedData.name,
                email: sanitizedData.email,
                password: sanitizedData.password, // Should be hashed
                confirmpassword: sanitizedData.password, // Should be hashed
                createdAt: new Date()
            }
        });
    }

    async updateUser(userId: number, updateData: any, ipAddress?: string) {
        // Validate user ID
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            throw new Error('Invalid user ID');
        }

        // Check rate limiting
        if (!DatabaseSecurity.checkRateLimit('updateUser', userId, 50, 60000)) { // 50 per minute
            throw new Error('Rate limit exceeded for user updates');
        }

        // Validate update data
        const validation = DatabaseSecurity.validateUserData(updateData);
        if (!validation.isValid) {
            throw new Error(`Invalid update data: ${validation.errors.join(', ')}`);
        }

        // Sanitize update data
        const sanitizedData = DatabaseSecurity.sanitizeUserData(updateData);

        // Log database access
        DatabaseSecurity.logDatabaseAccess({
            userId,
            action: 'UPDATE_USER',
            table: 'user',
            details: `User update: ${userId}`,
            ipAddress,
            success: true
        });

        return this.user.update({
            where: { id: userId },
            data: sanitizedData
        });
    }

    async deleteUser(userId: number, ipAddress?: string) {
        // Validate user ID
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            throw new Error('Invalid user ID');
        }

        // Check rate limiting
        if (!DatabaseSecurity.checkRateLimit('deleteUser', userId, 3, 3600000)) { // 3 per hour
            throw new Error('Rate limit exceeded for user deletion');
        }

        // Log database access
        DatabaseSecurity.logDatabaseAccess({
            userId,
            action: 'DELETE_USER',
            table: 'user',
            details: `User deletion: ${userId}`,
            ipAddress,
            success: true
        });

        return this.user.delete({
            where: { id: userId }
        });
    }

    // Secure profile operations
    async getUserProfile(userId: number, ipAddress?: string) {
        // Validate user ID
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            throw new Error('Invalid user ID');
        }

        // Check rate limiting
        if (!DatabaseSecurity.checkRateLimit('getUserProfile', userId, 100, 60000)) { // 100 per minute
            throw new Error('Rate limit exceeded for profile access');
        }

        // Log database access
        DatabaseSecurity.logDatabaseAccess({
            userId,
            action: 'GET_USER_PROFILE',
            table: 'user',
            details: `Profile access: ${userId}`,
            ipAddress,
            success: true
        });

        return this.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });
    }

    // Secure search operations
    async searchUsers(searchTerm: string, ipAddress?: string) {
        // Validate search term
        if (!searchTerm || typeof searchTerm !== 'string') {
            throw new Error('Invalid search term');
        }

        // Check for SQL injection patterns
        if (!DatabaseSecurity.validateQueryParams({ searchTerm })) {
            throw new Error('Invalid search term detected');
        }

        // Check rate limiting
        if (!DatabaseSecurity.checkRateLimit('searchUsers', undefined, 30, 60000)) { // 30 per minute
            throw new Error('Rate limit exceeded for user search');
        }

        // Sanitize search term
        const sanitizedTerm = DatabaseSecurity.sanitizeInput(searchTerm, 100);

        // Log database access
        DatabaseSecurity.logDatabaseAccess({
            userId: undefined,
            action: 'SEARCH_USERS',
            table: 'user',
            details: `Search term: ${sanitizedTerm}`,
            ipAddress,
            success: true
        });

        return this.user.findMany({
            where: {
                OR: [
                    { name: { contains: sanitizedTerm, mode: 'insensitive' } },
                    { email: { contains: sanitizedTerm, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            },
            take: 10 // Limit results
        });
    }
}

// Export singleton instance
export const SecurePrisma = new SecurePrismaClient();

// Export the class for testing
export { SecurePrismaClient };
