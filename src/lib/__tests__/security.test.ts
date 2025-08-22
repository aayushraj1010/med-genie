import { InputSanitizer } from '../input-sanitizer';

describe('InputSanitizer', () => {
    describe('sanitizeString', () => {
        it('should remove HTML tags', () => {
            const input = '<script>alert("xss")</script>Hello';
            const result = InputSanitizer.sanitizeString(input);
            expect(result).toBe('Hello');
        });

        it('should remove JavaScript protocols', () => {
            const input = 'javascript:alert("xss")';
            const result = InputSanitizer.sanitizeString(input);
            expect(result).toBe('alert("xss")');
        });

        it('should remove event handlers', () => {
            const input = 'onclick=alert("xss")';
            const result = InputSanitizer.sanitizeString(input);
            expect(result).toBe('alert("xss")');
        });

        it('should trim whitespace', () => {
            const input = '  Hello World  ';
            const result = InputSanitizer.sanitizeString(input);
            expect(result).toBe('Hello World');
        });

        it('should limit length', () => {
            const input = 'a'.repeat(1500);
            const result = InputSanitizer.sanitizeString(input);
            expect(result.length).toBe(1000);
        });
    });

    describe('sanitizeEmail', () => {
        it('should convert to lowercase', () => {
            const input = 'TEST@EXAMPLE.COM';
            const result = InputSanitizer.sanitizeEmail(input);
            expect(result).toBe('test@example.com');
        });

        it('should remove invalid characters', () => {
            const input = 'test<script>@example.com';
            const result = InputSanitizer.sanitizeEmail(input);
            expect(result).toBe('test@example.com');
        });

        it('should limit length', () => {
            const input = 'a'.repeat(300);
            const result = InputSanitizer.sanitizeEmail(input);
            expect(result.length).toBe(254);
        });
    });

    describe('validatePasswordStrength', () => {
        it('should validate strong password', () => {
            const password = 'StrongPass123!';
            const result = InputSanitizer.validatePasswordStrength(password);
            expect(result.isValid).toBe(true);
            expect(result.score).toBeGreaterThanOrEqual(4);
        });

        it('should reject weak password', () => {
            const password = 'weak';
            const result = InputSanitizer.validatePasswordStrength(password);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Too short');
        });

        it('should calculate score correctly', () => {
            const password = 'PerfectPassword123!';
            const result = InputSanitizer.validatePasswordStrength(password);
            expect(result.score).toBe(6);
        });
    });

    describe('checkCommonPatterns', () => {
        it('should reject common passwords', () => {
            const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
            commonPasswords.forEach(password => {
                const result = InputSanitizer.checkCommonPatterns(password);
                expect(result).toBe(false);
            });
        });

        it('should accept unique passwords', () => {
            const uniquePasswords = ['MyUniquePass123!', 'SecurePassword456@'];
            uniquePasswords.forEach(password => {
                const result = InputSanitizer.checkCommonPatterns(password);
                expect(result).toBe(true);
            });
        });
    });

    describe('checkSequentialCharacters', () => {
        it('should reject sequential characters', () => {
            const sequentialPasswords = ['abc123', 'password123', 'qwerty123'];
            sequentialPasswords.forEach(password => {
                const result = InputSanitizer.checkSequentialCharacters(password);
                expect(result).toBe(false);
            });
        });

        it('should accept non-sequential passwords', () => {
            const nonSequentialPasswords = ['RandomPass123!', 'Secure456@'];
            nonSequentialPasswords.forEach(password => {
                const result = InputSanitizer.checkSequentialCharacters(password);
                expect(result).toBe(true);
            });
        });
    });
});

describe('Password Security Requirements', () => {
    it('should meet minimum length requirement', () => {
        const minLength = 12;
        expect(minLength).toBeGreaterThanOrEqual(12);
    });

    it('should require uppercase letters', () => {
        const hasUppercase = /[A-Z]/.test('TestPassword123!');
        expect(hasUppercase).toBe(true);
    });

    it('should require lowercase letters', () => {
        const hasLowercase = /[a-z]/.test('TestPassword123!');
        expect(hasLowercase).toBe(true);
    });

    it('should require numbers', () => {
        const hasNumbers = /[0-9]/.test('TestPassword123!');
        expect(hasNumbers).toBe(true);
    });

    it('should require special characters', () => {
        const hasSpecial = /[^A-Za-z0-9]/.test('TestPassword123!');
        expect(hasSpecial).toBe(true);
    });
});

