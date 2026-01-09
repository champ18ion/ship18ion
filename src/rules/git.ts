import { execSync } from 'child_process';
import { RuleContext, RuleResult } from '../engine/types';

import fs from 'fs';
import path from 'path';

export async function checkGit(ctx: RuleContext): Promise<RuleResult[]> {
    const results: RuleResult[] = [];

    try {
        // ... (Existing git checks) ...
        // Check for uncommitted changes
        const status = execSync('git status --porcelain', { cwd: ctx.cwd, encoding: 'utf-8' });
        if (status.trim().length > 0) {
            results.push({
                status: 'warn',
                message: 'Git working directory is dirty (uncommitted changes). Verify before shipping.',
                ruleId: 'git-dirty',
            });
        }

        // Check current branch
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: ctx.cwd, encoding: 'utf-8' }).trim();
        const allowedBranches = ['main', 'master', 'staging', 'production', 'prod'];
        if (!allowedBranches.includes(branch)) {
            // Warn, but maybe less aggressively? Keeping as warn.
            results.push({
                status: 'warn',
                message: `You are on branch '${branch}'. Production builds typically come from main/master.`,
                ruleId: 'git-branch',
            });
        }

        // --- New: .gitignore Check ---
        const gitignorePath = path.join(ctx.cwd, '.gitignore');
        if (fs.existsSync(gitignorePath)) {
            const content = fs.readFileSync(gitignorePath, 'utf-8');
            const lines = content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));

            // Helper to check if item is ignored (naive grep)
            const isIgnored = (item: string) => lines.some(l => l.includes(item));

            const requiredIgnores = ['node_modules', '.env'];
            if (ctx.framework === 'nextjs') {
                requiredIgnores.push('.next');
            } else if (ctx.framework !== 'unknown') {
                // For other frameworks, maybe 'dist' or 'build'
                if (!isIgnored('dist') && !isIgnored('build')) {
                    // We can't strictly require one, but warn if NEITHER is found? 
                    // Let's stick to safe defaults.
                }
            }

            for (const item of requiredIgnores) {
                if (!isIgnored(item)) {
                    results.push({
                        status: 'warn',
                        message: `.gitignore is missing '${item}'. This is critical for security and repo size.`,
                        ruleId: 'git-ignore-missing',
                        file: gitignorePath
                    });
                }
            }

            // Check for specific dangerous files not being ignored
            const dangerousPatterns = ['firebase.json', 'serviceAccountKey.json', '*.pem', '*.key'];
            // This is tricky because firebase.json CAN be committed. serviceAccountKey.json should NOT.

            if (!isIgnored('serviceAccountKey.json')) {
                // Only warn if the FILE actually exists? Or just warn generic?
                // Best to warn if the file exists AND isn't ignored.
                if (fs.existsSync(path.join(ctx.cwd, 'serviceAccountKey.json'))) {
                    results.push({
                        status: 'fail',
                        message: 'serviceAccountKey.json exists but is NOT in .gitignore!',
                        ruleId: 'git-ignore-auth',
                        file: gitignorePath
                    });
                }
            }

        } else {
            results.push({
                status: 'warn',
                message: 'No .gitignore file found! node_modules and secrets might be committed.',
                ruleId: 'git-no-ignore',
            });
        }

    } catch (e) {
        // Not a git repo or git not found
    }

    return results;
}
