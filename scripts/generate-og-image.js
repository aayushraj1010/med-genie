#!/usr/bin/env node

/**
 * =========================================================
 * MED GENIE - OPEN GRAPH IMAGE GENERATOR
 * =========================================================
 *
 * Features:
 * - Auto create public directory
 * - Generate modern OG HTML template
 * - Generate SEO-ready metadata
 * - Production-ready structure
 * - Better logging system
 * - Error handling
 * - Config-based architecture
 *
 * Future Upgrade:
 * - Puppeteer PNG generation
 * - Sharp image optimization
 * - Dynamic branding
 * - Theme support
 *
 * =========================================================
 */

"use strict";

/* =========================================================
   IMPORTS
========================================================= */

const fs = require("fs");
const path = require("path");

/* =========================================================
   CONFIGURATION
========================================================= */

const CONFIG = {
  app: {
    name: "Med Genie",
    tagline: "Your AI Health Assistant",
    description:
      "Get instant AI-powered health advice and medical information.",
  },

  image: {
    width: 1200,
    height: 630,
  },

  paths: {
    public: path.join(__dirname, "../public"),

    html: path.join(
      __dirname,
      "../public/og-image.html"
    ),

    metadata: path.join(
      __dirname,
      "../public/og-metadata.json"
    ),
  },
};

/* =========================================================
   LOGGER
========================================================= */

const logger = {
  info(message) {
    console.log(`ℹ️  ${message}`);
  },

  success(message) {
    console.log(`✅ ${message}`);
  },

  warning(message) {
    console.log(`⚠️  ${message}`);
  },

  error(message) {
    console.error(`❌ ${message}`);
  },

  section(title) {
    console.log(`\n🚀 ${title}`);
  },
};

/* =========================================================
   HELPERS
========================================================= */

function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, {
      recursive: true,
    });

    logger.success(
      `Created directory: ${directoryPath}`
    );
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf-8");

  logger.success(
    `Generated: ${path.basename(filePath)}`
  );
}

/* =========================================================
   OG HTML TEMPLATE
========================================================= */

function generateOGHTML() {
  return `
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    ${CONFIG.app.name} - Open Graph Image
  </title>

  <style>

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;

      width: ${CONFIG.image.width}px;
      height: ${CONFIG.image.height}px;

      display: flex;
      align-items: center;
      justify-content: center;

      overflow: hidden;

      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      color: white;

      background:
        radial-gradient(
          circle at top left,
          rgba(255,255,255,0.08),
          transparent 30%
        ),

        linear-gradient(
          135deg,
          #111827 0%,
          #1f2937 45%,
          #0f172a 100%
        );
    }

    .container {
      position: relative;

      width: 90%;

      padding: 60px;

      border-radius: 32px;

      background:
        rgba(255,255,255,0.06);

      border:
        1px solid rgba(255,255,255,0.12);

      backdrop-filter: blur(12px);

      box-shadow:
        0 20px 80px rgba(0,0,0,0.45);
    }

    .badge {
      display: inline-flex;

      align-items: center;

      gap: 10px;

      padding:
        10px 18px;

      border-radius: 999px;

      background:
        rgba(255,255,255,0.08);

      border:
        1px solid rgba(255,255,255,0.12);

      font-size: 18px;

      letter-spacing: 0.4px;
    }

    .logo {
      margin-top: 32px;

      font-size: 72px;

      font-weight: 800;

      line-height: 1.1;
    }

    .tagline {
      margin-top: 18px;

      font-size: 34px;

      font-weight: 500;

      opacity: 0.92;
    }

    .description {
      margin-top: 26px;

      max-width: 720px;

      font-size: 24px;

      line-height: 1.7;

      opacity: 0.75;
    }

    .footer {
      position: absolute;

      bottom: 32px;
      right: 40px;

      font-size: 18px;

      opacity: 0.5;
    }

  </style>

</head>

<body>

  <div class="container">

    <div class="badge">
      🩺 AI Healthcare Platform
    </div>

    <div class="logo">
      ${CONFIG.app.name}
    </div>

    <div class="tagline">
      ${CONFIG.app.tagline}
    </div>

    <div class="description">
      ${CONFIG.app.description}
    </div>

    <div class="footer">
      medgenie.ai
    </div>

  </div>

</body>
</html>
`;
}

/* =========================================================
   METADATA GENERATOR
========================================================= */

function generateMetadata() {
  return JSON.stringify(
    {
      title: CONFIG.app.name,

      description:
        CONFIG.app.description,

      image: "/og-image.png",

      width: CONFIG.image.width,

      height: CONFIG.image.height,

      generatedAt:
        new Date().toISOString(),
    },

    null,
    2
  );
}

/* =========================================================
   MAIN GENERATOR
========================================================= */

async function generateAssets() {
  try {
    logger.section(
      "Generating Med Genie Open Graph Assets"
    );

    /* ======================================
       CREATE DIRECTORIES
    ====================================== */

    ensureDirectoryExists(
      CONFIG.paths.public
    );

    /* ======================================
       GENERATE HTML TEMPLATE
    ====================================== */

    const htmlTemplate =
      generateOGHTML();

    writeFile(
      CONFIG.paths.html,
      htmlTemplate
    );

    /* ======================================
       GENERATE METADATA
    ====================================== */

    const metadata =
      generateMetadata();

    writeFile(
      CONFIG.paths.metadata,
      metadata
    );

    /* ======================================
       SUCCESS
    ====================================== */

    logger.section(
      "Generation Completed"
    );

    logger.info(
      "Open the generated HTML file in a browser."
    );

    logger.info(
      "Capture screenshot at 1200x630 resolution."
    );

    logger.info(
      "Save as: public/og-image.png"
    );

    logger.info(
      "Future upgrade: integrate Puppeteer for automatic PNG generation."
    );

    /* ======================================
       NEXT STEPS
    ====================================== */

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 Recommended Next Steps

1. Add favicon.ico
2. Generate PWA icons
3. Add apple-touch-icon.png
4. Optimize OG image with sharp
5. Automate screenshots using Puppeteer
6. Add dark/light theme support

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  } catch (error) {
    logger.error(
      "Failed to generate assets"
    );

    console.error(error);

    process.exit(1);
  }
}

/* =========================================================
   EXECUTE
========================================================= */

generateAssets();