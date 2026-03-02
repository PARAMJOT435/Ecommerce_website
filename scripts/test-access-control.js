
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3001';

// Colors for console output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m"
};

async function checkRoute(route, expectedStatus, expectedRedirectStart) {
    try {
        const response = await fetch(`${BASE_URL}${route}`, {
            redirect: 'manual' // Don't follow redirects automatically
        });

        const location = response.headers.get('location');
        const status = response.status;

        // Check conditions
        let statusPass = status === expectedStatus;
        let redirectPass = true;

        if (expectedRedirectStart) {
            if (!location) {
                redirectPass = false;
            } else {
                // Handle relative or absolute redirects
                const redirectPath = location.startsWith('http')
                    ? new URL(location).pathname
                    : location.split('?')[0]; // simple split to ignore query params

                // Check if it starts with the expected path (ignoring params for now)
                if (!redirectPath.startsWith(expectedRedirectStart)) {
                    redirectPass = false;
                }
            }
        }

        if (statusPass && redirectPass) {
            console.log(`${colors.green}[PASS] ${route}${colors.reset} -> Status: ${status} ${location ? `(Redirects to ${location})` : ''}`);
            return true;
        } else {
            console.log(`${colors.red}[FAIL] ${route}${colors.reset}`);
            console.log(`  Expected: Status ${expectedStatus} ${expectedRedirectStart ? `and redirect to ${expectedRedirectStart}...` : ''}`);
            console.log(`  Actual:   Status ${status} ${location ? `Location: ${location}` : ''}`);
            return false;
        }

    } catch (error) {
        console.log(`${colors.red}[ERROR] ${route} - Connection Failed${colors.reset}`);
        console.error(error.message);
        return false;
    }
}

async function runTests() {
    console.log(`${colors.blue}=== STARTING SECURITY ACCESS CONTROL TESTS ===${colors.reset}`);
    console.log(`Target: ${BASE_URL}\n`);

    let passed = 0;
    let total = 0;

    // 1. Public Routes (Should be 200)
    console.log(`${colors.yellow}--- Public Routes (Should Allow) ---${colors.reset}`);
    total++; if (await checkRoute('/', 200)) passed++;
    total++; if (await checkRoute('/products', 200)) passed++;
    total++; if (await checkRoute('/login', 200)) passed++;
    total++; if (await checkRoute('/blog', 200)) passed++;

    // 2. Protected User Routes (Should 307 to /login)
    console.log(`\n${colors.yellow}--- Protected User Routes (Should Redirect to Login) ---${colors.reset}`);
    total++; if (await checkRoute('/account', 307, '/login')) passed++;
    total++; if (await checkRoute('/account/orders', 307, '/login')) passed++;
    total++; if (await checkRoute('/account/profile', 307, '/login')) passed++;

    // 3. Protected Admin Routes (Should 307 to /login)
    console.log(`\n${colors.yellow}--- Protected Admin Routes (Should Redirect to Login) ---${colors.reset}`);
    total++; if (await checkRoute('/admin', 307, '/login')) passed++;
    total++; if (await checkRoute('/admin/dashboard', 307, '/login')) passed++;
    total++; if (await checkRoute('/admin/products', 307, '/login')) passed++;
    total++; if (await checkRoute('/admin/customers', 307, '/login')) passed++;
    total++; if (await checkRoute('/admin/settings', 307, '/login')) passed++;

    // Summary
    console.log(`\n${colors.blue}=== TEST SUMMARY ===${colors.reset}`);
    console.log(`Total Tests: ${total}`);
    console.log(`Passed:      ${passed}`);
    console.log(`Failed:      ${total - passed}`);

    if (passed === total) {
        console.log(`${colors.green}ALL SECURITY CHECKS PASSED ✅${colors.reset}`);
    } else {
        console.log(`${colors.red}SOME SECURITY CHECKS FAILED ❌${colors.reset}`);
    }
}

runTests();
