#!/usr/bin/env node

/**
 * =========================================================
 * MED-GENIE ENVIRONMENT SETUP SCRIPT
 * =========================================================
 *
 * Features:
 * - Secure JWT secret generation
 * - Environment validation
 * - Safe .env creation
 * - Production-ready structure
 * - Better logging
 * - Duplicate protection
 * - Security recommendations
 *
 * =========================================================
 */

"use strict";

/* =========================================================
   IMPORTS
========================================================= */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

/* =========================================================
   CONFIGURATION
========================================================= */

const CONFIG = {
  appName: "Med-Genie",

  envFileName: ".env",

  jwt: {
    secretLength: 64,

    accessTokenExpiry: "15m",

    refreshTokenExpiry: "7d",
  },

  rateLimit: {
    enabled: true,

    maxRequests: 100,

    windowMs: 900000,
  },

  app: {
    url: "http://localhost:3000",

    environment: "development",
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
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🚀 ${title}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  },
};

/* =========================================================
   PATHS
========================================================= */

const ROOT_DIR = path.join(__dirname, "..");

const ENV_PATH = path.join(
  ROOT_DIR,
  CONFIG.envFileName
);

/* =========================================================
   HELPERS
========================================================= */

/**
 * Generate secure random secret
 */
function generateSecureSecret(length = 64) {
  return crypto
    .randomBytes(length)
    .toString("base64");
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Backup existing .env file
 */
function backupExistingEnv() {
  const backupPath = `${ENV_PATH}.backup`;

  fs.copyFileSync(
    ENV_PATH,
    backupPath
  );

  logger.warning(
    `Existing .env backed up → ${backupPath}`
  );
}

/**
 * Create environment file content
 */
function createEnvContent(secret) {
  return `# =========================================================
# ${CONFIG.appName.toUpperCase()} ENVIRONMENT CONFIGURATION
# =========================================================
#
# ⚠️ SECURITY WARNING:
# Never commit this file to version control.
# Add ".env" to your .gitignore file.
#
# Generated automatically by setup-env.js
#
# =========================================================

# =========================================================
# APPLICATION
# =========================================================

NODE_ENV=${CONFIG.app.environment}

NEXT_PUBLIC_APP_URL=${CONFIG.app.url}

# =========================================================
# DATABASE
# =========================================================

DATABASE_URL="file:./dev.db"

# =========================================================
# JWT AUTHENTICATION
# =========================================================

# Strong cryptographic secret
JWT_SECRET=${secret}

# Access Token Expiration
JWT_EXPIRES_IN=${CONFIG.jwt.accessTokenExpiry}

# Refresh Token Expiration
REFRESH_TOKEN_EXPIRES_IN=${CONFIG.jwt.refreshTokenExpiry}

# =========================================================
# RATE LIMITING
# =========================================================

RATE_LIMIT_ENABLED=${CONFIG.rateLimit.enabled}

RATE_LIMIT_MAX_REQUESTS=${CONFIG.rateLimit.maxRequests}

RATE_LIMIT_WINDOW_MS=${CONFIG.rateLimit.windowMs}

# =========================================================
# SECURITY
# =========================================================

SECURE_COOKIES=false

ENABLE_CSRF_PROTECTION=true

ENABLE_HELMET=true

# =========================================================
# LOGGING
# =========================================================

LOG_LEVEL=info

# =========================================================
# OPTIONAL SERVICES
# =========================================================

# REDIS_URL=
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASSWORD=

# =========================================================
# END OF FILE
# =========================================================
`;
}

/* =========================================================
   VALIDATION
========================================================= */

/**
 * Validate generated secret
 */
function validateSecret(secret) {
  return (
    typeof secret === "string" &&
    secret.length >= 64
  );
}

/* =========================================================
   MAIN EXECUTION
========================================================= */

async function setupEnvironment() {
  try {
    logger.section(
      "Setting up Med-Genie Environment"
    );

    /* ======================================
       CHECK EXISTING FILE
    ====================================== */

    if (fileExists(ENV_PATH)) {
      logger.warning(
        ".env file already exists."
      );

      backupExistingEnv();
    }

    /* ======================================
       GENERATE SECRET
    ====================================== */

    logger.info(
      "Generating secure JWT secret..."
    );

    const jwtSecret =
      generateSecureSecret(
        CONFIG.jwt.secretLength
      );

    if (!validateSecret(jwtSecret)) {
      throw new Error(
        "JWT secret validation failed."
      );
    }

    logger.success(
      "Secure JWT secret generated."
    );

    /* ======================================
       CREATE ENV CONTENT
    ====================================== */

    logger.info(
      "Creating environment configuration..."
    );

    const envContent =
      createEnvContent(jwtSecret);

    /* ======================================
       WRITE FILE
    ====================================== */

    fs.writeFileSync(
      ENV_PATH,
      envContent,
      "utf-8"
    );

    logger.success(
      `.env file created successfully`
    );

    /* ======================================
       SUMMARY
    ====================================== */

    logger.section(
      "Environment Setup Complete"
    );

    logger.info(
      `Location: ${ENV_PATH}`
    );

    logger.info(
      `JWT Secret Preview: ${jwtSecret.slice(
        0,
        18
      )}...`
    );

    /* ======================================
       SECURITY NOTES
    ====================================== */

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 SECURITY RECOMMENDATIONS

1. Never commit .env to GitHub

2. Add this to .gitignore:

   .env
   .env.local
   .env.production

3. Use different secrets for:
   • development
   • staging
   • production

4. Rotate secrets regularly

5. Use secret managers in production:
   • AWS Secrets Manager
   • HashiCorp Vault
   • Doppler
   • 1Password Secrets Automation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 NEXT STEPS

1. npm install
2. npm run dev

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  } catch (error) {
    logger.error(
      "Environment setup failed."
    );

    console.error(error);

    process.exit(1);
  }
}

/* =========================================================
   EXECUTE
========================================================= */

setupEnvironment();