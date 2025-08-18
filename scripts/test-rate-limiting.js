#!/usr/bin/env node

/**
 * Rate Limiting Test Script
 * 
 * This script tests the rate limiting implementation by making multiple
 * requests to authentication endpoints to verify they are properly protected.
 * 
 * Usage: node scripts/test-rate-limiting.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:9003';
const ENDPOINTS = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/check-email'
];

// Test data
const testData = {
    login: {
        email: 'test@example.com',
        password: 'testpassword'
    },
    register: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
        confirmPassword: 'testpassword'
    },
    checkEmail: {
        email: 'test@example.com'
    }
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(endpoint, data, requestNumber) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);

        const options = {
            hostname: 'localhost',
            port: 9003,
            path: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'Rate-Limit-Test-Script/1.0'
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: parsed,
                        requestNumber
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: responseData,
                        requestNumber
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

async function testRateLimiting(endpoint, testData, maxRequests = 10) {
    log(`\n🔒 Testing Rate Limiting for: ${endpoint}`, 'cyan');
    log(`Making ${maxRequests} requests to test rate limiting...`, 'blue');

    const results = [];

    for (let i = 1; i <= maxRequests; i++) {
        try {
            const result = await makeRequest(endpoint, testData, i);
            results.push(result);

            // Add delay between requests
            if (i < maxRequests) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Display result
            if (result.statusCode === 429) {
                log(`Request ${i}: ${result.statusCode} - Rate Limited ✅`, 'yellow');

                // Check rate limit headers
                const rateLimitHeaders = {
                    limit: result.headers['x-ratelimit-limit'],
                    remaining: result.headers['x-ratelimit-remaining'],
                    reset: result.headers['x-ratelimit-reset'],
                    blocked: result.headers['x-ratelimit-blocked']
                };

                log(`  Rate Limit Headers:`, 'blue');
                Object.entries(rateLimitHeaders).forEach(([key, value]) => {
                    if (value) {
                        log(`    ${key}: ${value}`, 'blue');
                    }
                });

                if (result.body.retryAfter) {
                    log(`  Retry After: ${result.body.retryAfter} seconds`, 'blue');
                }

            } else if (result.statusCode === 200 || result.statusCode === 201) {
                log(`Request ${i}: ${result.statusCode} - Success`, 'green');
            } else {
                log(`Request ${i}: ${result.statusCode} - ${result.body.message || 'Error'}`, 'red');
            }

        } catch (error) {
            log(`Request ${i}: Error - ${error.message}`, 'red');
            results.push({ error: error.message, requestNumber: i });
        }
    }

    // Analyze results
    const rateLimited = results.filter(r => r.statusCode === 429).length;
    const successful = results.filter(r => r.statusCode === 200 || r.statusCode === 201).length;
    const errors = results.filter(r => r.error || (r.statusCode >= 400 && r.statusCode !== 429)).length;

    log(`\n📊 Results Summary:`, 'magenta');
    log(`  Total Requests: ${maxRequests}`, 'blue');
    log(`  Rate Limited: ${rateLimited}`, 'yellow');
    log(`  Successful: ${successful}`, 'green');
    log(`  Errors: ${errors}`, 'red');

    if (rateLimited > 0) {
        log(`\n✅ Rate limiting is working correctly!`, 'green');
    } else {
        log(`\n⚠️  Rate limiting may not be working - no 429 responses received`, 'yellow');
    }

    return results;
}

async function testAllEndpoints() {
    log('🚀 Starting Rate Limiting Tests', 'magenta');
    log('This script will test all authentication endpoints for rate limiting protection', 'blue');

    try {
        // Test each endpoint
        for (const endpoint of ENDPOINTS) {
            const data = testData[endpoint.split('/').pop()] || testData.login;
            await testRateLimiting(endpoint, data, 15); // Test with 15 requests

            // Wait between endpoint tests
            if (endpoint !== ENDPOINTS[ENDPOINTS.length - 1]) {
                log('\n⏳ Waiting 2 seconds before next endpoint test...', 'cyan');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        log('\n🎉 All tests completed!', 'green');
        log('Check the results above to verify rate limiting is working correctly.', 'blue');

    } catch (error) {
        log(`\n❌ Test failed with error: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Check if server is running
async function checkServerHealth() {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 9003,
            path: '/',
            method: 'GET',
            timeout: 5000
        }, (res) => {
            resolve(true);
        });

        req.on('error', () => {
            resolve(false);
        });

        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

// Main execution
async function main() {
    log('🔍 Checking if server is running...', 'blue');

    const serverRunning = await checkServerHealth();
    if (!serverRunning) {
        log('❌ Server is not running on localhost:9003', 'red');
        log('Please start the development server with: npm run dev', 'yellow');
        process.exit(1);
    }

    log('✅ Server is running, starting tests...', 'green');

    await testAllEndpoints();
}

// Run the tests
if (require.main === module) {
    main().catch(error => {
        log(`\n💥 Unexpected error: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = {
    testRateLimiting,
    testAllEndpoints,
    makeRequest
};

