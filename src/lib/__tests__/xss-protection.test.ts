import { InputSanitizer } from '../input-sanitizer';

describe('InputSanitizer - XSS Protection Tests', () => {
    describe('sanitizeString', () => {
        it('should remove script tags', () => {
            const maliciousInput = '<script>alert("XSS")</script>Hello World';
            const sanitized = InputSanitizer.sanitizeString(maliciousInput);
            expect(sanitized).toBe('Hello World');
        });

        it('should remove iframe tags', () => {
            const maliciousInput = '<iframe src="javascript:alert(1)"></iframe>Content';
            const sanitized = InputSanitizer.sanitizeString(maliciousInput);
            expect(sanitized).toBe('Content');
        });

        it('should remove event handlers', () => {
            const maliciousInput = 'Hello<img src="x" onerror="alert(1)">World';
            const sanitized = InputSanitizer.sanitizeString(maliciousInput);
            expect(sanitized).toBe('HelloWorld');
        });

        it('should remove javascript protocol', () => {
            const maliciousInput = 'Click here: javascript:alert("XSS")';
            const sanitized = InputSanitizer.sanitizeString(maliciousInput);
            expect(sanitized).toBe('Click here: ');
        });

        it('should remove vbscript protocol', () => {
            const maliciousInput = 'Click here: vbscript:msgbox("XSS")';
            const sanitized = InputSanitizer.sanitizeString(maliciousInput);
            expect(sanitized).toBe('Click here: ');
        });

        it('should remove data protocol', () => {
            const maliciousInput = 'Click here: data:text/html,<script>alert(1)</script>';
            const sanitized = InputSanitizer.sanitizeString(maliciousInput);
            expect(sanitized).toBe('Click here: ');
        });

        it('should remove HTML tags', () => {
            const maliciousInput = '<div>Hello</div><span>World</span>';
            const sanitized = InputSanitizer.sanitizeString(maliciousInput);
            expect(sanitized).toBe('HelloWorld');
        });

        it('should remove CSS expressions', () => {
            const maliciousInput = 'Hello expression(alert(1)) World';
            const sanitized = InputSanitizer.sanitizeString(maliciousInput);
            expect(sanitized).toBe('Hello  World');
        });

        it('should limit input length', () => {
            const longInput = 'A'.repeat(2000);
            const sanitized = InputSanitizer.sanitizeString(longInput, 1000);
            expect(sanitized.length).toBe(1000);
        });

        it('should preserve safe text', () => {
            const safeInput = 'Hello World! This is safe text with numbers 123 and symbols @#$%';
            const sanitized = InputSanitizer.sanitizeString(safeInput);
            expect(sanitized).toBe(safeInput);
        });

        it('should handle empty input', () => {
            expect(InputSanitizer.sanitizeString('')).toBe('');
            expect(InputSanitizer.sanitizeString(null as any)).toBe('');
            expect(InputSanitizer.sanitizeString(undefined as any)).toBe('');
        });
    });

    describe('sanitizeHTML', () => {
        it('should escape HTML entities', () => {
            const maliciousInput = '<script>alert("XSS")</script>';
            const sanitized = InputSanitizer.sanitizeHTML(maliciousInput);
            expect(sanitized).toContain('&lt;script&gt;');
            expect(sanitized).toContain('&gt;');
        });

        it('should handle special characters', () => {
            const input = 'Hello & World < > " \' /';
            const sanitized = InputSanitizer.sanitizeHTML(input);
            expect(sanitized).toBe('Hello &amp; World &lt; &gt; &quot; &#x27; &#x2F;');
        });
    });

    describe('validateInput', () => {
        it('should detect XSS patterns', () => {
            const maliciousInput = '<script>alert("XSS")</script>';
            const validation = InputSanitizer.validateInput(maliciousInput);
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('Input contains potentially dangerous content');
        });

        it('should detect HTML tags', () => {
            const input = '<div>Hello</div>';
            const validation = InputSanitizer.validateInput(input);
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('Input contains HTML tags');
        });

        it('should detect dangerous protocols', () => {
            const input = 'javascript:alert(1)';
            const validation = InputSanitizer.validateInput(input);
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('Input contains potentially dangerous protocols');
        });

        it('should validate safe input', () => {
            const safeInput = 'Hello World! This is safe text.';
            const validation = InputSanitizer.validateInput(safeInput);
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });

        it('should check length limits', () => {
            const longInput = 'A'.repeat(1500);
            const validation = InputSanitizer.validateInput(longInput, 1000);
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('Input exceeds maximum length of 1000 characters');
        });
    });

    describe('containsXSSPatterns', () => {
        it('should detect script tags', () => {
            expect(InputSanitizer.containsXSSPatterns('<script>alert(1)</script>')).toBe(true);
        });

        it('should detect iframe tags', () => {
            expect(InputSanitizer.containsXSSPatterns('<iframe src="javascript:alert(1)"></iframe>')).toBe(true);
        });

        it('should detect event handlers', () => {
            expect(InputSanitizer.containsXSSPatterns('<img onerror="alert(1)">')).toBe(true);
        });

        it('should detect javascript protocol', () => {
            expect(InputSanitizer.containsXSSPatterns('javascript:alert(1)')).toBe(true);
        });

        it('should not detect safe content', () => {
            expect(InputSanitizer.containsXSSPatterns('Hello World!')).toBe(false);
        });
    });

    describe('sanitizeProfileData', () => {
        it('should sanitize nested profile data', () => {
            const profileData = {
                name: 'John Doe',
                medicalHistory: '<script>alert("XSS")</script>Allergic to penicillin',
                lifestyle: 'Vegetarian, <iframe>exercise</iframe> 3 times a week'
            };

            const sanitized = InputSanitizer.sanitizeProfileData(profileData);

            expect(sanitized.name).toBe('John Doe');
            expect(sanitized.medicalHistory).toBe('Allergic to penicillin');
            expect(sanitized.lifestyle).toBe('Vegetarian, exercise 3 times a week');
        });

        it('should handle non-string values', () => {
            const profileData = {
                age: 30,
                isActive: true,
                preferences: null
            };

            const sanitized = InputSanitizer.sanitizeProfileData(profileData);
            expect(sanitized.age).toBe(30);
            expect(sanitized.isActive).toBe(true);
            expect(sanitized.preferences).toBe(null);
        });
    });

    describe('sanitizeChatMessage', () => {
        it('should allow longer messages', () => {
            const longMessage = 'A'.repeat(6000);
            const sanitized = InputSanitizer.sanitizeChatMessage(longMessage);
            expect(sanitized.length).toBe(5000);
        });

        it('should remove XSS from chat messages', () => {
            const maliciousMessage = 'Hello <script>alert("XSS")</script> World!';
            const sanitized = InputSanitizer.sanitizeChatMessage(maliciousMessage);
            expect(sanitized).toBe('Hello  World!');
        });
    });

    describe('sanitizeSearchQuery', () => {
        it('should limit search query length', () => {
            const longQuery = 'A'.repeat(1000);
            const sanitized = InputSanitizer.sanitizeSearchQuery(longQuery);
            expect(sanitized.length).toBe(500);
        });

        it('should sanitize search queries', () => {
            const maliciousQuery = 'health <script>alert(1)</script> tips';
            const sanitized = InputSanitizer.sanitizeSearchQuery(maliciousQuery);
            expect(sanitized).toBe('health  tips');
        });
    });

    describe('sanitizeFormData', () => {
        it('should sanitize form data', () => {
            const formData = {
                name: 'John',
                email: 'john@example.com',
                message: '<script>alert("XSS")</script>Hello World'
            };

            const sanitized = InputSanitizer.sanitizeFormData(formData);

            expect(sanitized.name).toBe('John');
            expect(sanitized.email).toBe('john@example.com');
            expect(sanitized.message).toBe('Hello World');
        });
    });

    describe('Edge Cases', () => {
        it('should handle mixed case XSS patterns', () => {
            const maliciousInput = '<SCRIPT>alert("XSS")</SCRIPT>';
            const sanitized = InputSanitizer.sanitizeString(maliciousInput);
            expect(sanitized).toBe('');
        });

        it('should handle nested tags', () => {
            const maliciousInput = '<div><script>alert(1)</script><span>Hello</span></div>';
            const sanitized = InputSanitizer.sanitizeString(maliciousInput);
            expect(sanitized).toBe('Hello');
        });

        it('should handle malformed HTML', () => {
            const maliciousInput = '<script>alert(1)<script>Hello World';
            const sanitized = InputSanitizer.sanitizeString(maliciousInput);
            expect(sanitized).toBe('Hello World');
        });

        it('should handle unicode characters', () => {
            const input = 'Hello 世界 <script>alert(1)</script> World';
            const sanitized = InputSanitizer.sanitizeString(input);
            expect(sanitized).toBe('Hello 世界  World');
        });
    });
});
