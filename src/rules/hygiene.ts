import fs from 'fs';
import { RuleContext, RuleResult } from '../engine/types';

export async function checkHygiene(ctx: RuleContext): Promise<RuleResult[]> {
    const results: RuleResult[] = [];

    const codeFiles = ctx.files.filter(f =>
        f.match(/\.(js|ts|jsx|tsx)$/) &&
        !f.includes('.test.') &&
        !f.includes('.spec.')
    );

    for (const file of codeFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            const lineNum = index + 1;

            // 1. Console Log Check
            // Allow console.error and console.warn, but warn on console.log
            if (line.includes('console.log(')) {
                // Ignore if commented out
                if (!line.trim().startsWith('//') && !line.trim().startsWith('*')) {
                    results.push({
                        status: 'warn',
                        message: 'Leftover console.log() call detected.',
                        ruleId: 'hygiene-console-log',
                        file,
                        line: lineNum
                    });
                }
            }

            // 2. TODO / FIXME Check
            if (line.match(/\/\/\s*(TODO|FIXME):/i)) {

                if (line.match(/FIXME/i)) {
                    results.push({
                        status: 'warn',
                        message: 'FIXME comment found. Resolve before shipping.',
                        ruleId: 'hygiene-fixme',
                        file,
                        line: lineNum
                    });
                }
            }
        });
    }

    return results;
}
