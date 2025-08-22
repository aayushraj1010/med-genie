export class InputSanitizer {
  // Comprehensive XSS protection patterns
  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
    /javascript:/gi, // JavaScript protocol
    /vbscript:/gi, // VBScript protocol
    /on\w+\s*=/gi, // Event handlers
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, // Iframe tags
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, // Object tags
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, // Embed tags
    /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, // Link tags
    /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, // Meta tags
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, // Style tags
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, // Form tags
    /<input\b[^<]*(?:(?!<\/input>)<[^<]*)*>/gi, // Input tags
    /<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*>/gi, // Textarea tags
    /<select\b[^<]*(?:(?!<\/select>)<[^<]*)*>/gi, // Select tags
    /<button\b[^<]*(?:(?!<\/button>)<[^<]*)*>/gi, // Button tags
    /<a\b[^<]*(?:(?!<\/a>)<[^<]*)*>/gi, // Anchor tags
    /<img\b[^<]*(?:(?!<\/img>)<[^<]*)*>/gi, // Image tags
    /<div\b[^<]*(?:(?!<\/div>)<[^<]*)*>/gi, // Div tags
    /<span\b[^<]*(?:(?!<\/span>)<[^<]*)*>/gi, // Span tags
    /<p\b[^<]*(?:(?!<\/p>)<[^<]*)*>/gi, // Paragraph tags
    /<br\b[^<]*(?:(?!<\/br>)<[^<]*)*>/gi, // Break tags
    /<hr\b[^<]*(?:(?!<\/hr>)<[^<]*)*>/gi, // Horizontal rule tags
    /<h[1-6]\b[^<]*(?:(?!<\/h[1-6]>)<[^<]*)*<\/h[1-6]>/gi, // Heading tags
    /<ul\b[^<]*(?:(?!<\/ul>)<[^<]*)*<\/ul>/gi, // Unordered list tags
    /<ol\b[^<]*(?:(?!<\/ol>)<[^<]*)*<\/ol>/gi, // Ordered list tags
    /<li\b[^<]*(?:(?!<\/li>)<[^<]*)*<\/li>/gi, // List item tags
    /<table\b[^<]*(?:(?!<\/table>)<[^<]*)*<\/table>/gi, // Table tags
    /<tr\b[^<]*(?:(?!<\/tr>)<[^<]*)*<\/tr>/gi, // Table row tags
    /<td\b[^<]*(?:(?!<\/td>)<[^<]*)*<\/td>/gi, // Table data tags
    /<th\b[^<]*(?:(?!<\/th>)<[^<]*)*<\/th>/gi, // Table header tags
    /<thead\b[^<]*(?:(?!<\/thead>)<[^<]*)*<\/thead>/gi, // Table head tags
    /<tbody\b[^<]*(?:(?!<\/tbody>)<[^<]*)*<\/tbody>/gi, // Table body tags
    /<tfoot\b[^<]*(?:(?!<\/tfoot>)<[^<]*)*<\/tfoot>/gi, // Table footer tags
    /<caption\b[^<]*(?:(?!<\/caption>)<[^<]*)*<\/caption>/gi, // Table caption tags
    /<colgroup\b[^<]*(?:(?!<\/colgroup>)<[^<]*)*<\/colgroup>/gi, // Column group tags
    /<col\b[^<]*(?:(?!<\/col>)<[^<]*)*>/gi, // Column tags
    /<fieldset\b[^<]*(?:(?!<\/fieldset>)<[^<]*)*<\/fieldset>/gi, // Fieldset tags
    /<legend\b[^<]*(?:(?!<\/legend>)<[^<]*)*<\/legend>/gi, // Legend tags
    /<label\b[^<]*(?:(?!<\/label>)<[^<]*)*<\/label>/gi, // Label tags
    /<optgroup\b[^<]*(?:(?!<\/optgroup>)<[^<]*)*<\/optgroup>/gi, // Option group tags
    /<option\b[^<]*(?:(?!<\/option>)<[^<]*)*<\/option>/gi, // Option tags
    /<datalist\b[^<]*(?:(?!<\/datalist>)<[^<]*)*<\/datalist>/gi, // Data list tags
    /<output\b[^<]*(?:(?!<\/output>)<[^<]*)*<\/output>/gi, // Output tags
    /<progress\b[^<]*(?:(?!<\/progress>)<[^<]*)*<\/progress>/gi, // Progress tags
    /<meter\b[^<]*(?:(?!<\/meter>)<[^<]*)*<\/meter>/gi, // Meter tags
    /<details\b[^<]*(?:(?!<\/details>)<[^<]*)*<\/details>/gi, // Details tags
    /<summary\b[^<]*(?:(?!<\/summary>)<[^<]*)*<\/summary>/gi, // Summary tags
    /<dialog\b[^<]*(?:(?!<\/dialog>)<[^<]*)*<\/dialog>/gi, // Dialog tags
    /<menu\b[^<]*(?:(?!<\/menu>)<[^<]*)*<\/menu>/gi, // Menu tags
    /<menuitem\b[^<]*(?:(?!<\/menuitem>)<[^<]*)*<\/menuitem>/gi, // Menu item tags
    /<command\b[^<]*(?:(?!<\/command>)<[^<]*)*<\/command>/gi, // Command tags
    /<keygen\b[^<]*(?:(?!<\/keygen>)<[^<]*)*<\/keygen>/gi, // Keygen tags
    /<source\b[^<]*(?:(?!<\/source>)<[^<]*)*<\/source>/gi, // Source tags
    /<track\b[^<]*(?:(?!<\/track>)<[^<]*)*<\/track>/gi, // Track tags
    /<video\b[^<]*(?:(?!<\/video>)<[^<]*)*<\/video>/gi, // Video tags
    /<audio\b[^<]*(?:(?!<\/audio>)<[^<]*)*<\/audio>/gi, // Audio tags
    /<canvas\b[^<]*(?:(?!<\/canvas>)<[^<]*)*<\/canvas>/gi, // Canvas tags
    /<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, // SVG tags
    /<math\b[^<]*(?:(?!<\/math>)<[^<]*)*<\/math>/gi, // MathML tags
    /<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, // Applet tags
    /<basefont\b[^<]*(?:(?!<\/basefont>)<[^<]*)*<\/basefont>/gi, // Basefont tags
    /<bgsound\b[^<]*(?:(?!<\/bgsound>)<[^<]*)*<\/bgsound>/gi, // Bgsound tags
    /<blink\b[^<]*(?:(?!<\/blink>)<[^<]*)*<\/blink>/gi, // Blink tags
    /<marquee\b[^<]*(?:(?!<\/marquee>)<[^<]*)*<\/marquee>/gi, // Marquee tags
    /<nobr\b[^<]*(?:(?!<\/nobr>)<[^<]*)*<\/nobr>/gi, // Nobr tags
    /<noembed\b[^<]*(?:(?!<\/noembed>)<[^<]*)*<\/noembed>/gi, // Noembed tags
    /<noframes\b[^<]*(?:(?!<\/noframes>)<[^<]*)*<\/noframes>/gi, // Noframes tags
    /<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, // Noscript tags
    /<plaintext\b[^<]*(?:(?!<\/plaintext>)<[^<]*)*<\/plaintext>/gi, // Plaintext tags
    /<listing\b[^<]*(?:(?!<\/listing>)<[^<]*)*<\/listing>/gi, // Listing tags
    /<xmp\b[^<]*(?:(?!<\/xmp>)<[^<]*)*<\/xmp>/gi, // XMP tags
    /<nextid\b[^<]*(?:(?!<\/nextid>)<[^<]*)*<\/nextid>/gi, // Nextid tags
    /<spacer\b[^<]*(?:(?!<\/spacer>)<[^<]*)*<\/spacer>/gi, // Spacer tags
    /<wbr\b[^<]*(?:(?!<\/wbr>)<[^<]*)*<\/wbr>/gi, // WBR tags
    /<xmp\b[^<]*(?:(?!<\/xmp>)<[^<]*)*<\/xmp>/gi, // XMP tags
    /<listing\b[^<]*(?:(?!<\/listing>)<[^<]*)*<\/listing>/gi, // Listing tags
    /<plaintext\b[^<]*(?:(?!<\/plaintext>)<[^<]*)*<\/plaintext>/gi, // Plaintext tags
    /<noembed\b[^<]*(?:(?!<\/noembed>)<[^<]*)*<\/noembed>/gi, // Noembed tags
    /<noframes\b[^<]*(?:(?!<\/noframes>)<[^<]*)*<\/noframes>/gi, // Noframes tags
    /<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, // Noscript tags
    /<nobr\b[^<]*(?:(?!<\/nobr>)<[^<]*)*<\/nobr>/gi, // Nobr tags
    /<blink\b[^<]*(?:(?!<\/blink>)<[^<]*)*<\/blink>/gi, // Blink tags
    /<marquee\b[^<]*(?:(?!<\/marquee>)<[^<]*)*<\/marquee>/gi, // Marquee tags
    /<basefont\b[^<]*(?:(?!<\/basefont>)<[^<]*)*<\/basefont>/gi, // Basefont tags
    /<bgsound\b[^<]*(?:(?!<\/bgsound>)<[^<]*)*<\/bgsound>/gi, // Bgsound tags
    /<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, // Applet tags
    /<keygen\b[^<]*(?:(?!<\/keygen>)<[^<]*)*<\/keygen>/gi, // Keygen tags
    /<command\b[^<]*(?:(?!<\/command>)<[^<]*)*<\/command>/gi, // Command tags
    /<menuitem\b[^<]*(?:(?!<\/menuitem>)<[^<]*)*<\/menuitem>/gi, // Menu item tags
    /<menu\b[^<]*(?:(?!<\/menu>)<[^<]*)*<\/menu>/gi, // Menu tags
    /<dialog\b[^<]*(?:(?!<\/dialog>)<[^<]*)*<\/dialog>/gi, // Dialog tags
    /<summary\b[^<]*(?:(?!<\/summary>)<[^<]*)*<\/summary>/gi, // Summary tags
    /<details\b[^<]*(?:(?!<\/details>)<[^<]*)*<\/details>/gi, // Details tags
    /<meter\b[^<]*(?:(?!<\/meter>)<[^<]*)*<\/meter>/gi, // Meter tags
    /<progress\b[^<]*(?:(?!<\/progress>)<[^<]*)*<\/progress>/gi, // Progress tags
    /<output\b[^<]*(?:(?!<\/output>)<[^<]*)*<\/output>/gi, // Output tags
    /<datalist\b[^<]*(?:(?!<\/datalist>)<[^<]*)*<\/datalist>/gi, // Data list tags
    /<option\b[^<]*(?:(?!<\/option>)<[^<]*)*<\/option>/gi, // Option tags
    /<optgroup\b[^<]*(?:(?!<\/optgroup>)<[^<]*)*<\/optgroup>/gi, // Option group tags
    /<label\b[^<]*(?:(?!<\/label>)<[^<]*)*<\/label>/gi, // Label tags
    /<legend\b[^<]*(?:(?!<\/legend>)<[^<]*)*<\/legend>/gi, // Legend tags
    /<fieldset\b[^<]*(?:(?!<\/fieldset>)<[^<]*)*<\/fieldset>/gi, // Fieldset tags
    /<col\b[^<]*(?:(?!<\/col>)<[^<]*)*>/gi, // Column tags
    /<colgroup\b[^<]*(?:(?!<\/colgroup>)<[^<]*)*<\/colgroup>/gi, // Column group tags
    /<caption\b[^<]*(?:(?!<\/caption>)<[^<]*)*<\/caption>/gi, // Table caption tags
    /<tfoot\b[^<]*(?:(?!<\/tfoot>)<[^<]*)*<\/tfoot>/gi, // Table footer tags
    /<tbody\b[^<]*(?:(?!<\/tbody>)<[^<]*)*<\/tbody>/gi, // Table body tags
    /<thead\b[^<]*(?:(?!<\/thead>)<[^<]*)*<\/thead>/gi, // Table head tags
    /<th\b[^<]*(?:(?!<\/th>)<[^<]*)*<\/th>/gi, // Table header tags
    /<td\b[^<]*(?:(?!<\/td>)<[^<]*)*<\/td>/gi, // Table data tags
    /<tr\b[^<]*(?:(?!<\/tr>)<[^<]*)*<\/tr>/gi, // Table row tags
    /<table\b[^<]*(?:(?!<\/table>)<[^<]*)*<\/table>/gi, // Table tags
    /<li\b[^<]*(?:(?!<\/li>)<[^<]*)*<\/li>/gi, // List item tags
    /<ol\b[^<]*(?:(?!<\/ol>)<[^<]*)*<\/ol>/gi, // Ordered list tags
    /<ul\b[^<]*(?:(?!<\/ul>)<[^<]*)*<\/ul>/gi, // Unordered list tags
    /<h[1-6]\b[^<]*(?:(?!<\/h[1-6]>)<[^<]*)*<\/h[1-6]>/gi, // Heading tags
    /<hr\b[^<]*(?:(?!<\/hr>)<[^<]*)*>/gi, // Horizontal rule tags
    /<br\b[^<]*(?:(?!<\/br>)<[^<]*)*>/gi, // Break tags
    /<p\b[^<]*(?:(?!<\/p>)<[^<]*)*<\/p>/gi, // Paragraph tags
    /<span\b[^<]*(?:(?!<\/span>)<[^<]*)*<\/span>/gi, // Span tags
    /<div\b[^<]*(?:(?!<\/div>)<[^<]*)*<\/div>/gi, // Div tags
    /<img\b[^<]*(?:(?!<\/img>)<[^<]*)*>/gi, // Image tags
    /<a\b[^<]*(?:(?!<\/a>)<[^<]*)*>/gi, // Anchor tags
    /<button\b[^<]*(?:(?!<\/button>)<[^<]*)*>/gi, // Button tags
    /<select\b[^<]*(?:(?!<\/select>)<[^<]*)*>/gi, // Select tags
    /<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*>/gi, // Textarea tags
    /<input\b[^<]*(?:(?!<\/input>)<[^<]*)*>/gi, // Input tags
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, // Form tags
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, // Style tags
    /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, // Meta tags
    /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, // Link tags
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, // Embed tags
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, // Object tags
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, // Iframe tags
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
  ];

  // Dangerous protocols and patterns
  private static readonly DANGEROUS_PATTERNS = [
    /javascript:/gi,
    /vbscript:/gi,
    /data:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
    /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi,
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
    /<input\b[^<]*(?:(?!<\/input>)<[^<]*)*>/gi,
    /<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*>/gi,
    /<select\b[^<]*(?:(?!<\/select>)<[^<]*)*>/gi,
    /<button\b[^<]*(?:(?!<\/button>)<[^<]*)*>/gi,
    /<a\b[^<]*(?:(?!<\/a>)<[^<]*)*>/gi,
    /<img\b[^<]*(?:(?!<\/img>)<[^<]*)*>/gi,
    /<div\b[^<]*(?:(?!<\/div>)<[^<]*)*>/gi,
    /<span\b[^<]*(?:(?!<\/span>)<[^<]*)*>/gi,
    /<p\b[^<]*(?:(?!<\/p>)<[^<]*)*>/gi,
    /<br\b[^<]*(?:(?!<\/br>)<[^<]*)*>/gi,
    /<hr\b[^<]*(?:(?!<\/hr>)<[^<]*)*>/gi,
    /<h[1-6]\b[^<]*(?:(?!<\/h[1-6]>)<[^<]*)*<\/h[1-6]>/gi,
    /<ul\b[^<]*(?:(?!<\/ul>)<[^<]*)*<\/ul>/gi,
    /<ol\b[^<]*(?:(?!<\/ol>)<[^<]*)*<\/ol>/gi,
    /<li\b[^<]*(?:(?!<\/li>)<[^<]*)*<\/li>/gi,
    /<table\b[^<]*(?:(?!<\/table>)<[^<]*)*<\/table>/gi,
    /<tr\b[^<]*(?:(?!<\/tr>)<[^<]*)*<\/tr>/gi,
    /<td\b[^<]*(?:(?!<\/td>)<[^<]*)*<\/td>/gi,
    /<th\b[^<]*(?:(?!<\/th>)<[^<]*)*<\/th>/gi,
    /<thead\b[^<]*(?:(?!<\/thead>)<[^<]*)*<\/thead>/gi,
    /<tbody\b[^<]*(?:(?!<\/tbody>)<[^<]*)*<\/tbody>/gi,
    /<tfoot\b[^<]*(?:(?!<\/tfoot>)<[^<]*)*<\/tfoot>/gi,
    /<caption\b[^<]*(?:(?!<\/caption>)<[^<]*)*<\/caption>/gi,
    /<colgroup\b[^<]*(?:(?!<\/colgroup>)<[^<]*)*<\/colgroup>/gi,
    /<col\b[^<]*(?:(?!<\/col>)<[^<]*)*>/gi,
    /<fieldset\b[^<]*(?:(?!<\/fieldset>)<[^<]*)*<\/fieldset>/gi,
    /<legend\b[^<]*(?:(?!<\/legend>)<[^<]*)*<\/legend>/gi,
    /<optgroup\b[^<]*(?:(?!<\/optgroup>)<[^<]*)*<\/optgroup>/gi,
    /<option\b[^<]*(?:(?!<\/option>)<[^<]*)*<\/option>/gi,
    /<datalist\b[^<]*(?:(?!<\/datalist>)<[^<]*)*<\/datalist>/gi,
    /<output\b[^<]*(?:(?!<\/output>)<[^<]*)*<\/output>/gi,
    /<progress\b[^<]*(?:(?!<\/progress>)<[^<]*)*<\/progress>/gi,
    /<meter\b[^<]*(?:(?!<\/meter>)<[^<]*)*<\/meter>/gi,
    /<details\b[^<]*(?:(?!<\/details>)<[^<]*)*<\/details>/gi,
    /<summary\b[^<]*(?:(?!<\/summary>)<[^<]*)*<\/summary>/gi,
    /<dialog\b[^<]*(?:(?!<\/dialog>)<[^<]*)*<\/dialog>/gi,
    /<menu\b[^<]*(?:(?!<\/menu>)<[^<]*)*<\/menu>/gi,
    /<menuitem\b[^<]*(?:(?!<\/menuitem>)<[^<]*)*<\/menuitem>/gi,
    /<command\b[^<]*(?:(?!<\/command>)<[^<]*)*<\/command>/gi,
    /<keygen\b[^<]*(?:(?!<\/keygen>)<[^<]*)*<\/keygen>/gi,
    /<source\b[^<]*(?:(?!<\/source>)<[^<]*)*<\/source>/gi,
    /<track\b[^<]*(?:(?!<\/track>)<[^<]*)*<\/track>/gi,
    /<video\b[^<]*(?:(?!<\/video>)<[^<]*)*<\/video>/gi,
    /<audio\b[^<]*(?:(?!<\/audio>)<[^<]*)*<\/audio>/gi,
    /<canvas\b[^<]*(?:(?!<\/canvas>)<[^<]*)*<\/canvas>/gi,
    /<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi,
    /<math\b[^<]*(?:(?!<\/math>)<[^<]*)*<\/math>/gi,
    /<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi,
    /<basefont\b[^<]*(?:(?!<\/basefont>)<[^<]*)*<\/basefont>/gi,
    /<bgsound\b[^<]*(?:(?!<\/bgsound>)<[^<]*)*<\/bgsound>/gi,
    /<blink\b[^<]*(?:(?!<\/blink>)<[^<]*)*<\/blink>/gi,
    /<marquee\b[^<]*(?:(?!<\/marquee>)<[^<]*)*<\/marquee>/gi,
    /<nobr\b[^<]*(?:(?!<\/nobr>)<[^<]*)*<\/nobr>/gi,
    /<noembed\b[^<]*(?:(?!<\/noembed>)<[^<]*)*<\/noembed>/gi,
    /<noframes\b[^<]*(?:(?!<\/noframes>)<[^<]*)*<\/noframes>/gi,
    /<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi,
    /<plaintext\b[^<]*(?:(?!<\/plaintext>)<[^<]*)*<\/plaintext>/gi,
    /<listing\b[^<]*(?:(?!<\/listing>)<[^<]*)*<\/listing>/gi,
    /<xmp\b[^<]*(?:(?!<\/xmp>)<[^<]*)*<\/xmp>/gi,
    /<nextid\b[^<]*(?:(?!<\/nextid>)<[^<]*)*<\/nextid>/gi,
    /<spacer\b[^<]*(?:(?!<\/spacer>)<[^<]*)*<\/spacer>/gi,
    /<wbr\b[^<]*(?:(?!<\/wbr>)<[^<]*)*<\/wbr>/gi,
  ];

  /**
   * Comprehensive string sanitization for XSS protection
   */
  static sanitizeString(input: string, maxLength: number = 1000): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    let sanitized = input.trim();

    // Remove all dangerous patterns
    this.DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Remove any remaining HTML-like content
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    // Remove dangerous protocols
    sanitized = sanitized.replace(/[a-z]+:\/\//gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove CSS expressions
    sanitized = sanitized.replace(/expression\s*\(/gi, '');

    // Remove any remaining script-like content
    sanitized = sanitized.replace(/script/gi, '');

    // Limit length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  }

  /**
   * Sanitize HTML content safely
   */
  static sanitizeHTML(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Use DOMPurify-like approach - create a temporary div and set textContent
    if (typeof document !== 'undefined') {
      const div = document.createElement('div');
      div.textContent = input;
      return div.innerHTML;
    }

    // Fallback for server-side rendering
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitize email addresses
   */
  static sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      return '';
    }

    return email
      .toLowerCase()
      .trim()
      .replace(/[^\w@.-]/g, '') // Only allow valid email characters
      .substring(0, 254);
  }

  /**
   * Validate input for XSS patterns
   */
  static validateInput(input: string, maxLength: number = 1000): {
    isValid: boolean;
    errors: string[];
    sanitizedValue: string;
  } {
    const errors: string[] = [];

    if (!input || typeof input !== 'string') {
      errors.push('Input is required and must be a string');
      return { isValid: false, errors, sanitizedValue: '' };
    }

    if (input.length > maxLength) {
      errors.push(`Input exceeds maximum length of ${maxLength} characters`);
    }

    // Check for dangerous patterns
    const hasDangerousPatterns = this.DANGEROUS_PATTERNS.some(pattern =>
      pattern.test(input)
    );

    if (hasDangerousPatterns) {
      errors.push('Input contains potentially dangerous content');
    }

    // Check for HTML tags
    if (/<[^>]*>/.test(input)) {
      errors.push('Input contains HTML tags');
    }

    // Check for dangerous protocols
    if (/[a-z]+:\/\//gi.test(input)) {
      errors.push('Input contains potentially dangerous protocols');
    }

    const sanitizedValue = this.sanitizeString(input, maxLength);
    const isValid = errors.length === 0;

    return { isValid, errors, sanitizedValue };
  }

  /**
   * Sanitize user profile data
   */
  static sanitizeProfileData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value, 2000); // Allow longer text for profile fields
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeProfileData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Sanitize chat messages
   */
  static sanitizeChatMessage(message: string): string {
    return this.sanitizeString(message, 5000); // Allow longer messages for chat
  }

  /**
   * Sanitize search queries
   */
  static sanitizeSearchQuery(query: string): string {
    return this.sanitizeString(query, 500); // Limit search queries
  }

  /**
   * Sanitize form data
   */
  static sanitizeFormData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value, 1000);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeFormData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Check if input contains XSS patterns
   */
  static containsXSSPatterns(input: string): boolean {
    if (!input || typeof input !== 'string') {
      return false;
    }

    return this.DANGEROUS_PATTERNS.some(pattern => pattern.test(input));
  }

  /**
   * Log security events for monitoring
   */
  static logSecurityEvent(event: string, input: string, sanitized: string): void {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(`Security Event: ${event}`, {
        originalInput: input.substring(0, 100), // Log first 100 chars for debugging
        sanitizedInput: sanitized.substring(0, 100),
        timestamp: new Date().toISOString(),
        eventType: 'XSS_PREVENTION'
      });
    }
  }

  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
  } {
    const errors: string[] = [];
    let score = 0;

    if (password.length < 12) errors.push("Too short");
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (password.length > 16) score += 1;

    return {
      isValid: score >= 4 && errors.length === 0,
      errors,
      score: Math.min(score, 6)
    };
  }

  static checkCommonPatterns(password: string): boolean {
    const commonPatterns = [
      'password', '123456', 'qwerty', 'admin', 'letmein',
      'welcome', 'monkey', 'dragon', 'master', 'hello',
      'password123', 'admin123', '123456789', 'qwerty123'
    ];
    return !commonPatterns.some(pattern =>
      password.toLowerCase().includes(pattern)
    );
  }

  static checkSequentialCharacters(password: string): boolean {
    const sequential = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789|012)/i;
    return !sequential.test(password);
  }
}
