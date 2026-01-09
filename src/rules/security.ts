import fs from 'fs';
import { RuleContext, RuleResult } from '../engine/types';

export async function checkSecurity(ctx: RuleContext): Promise<RuleResult[]> {
    const results: RuleResult[] = [];

    const codeFiles = ctx.files.filter(f => f.match(/\.(js|ts|jsx|tsx|json)$/));

    for (const file of codeFiles) {
        const content = fs.readFileSync(file, 'utf-8');

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
