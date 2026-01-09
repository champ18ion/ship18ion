"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSecurity = checkSecurity;
const fs_1 = __importDefault(require("fs"));
async function checkSecurity(ctx) {
    const results = [];
    const codeFiles = ctx.files.filter(f => f.match(/\.(js|ts|jsx|tsx|json)$/));
    for (const file of codeFiles) {
        const content = fs_1.default.readFileSync(file, 'utf-8');
        // 1. Check for Hardcoded NODE_ENV not being production?
        // Actually we want to verify we are NOT hardcoding 'development' in prod context?
        // Or "Debug / dev configs enabled" -> debug: true
        if (content.match(/debug:\s*true/)) {
            results.push({
                status: 'warn',
                message: 'Debug mode enabled (debug: true) found',
                ruleId: 'security-debug-enabled',
                file
            });
        }
        // 2. CORS Wildcard
        // "origin: '*'" or "origin: *"
        if (content.match(/origin:\s*['"]?\*['"]?/)) {
            // Default: Enabled (fail on wildcard) unless explicitly set to false
            if (ctx.config.security?.noCorsWildcard !== false) {
                results.push({
                    status: 'fail',
                    message: 'CORS wildcard origin (*) detected',
                    ruleId: 'security-cors-wildcard',
                    file
                });
            }
        }
        // 3. Hardcoded credentials (simple db keywords)
        // postgres://user:pass@...
        if (content.match(/:\/\/[a-zA-Z0-9]+:[a-zA-Z0-9]+@/)) {
            // Exclude localhost
            if (!content.includes('localhost') && !content.includes('127.0.0.1')) {
                results.push({
                    status: 'fail',
                    message: 'Hardcoded database credentials in connection string',
                    ruleId: 'security-db-creds',
                    file
                });
            }
        }
    }
    return results;
}
