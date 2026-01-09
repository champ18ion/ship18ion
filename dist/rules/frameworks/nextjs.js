"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNextJs = checkNextJs;
const ast_1 = require("../../engine/ast");
async function checkNextJs(ctx) {
    const results = [];
    // 1. Check for NEXT_PUBLIC_ secrets
    const codeFiles = ctx.files.filter(f => f.match(/\.(js|ts|jsx|tsx)$/));
    for (const file of codeFiles) {
        const usages = (0, ast_1.findEnvUsages)(file);
        for (const usage of usages) {
            if (usage.name.startsWith('NEXT_PUBLIC_')) {
                // Heuristic: Does it look like a secret?
                // e.g. NEXT_PUBLIC_SECRET_KEY, NEXT_PUBLIC_API_SECRET
                if (usage.name.match(/SECRET|PASSWORD|TOKEN|KEY|AUTH/i)) {
                    // Exception: PUBLIC_KEY is often safe
                    if (!usage.name.match(/PUBLIC_KEY/i)) {
                        results.push({
                            status: 'warn',
                            message: `Potential secret exposed via NEXT_PUBLIC_ variable: ${usage.name}`,
                            ruleId: 'nextjs-public-secret',
                            file: file,
                            line: usage.line
                        });
                    }
                }
            }
        }
    }
    return results;
}
