import { DatabaseSecurity } from '../database-security';

describe('DatabaseSecurity - Database Security Tests', () => {
    describe('Email Validation', () => {
        it('should validate correct email formats', () => {
            expect(DatabaseSecurity.validateEmail('test@example.com')).toBe(true);
            expect(DatabaseSecurity.validateEmail('user.name@domain.co.uk')).toBe(true);
            expect(DatabaseSecurity.validateEmail('a@b.c')).toBe(true);
        });

        it('should reject invalid email formats', () => {
            expect(DatabaseSecurity.validateEmail('invalid-email')).toBe(false);
            expect(DatabaseSecurity.validateEmail('@example.com')).toBe(false);
            expect(DatabaseSecurity.validateEmail('test@')).toBe(false);
            expect(DatabaseSecurity.validateEmail('')).toBe(false);
            expect(DatabaseSecurity.validateEmail(null as any)).toBe(false);
        });

        it('should enforce email length limits', () => {
            const longEmail = 'a'.repeat(250) + '@example.com';
            expect(DatabaseSecurity.validateEmail(longEmail)).toBe(false);

            const shortEmail = 'a@b.c';
            expect(DatabaseSecurity.validateEmail(shortEmail)).toBe(true);
        });
    });

    describe('Input Sanitization', () => {
        it('should remove dangerous HTML tags', () => {
            const input = '<script>alert("XSS")</script>Hello World';
            const sanitized = DatabaseSecurity.sanitizeInput(input);
            expect(sanitized).toBe('Hello World');
        });

        it('should remove event handlers', () => {
            const input = 'Hello<img onerror="alert(1)">World';
            const sanitized = DatabaseSecurity.sanitizeInput(input);
            expect(sanitized).toBe('HelloWorld');
        });

        it('should remove javascript protocol', () => {
            const input = 'Click here: javascript:alert("XSS")';
            const sanitized = DatabaseSecurity.sanitizeInput(input);
            expect(sanitized).toBe('Click here: ');
        });

        it('should limit input length', () => {
            const longInput = 'A'.repeat(2000);
            const sanitized = DatabaseSecurity.sanitizeInput(longInput, 1000);
            expect(sanitized.length).toBe(1000);
        });

        it('should handle empty input', () => {
            expect(DatabaseSecurity.sanitizeInput('')).toBe('');
            expect(DatabaseSecurity.sanitizeInput(null as any)).toBe('');
            expect(DatabaseSecurity.sanitizeInput(undefined as any)).toBe('');
        });
    });

    describe('Name Validation', () => {
        it('should validate correct name formats', () => {
            expect(DatabaseSecurity.validateName('John Doe')).toBe(true);
            expect(DatabaseSecurity.validateName('Mary-Jane')).toBe(true);
            expect(DatabaseSecurity.validateName("O'Connor")).toBe(true);
            expect(DatabaseSecurity.validateName('José')).toBe(true);
        });

        it('should reject invalid name formats', () => {
            expect(DatabaseSecurity.validateName('123')).toBe(false);
            expect(DatabaseSecurity.validateName('<script>alert(1)</script>')).toBe(false);
            expect(DatabaseSecurity.validateName('')).toBe(false);
            expect(DatabaseSecurity.validateName('A')).toBe(false); // Too short
        });

        it('should enforce name length limits', () => {
            const longName = 'A'.repeat(150);
            expect(DatabaseSecurity.validateName(longName)).toBe(false);
        });
    });

    describe('Query Security', () => {
        it('should detect sensitive operations', () => {
            expect(DatabaseSecurity.isSensitiveQuery('DELETE FROM users')).toBe(true);
            expect(DatabaseSecurity.isSensitiveQuery('DROP TABLE users')).toBe(true);
            expect(DatabaseSecurity.isSensitiveQuery('ALTER TABLE users')).toBe(true);
            expect(DatabaseSecurity.isSensitiveQuery('SELECT * FROM users')).toBe(true);
            expect(DatabaseSecurity.isSensitiveQuery('UNION SELECT password')).toBe(true);
        });

        it('should not flag normal queries', () => {
            expect(DatabaseSecurity.isSensitiveQuery('SELECT id, name FROM users WHERE email = ?')).toBe(false);
            expect(DatabaseSecurity.isSensitiveQuery('INSERT INTO users (name, email) VALUES (?, ?)')).toBe(false);
            expect(DatabaseSecurity.isSensitiveQuery('UPDATE users SET name = ? WHERE id = ?')).toBe(false);
        });

        it('should detect sensitive fields', () => {
            expect(DatabaseSecurity.containsSensitiveFields('SELECT password FROM users')).toBe(true);
            expect(DatabaseSecurity.containsSensitiveFields('SELECT token FROM sessions')).toBe(true);
            expect(DatabaseSecurity.containsSensitiveFields('SELECT secret FROM config')).toBe(true);
        });

        it('should not flag normal fields', () => {
            expect(DatabaseSecurity.containsSensitiveFields('SELECT name, email FROM users')).toBe(false);
            expect(DatabaseSecurity.containsSensitiveFields('SELECT title, content FROM posts')).toBe(false);
        });
    });

    describe('Parameter Validation', () => {
        it('should validate safe parameters', () => {
            const safeParams = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };
            expect(DatabaseSecurity.validateQueryParams(safeParams)).toBe(true);
        });

        it('should reject dangerous parameters', () => {
            const dangerousParams = {
                name: 'John<script>alert(1)</script>',
                search: 'UNION SELECT password FROM users',
                query: 'javascript:alert(1)'
            };
            expect(DatabaseSecurity.validateQueryParams(dangerousParams)).toBe(false);
        });

        it('should handle empty parameters', () => {
            expect(DatabaseSecurity.validateQueryParams({})).toBe(true);
            expect(DatabaseSecurity.validateQueryParams(null as any)).toBe(true);
        });
    });

    describe('User Data Validation', () => {
        it('should validate correct user data', () => {
            const validUserData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'securePassword123'
            };
            const validation = DatabaseSecurity.validateUserData(validUserData);
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });

        it('should reject invalid user data', () => {
            const invalidUserData = {
                name: '<script>alert(1)</script>',
                email: 'invalid-email',
                password: '123'
            };
            const validation = DatabaseSecurity.validateUserData(invalidUserData);
            expect(validation.isValid).toBe(false);
            expect(validation.errors.length).toBeGreaterThan(0);
        });

        it('should handle missing fields', () => {
            const partialUserData = {
                name: 'John Doe'
            };
            const validation = DatabaseSecurity.validateUserData(partialUserData);
            expect(validation.isValid).toBe(true);
        });
    });

    describe('User Data Sanitization', () => {
        it('should sanitize user data correctly', () => {
            const rawUserData = {
                name: '  John<script>alert(1)</script>Doe  ',
                email: '  JOHN@EXAMPLE.COM  ',
                password: 'hashedPassword123'
            };

            const sanitized = DatabaseSecurity.sanitizeUserData(rawUserData);

            expect(sanitized.name).toBe('JohnDoe');
            expect(sanitized.email).toBe('john@example.com');
            expect(sanitized.password).toBe('hashedPassword123'); // Password should not be sanitized
        });

        it('should handle non-string values', () => {
            const mixedData = {
                name: 'John Doe',
                age: 30,
                isActive: true,
                preferences: null
            };

            const sanitized = DatabaseSecurity.sanitizeUserData(mixedData);

            expect(sanitized.name).toBe('John Doe');
            expect(sanitized.age).toBe(30);
            expect(sanitized.isActive).toBe(true);
            expect(sanitized.preferences).toBe(null);
        });
    });

    describe('IP Address Security', () => {
        it('should allow localhost for development', () => {
            expect(DatabaseSecurity.isSuspiciousIP('127.0.0.1')).toBe(false);
            expect(DatabaseSecurity.isSuspiciousIP('::1')).toBe(false);
        });

        it('should detect private network abuse', () => {
            expect(DatabaseSecurity.isSuspiciousIP('10.0.0.1')).toBe(true);
            expect(DatabaseSecurity.isSuspiciousIP('172.16.0.1')).toBe(true);
            expect(DatabaseSecurity.isSuspiciousIP('192.168.1.1')).toBe(true);
        });

        it('should allow public IPs', () => {
            expect(DatabaseSecurity.isSuspiciousIP('8.8.8.8')).toBe(false);
            expect(DatabaseSecurity.isSuspiciousIP('1.1.1.1')).toBe(false);
        });
    });

    describe('Rate Limiting', () => {
        it('should allow operations within rate limits', () => {
            expect(DatabaseSecurity.checkRateLimit('test', 1, 10, 60000)).toBe(true);
            expect(DatabaseSecurity.checkRateLimit('test', 2, 10, 60000)).toBe(true);
        });

        it('should enforce rate limits', () => {
            const operation = 'rateLimitTest';
            const userId = 123;

            // Allow first 10 operations
            for (let i = 0; i < 10; i++) {
                expect(DatabaseSecurity.checkRateLimit(operation, userId, 10, 60000)).toBe(true);
            }

            // 11th operation should be blocked
            expect(DatabaseSecurity.checkRateLimit(operation, userId, 10, 60000)).toBe(false);
        });

        it('should reset rate limits after window', () => {
            const operation = 'resetTest';
            const userId = 456;

            // Use a very short window for testing
            expect(DatabaseSecurity.checkRateLimit(operation, userId, 1, 1)).toBe(true);

            // Wait for window to expire
            setTimeout(() => {
                expect(DatabaseSecurity.checkRateLimit(operation, userId, 1, 1)).toBe(true);
            }, 10);
        });
    });

    describe('Audit Logging', () => {
        it('should create audit log entries', () => {
            const auditLog = DatabaseSecurity.createAuditLog(
                123,
                'TEST_ACTION',
                'test_table',
                'Test details',
                '192.168.1.1',
                'Test User Agent'
            );

            expect(auditLog.userId).toBe(123);
            expect(auditLog.action).toBe('TEST_ACTION');
            expect(auditLog.table).toBe('test_table');
            expect(auditLog.details).toBe('Test details');
            expect(auditLog.ipAddress).toBe('192.168.1.1');
            expect(auditLog.userAgent).toBe('Test User Agent');
            expect(auditLog.success).toBe(true);
        });

        it('should handle missing optional fields', () => {
            const auditLog = DatabaseSecurity.createAuditLog(
                123,
                'TEST_ACTION',
                'test_table'
            );

            expect(auditLog.userId).toBe(123);
            expect(auditLog.action).toBe('TEST_ACTION');
            expect(auditLog.table).toBe('test_table');
            expect(auditLog.details).toBeUndefined();
            expect(auditLog.ipAddress).toBeUndefined();
            expect(auditLog.userAgent).toBeUndefined();
        });
    });

    describe('Edge Cases', () => {
        it('should handle very long inputs', () => {
            const veryLongInput = 'A'.repeat(10000);
            const sanitized = DatabaseSecurity.sanitizeInput(veryLongInput, 1000);
            expect(sanitized.length).toBe(1000);
        });

        it('should handle special characters in names', () => {
            expect(DatabaseSecurity.validateName('José María')).toBe(true);
            expect(DatabaseSecurity.validateName('Jean-Pierre')).toBe(true);
            expect(DatabaseSecurity.validateName("O'Connor-Smith")).toBe(true);
        });

        it('should handle mixed case in queries', () => {
            expect(DatabaseSecurity.isSensitiveQuery('SeLeCt * FrOm UsErS')).toBe(true);
            expect(DatabaseSecurity.isSensitiveQuery('DeLeTe FrOm UsErS')).toBe(true);
        });

        it('should handle null and undefined values', () => {
            expect(DatabaseSecurity.validateEmail(null as any)).toBe(false);
            expect(DatabaseSecurity.validateName(undefined as any)).toBe(false);
            expect(DatabaseSecurity.sanitizeInput(null as any)).toBe('');
        });
    });
});
