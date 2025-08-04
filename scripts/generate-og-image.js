#!/usr/bin/env node

/**
 * Script to generate Open Graph images for Med Genie
 * This script can be used to generate social sharing images
 */

const fs = require('fs');
const path = require('path');

// This is a placeholder script for generating OG images
// In a real implementation, you might use libraries like:
// - puppeteer to screenshot HTML
// - sharp for image manipulation
// - canvas for drawing

console.log('🎨 Generating Open Graph images for Med Genie...');

// Create the public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a simple HTML template for OG image generation
const ogImageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Med Genie OG Image</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            width: 1200px;
            height: 630px;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        .logo {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        .tagline {
            font-size: 1.5rem;
            opacity: 0.9;
            margin-bottom: 1rem;
        }
        .description {
            font-size: 1rem;
            opacity: 0.8;
            max-width: 600px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🩺 Med Genie</div>
        <div class="tagline">Your AI Health Assistant</div>
        <div class="description">Get instant AI-powered health advice and medical information</div>
    </div>
</body>
</html>`;

// Write the HTML file
const ogImagePath = path.join(publicDir, 'og-image.html');
fs.writeFileSync(ogImagePath, ogImageHTML);

console.log('✅ Generated og-image.html template');
console.log('📝 To generate actual PNG images, you can:');
console.log('   1. Open og-image.html in a browser');
console.log('   2. Take a screenshot at 1200x630px');
console.log('   3. Save as og-image.png in the public directory');
console.log('   4. Or use tools like Puppeteer to automate this process');

console.log('\n🎯 Next steps:');
console.log('   - Add actual favicon.ico file to public/');
console.log('   - Generate icon-192.png and icon-512.png for PWA');
console.log('   - Create apple-touch-icon.png for iOS');
console.log('   - Update verification codes in layout.tsx'); 