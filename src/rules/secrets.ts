import fs from 'fs';
import { RuleContext, RuleResult } from '../engine/types';
import { SECRET_PATTERNS } from '../engine/secrets';

export async function checkSecrets(ctx: RuleContext): Promise<RuleResult[]> {
    const results: RuleResult[] = [];

    // Skip binary files, lock files, node_modules (already ignored by scanner but specific check here)
    const filesToCheck = ctx.files.filter(f => !f.match(/\.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|lock|pdf)$/));

    for (const file of filesToCheck) {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            const lines = content.split('\n');

            lines.forEach((line, index) => {
                // Check Regex Patterns
                for (const pattern of SECRET_PATTERNS) {
                    if (pattern.regex.test(line)) {
                        results.push({
                            status: 'fail',
                            message: `Potential secret found: ${pattern.name}`,
                            ruleId: 'secret-pattern',
                            file,
                            line: index + 1
                        });
                    }
                }

                // Check Heuristics for assignments
                // matches "key = '...'"
                const genericMsg = line.match(/(api_?key|secret|token|password|auth)[\s]*[:=][\s]*['"]([a-zA-Z0-9_\-]{8,})['"]/i);
                if (genericMsg) {
                    const match = genericMsg[2];
                    // Heuristic: Must be > 8 chars and not contain 'process.env' or template placeholders
                    if (match && match.length > 8 && !line.includes('process.env') && !match.includes('${')) {
                        results.push({
                            status: 'warn',
                            message: `Possible hardcoded secret (heuristic): ${genericMsg[1]}`,
                            ruleId: 'secret-heuristic',
                            file,
                            line: index + 1
                        });
                    }
                }
            });
        } catch (e) {
            // Ignore read errors
        }
    }

    return results;
}
