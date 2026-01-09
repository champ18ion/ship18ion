import fs from 'fs';
import path from 'path';
import { RuleContext, RuleResult } from '../engine/types';

export async function checkDependencies(ctx: RuleContext): Promise<RuleResult[]> {
    const results: RuleResult[] = [];

    const packageJsons = ctx.files.filter(f => f.endsWith('package.json') && !f.includes('node_modules'));

    const devToolsInProd = ['eslint', 'jest', 'mocha', 'nodemon', 'ts-node', 'typescript', 'webpack', 'babel-loader'];

    for (const pkgFile of packageJsons) {
        try {
            const content = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
            const deps = content.dependencies || {};

            for (const tool of devToolsInProd) {
                if (deps[tool]) {
                    results.push({
                        status: 'warn',
                        message: `Dev dependency found in 'dependencies': ${tool}. Should be in 'devDependencies'?`,
                        ruleId: 'dep-dev-in-prod',
                        file: pkgFile
                    });
                }
            }
        } catch (e) {
            // ignore
        }
    }
    return results;
}

import { glob } from 'glob';

export async function checkBuild(ctx: RuleContext): Promise<RuleResult[]> {
    const results: RuleResult[] = [];

    // Explicitly scan build folders (dist, build, .next, .output) for dangerous files
    // The main scanner ignores these, so we check them separately here.

    const buildDirs = ['dist', 'build', '.next', '.output'];
    const foundBuildDirs = buildDirs.filter(d => fs.existsSync(path.join(ctx.cwd, d)));

    if (foundBuildDirs.length === 0) {
        return results;
    }

    // 1. Check for Source Maps (.map)
    // We search inside the found build directories
    for (const dir of foundBuildDirs) {
        const mapFiles = await glob(`${dir}/**/*.map`, { cwd: ctx.cwd, absolute: true });

        if (mapFiles.length > 0) {
            results.push({
                status: 'warn',
                message: `Found ${mapFiles.length} source map files in '${dir}' (e.g. ${path.basename(mapFiles[0])}). Ensure these are not exposed publicly.`,
                ruleId: 'build-source-map',
                file: dir // Point to the directory itself
            });
        }

        // 2. Check for .env files in build output
        // We look for .env* files inside the build dir
        const envFiles = await glob(`${dir}/**/*.env*`, { cwd: ctx.cwd, absolute: true });
        for (const file of envFiles) {
            results.push({
                status: 'fail',
                message: `Environment file found in build output (${dir})!`,
                ruleId: 'build-env-leak',
                file
            });
        }
    }

    return results;
}
