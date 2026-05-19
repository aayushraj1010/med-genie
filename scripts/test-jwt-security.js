#!/usr/bin/env node

/**
 * =========================================================
 * MED-GENIE JWT SECURITY TEST SUITE
 * =========================================================
 *
 * Features:
 * - Environment validation
 * - Strong secret testing
 * - Token generation testing
 * - Expiration testing
 * - Invalid token protection
 * - Colored console output
 * - Structured test runner
 * - Async test handling
 * - Production-ready logging
 *
 * =========================================================
 */

"use strict";

/* =========================================================
   IMPORTS
========================================================= */

const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/* =========================================================
   COLORS
========================================================= */

const COLORS = {
  reset: "\x1b[0m",

  green: "\x1b[32m",

  red: "\x1b[31m",

  yellow: "\x1b[33m",

  blue: "\x1b[34m",

  cyan: "\x1b[36m",

  gray: "\x1b[90m",
};

/* =========================================================
   LOGGER
========================================================= */

const logger = {
  section(title) {
    console.log(
      `\n${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`
    );

    console.log(
      `${COLORS.blue}🚀 ${title}${COLORS.reset}`
    );

    console.log(
      `${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n`
    );
  },

  success(message) {
    console.log(
      `${COLORS.green}✅ ${message}${COLORS.reset}`
    );
  },

  error(message) {
    console.log(
      `${COLORS.red}❌ ${message}${COLORS.reset}`
    );
  },

  warning(message) {
    console.log(
      `${COLORS.yellow}⚠️  ${message}${COLORS.reset}`
    );
  },

  info(message) {
    console.log(
      `${COLORS.gray}ℹ️  ${message}${COLORS.reset}`
    );
  },
};

/* =========================================================
   TEST RESULTS
========================================================= */

const testResults = {
  passed: 0,

  failed: 0,

  total: 0,
};

/* =========================================================
   TEST RUNNER
========================================================= */

async function runTest(name, callback) {
  testResults.total++;

  process.stdout.write(
    `${COLORS.blue}Testing:${COLORS.reset} ${name} ... `
  );

  try {
    await callback();

    testResults.passed++;

    console.log(
      `${COLORS.green}PASSED${COLORS.reset}`
    );
  } catch (error) {
    testResults.failed++;

    console.log(
      `${COLORS.red}FAILED${COLORS.reset}`
    );

    logger.error(error.message);
  }
}

/* =========================================================
   HELPERS
========================================================= */

function generateStrongSecret() {
  return crypto
    .randomBytes(64)
    .toString("base64");
}

function sleep(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

/* =========================================================
   MAIN TEST SUITE
========================================================= */

async function runSecurityTests() {
  logger.section(
    "JWT SECURITY TEST SUITE"
  );

  /* ======================================
     TEST 1
  ====================================== */

  await runTest(
    "Environment Variable Requirement",

    async () => {
      const originalSecret =
        process.env.JWT_SECRET;

      delete process.env.JWT_SECRET;

      try {
        delete require.cache[
          require.resolve("../src/lib/jwt")
        ];

        require("../src/lib/jwt");

        throw new Error(
          "JWT_SECRET should be required"
        );
      } catch (error) {
        if (
          !error.message.includes(
            "JWT_SECRET environment variable is required"
          )
        ) {
          throw error;
        }
      }

      process.env.JWT_SECRET =
        originalSecret;
    }
  );

  /* ======================================
     TEST 2
  ====================================== */

  await runTest(
    "Strong Secret Generation",

    async () => {
      const secret =
        generateStrongSecret();

      if (secret.length < 64) {
        throw new Error(
          "Generated secret is too short"
        );
      }

      logger.info(
        `Generated secret length: ${secret.length}`
      );
    }
  );

  /* ======================================
     TEST 3
  ====================================== */

  await runTest(
    "Token ID Generation",

    async () => {
      process.env.JWT_SECRET =
        generateStrongSecret();

      delete require.cache[
        require.resolve("../src/lib/jwt")
      ];

      const jwtModule =
        require("../src/lib/jwt");

      const tokenId1 =
        jwtModule.generateTokenId();

      const tokenId2 =
        jwtModule.generateTokenId();

      if (tokenId1 === tokenId2) {
        throw new Error(
          "Token IDs are not unique"
        );
      }

      if (tokenId1.length !== 64) {
        throw new Error(
          "Invalid token ID length"
        );
      }
    }
  );

  /* ======================================
     TEST 4
  ====================================== */

  await runTest(
    "Token Pair Generation",

    async () => {
      const jwtModule =
        require("../src/lib/jwt");

      const tokenPair =
        jwtModule.signTokenPair(
          1,
          "test@example.com",
          "Test User"
        );

      if (
        !tokenPair.accessToken ||
        !tokenPair.refreshToken
      ) {
        throw new Error(
          "Missing generated tokens"
        );
      }

      logger.info(
        `Access Token Parts: ${
          tokenPair.accessToken.split(".")
            .length
        }`
      );

      logger.info(
        `Refresh Token Parts: ${
          tokenPair.refreshToken.split(".")
            .length
        }`
      );
    }
  );

  /* ======================================
     TEST 5
  ====================================== */

  await runTest(
    "Token Verification",

    async () => {
      const jwtModule =
        require("../src/lib/jwt");

      const tokenPair =
        jwtModule.signTokenPair(
          1,
          "test@example.com",
          "Test User"
        );

      const verified =
        jwtModule.verifyToken(
          tokenPair.accessToken
        );

      if (!verified) {
        throw new Error(
          "Verification failed"
        );
      }

      if (verified.userId !== 1) {
        throw new Error(
          "Incorrect payload"
        );
      }
    }
  );

  /* ======================================
     TEST 6
  ====================================== */

  await runTest(
    "Invalid Token Handling",

    async () => {
      const jwtModule =
        require("../src/lib/jwt");

      const invalidToken =
        "invalid.token.here";

      const verified =
        jwtModule.verifyToken(
          invalidToken
        );

      if (verified !== null) {
        throw new Error(
          "Invalid token should return null"
        );
      }
    }
  );

  /* ======================================
     TEST 7
  ====================================== */

  await runTest(
    "Expired Token Rejection",

    async () => {
      const jwtModule =
        require("../src/lib/jwt");

      const shortLivedToken =
        jwt.sign(
          {
            userId: 1,
            email: "test@example.com",
            tokenId: "abc123",
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "1s",
          }
        );

      logger.info(
        "Waiting for token expiration..."
      );

      await sleep(2000);

      const verified =
        jwtModule.verifyToken(
          shortLivedToken
        );

      if (verified !== null) {
        throw new Error(
          "Expired token should be rejected"
        );
      }
    }
  );

  /* =====================================================
     SUMMARY
  ===================================================== */

  logger.section("TEST SUMMARY");

  console.log(
    `${COLORS.green}Passed:${COLORS.reset} ${testResults.passed}`
  );

  console.log(
    `${COLORS.red}Failed:${COLORS.reset} ${testResults.failed}`
  );

  console.log(
    `${COLORS.blue}Total:${COLORS.reset} ${testResults.total}`
  );

  /* ======================================
     FINAL STATUS
  ====================================== */

  if (testResults.failed === 0) {
    logger.success(
      "All JWT security tests passed successfully!"
    );
  } else {
    logger.warning(
      "Some tests failed. Review implementation."
    );
  }

  /* ======================================
     SECURITY RECOMMENDATIONS
  ====================================== */

  console.log(`
${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}

🔒 SECURITY RECOMMENDATIONS

1. Use HTTPS in production

2. Rotate JWT secrets regularly

3. Store refresh tokens securely

4. Use Redis token blacklisting

5. Enable CSRF protection

6. Implement device/session tracking

7. Add rate limiting

8. Monitor authentication logs

9. Use secure cookies

10. Add multi-factor authentication

${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}
`);
}

/* =========================================================
   EXECUTE TEST SUITE
========================================================= */

runSecurityTests().catch((error) => {
  logger.error(
    "Test suite crashed unexpectedly."
  );

  console.error(error);

  process.exit(1);
});