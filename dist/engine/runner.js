"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runChecks = runChecks;
const scanner_1 = require("./scanner");
const env_1 = require("../rules/env");
const secrets_1 = require("../rules/secrets");
const security_1 = require("../rules/security");
const build_1 = require("../rules/build");
const hygiene_1 = require("../rules/hygiene");
const packages_1 = require("../rules/packages");
const nextjs_1 = require("../rules/frameworks/nextjs");
const git_1 = require("../rules/git");
const detector_1 = require("./detector");
async function runChecks(config, cwd, onProgress) {
    if (onProgress)
        onProgress('Scanning files...');
    const files = await (0, scanner_1.scanFiles)(cwd, config.ignore);
    // Framework detection
    const framework = await (0, detector_1.detectFramework)(cwd);
    const ctx = { config, files, cwd, framework };
    const results = [];
    // Run all checks
    if (onProgress)
        onProgress('Checking environment variables...');
    results.push(...await (0, env_1.checkEnvVars)(ctx));
    if (onProgress)
        onProgress('Scanning for secrets...');
    results.push(...await (0, secrets_1.checkSecrets)(ctx));
    if (onProgress)
        onProgress('Analyzing security configurations...');
    results.push(...await (0, security_1.checkSecurity)(ctx));
    if (onProgress)
        onProgress('Verifying dependencies...');
    results.push(...await (0, build_1.checkDependencies)(ctx));
    if (onProgress)
        onProgress('Inspecting build artifacts...');
    results.push(...await (0, build_1.checkBuild)(ctx));
    // New Rules
    if (onProgress)
        onProgress('Checking code hygiene...');
    results.push(...await (0, hygiene_1.checkHygiene)(ctx));
    if (onProgress)
        onProgress('Validating packages...');
    results.push(...await (0, packages_1.checkPackages)(ctx));
    // Framework specific checks
    if (framework === 'nextjs') {
        if (onProgress)
            onProgress('Running Next.js specific checks...');
        results.push(...await (0, nextjs_1.checkNextJs)(ctx));
    }
    if (onProgress)
        onProgress('Checking git status...');
    results.push(...await (0, git_1.checkGit)(ctx));
    return results;
}
