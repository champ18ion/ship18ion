import fs from 'fs';
import { RuleContext, RuleResult } from '../engine/types';

export async function checkPackages(ctx: RuleContext): Promise<RuleResult[]> {
    const results: RuleResult[] = [];

    const packageJsons = ctx.files.filter(f => f.endsWith('package.json') && !f.includes('node_modules'));

    for (const pkgFile of packageJsons) {
        try {
            const content = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
            const deps = Object.keys(content.dependencies || {});
            const devDeps = Object.keys(content.devDependencies || {});

            // Find intersection
            const duplicates = deps.filter(d => devDeps.includes(d));

            for (const dup of duplicates) {
                results.push({
                    status: 'warn',
                    message: `Package '${dup}' is listed in both 'dependencies' and 'devDependencies'.`,
                    ruleId: 'package-duplicate',
                    file: pkgFile
                });
            }

        } catch (e) {
            // ignore malformed json
        }
    }

    return results;
}
