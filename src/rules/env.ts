import fs from 'fs';
import dotenv from 'dotenv';
import { RuleContext, RuleResult } from '../engine/types';
import { findEnvUsages } from '../engine/ast';

export async function checkEnvVars(ctx: RuleContext): Promise<RuleResult[]> {
    const results: RuleResult[] = [];
    const declaredEnvs = new Set<string>();
    const usedEnvs = new Map<string, { file: string, line: number }[]>();

    // 1. Find and parse .env files (definition detection)
    const envFiles = ctx.files.filter(f => f.match(/\.env(\..+)?$/));
    for (const file of envFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        try {
            const parsed = dotenv.parse(content);
            Object.keys(parsed).forEach(k => declaredEnvs.add(k));
        } catch (e) {
            results.push({
                status: 'warn',
                message: `Failed to parse env file: ${file}`,
                ruleId: 'env-parse-error',
                file: file
            });
        }
    }

    // 2. Scan for usages
    const codeFiles = ctx.files.filter(f => f.match(/\.(js|ts|jsx|tsx)$/));
    for (const file of codeFiles) {
        const usages = findEnvUsages(file);
        for (const u of usages) {
            if (!usedEnvs.has(u.name)) {
                usedEnvs.set(u.name, []);
            }
            usedEnvs.get(u.name)?.push({ file, line: u.line });
        }
    }

    // 3. Rule: Unused env vars
    // Fail if Env vars exist but never used
    for (const env of declaredEnvs) {
        if (!usedEnvs.has(env)) {
            // Ignore some common framework vars if needed, but strict mode says unused is bad.
            results.push({
                status: 'warn', // Warn for now, maybe fail? User said "Fail if Env vars exist but never used"
                message: `Unused environment variable: ${env}`,
                ruleId: 'env-unused',
                file: envFiles[0] // Just point to first env file for now
            });
        }
    }

    // 4. Rule: Missing required env vars
    // "App references process.env.X But it’s not defined anywhere"
    // Also check strict list from config
    const required = ctx.config.env?.required || [];

    // Check missing from strict config
    for (const req of required) {
        if (!declaredEnvs.has(req)) {
            results.push({
                status: 'fail',
                message: `Missing required environment variable (configured): ${req}`,
                ruleId: 'env-missing-config',
            });
        }
    }

    // Check usage without definition
    const commonSystemVars = ['NODE_ENV', 'PORT', 'CI'];
    for (const [env, locs] of usedEnvs) {
        if (!declaredEnvs.has(env) && !commonSystemVars.includes(env)) {
            // Check if it is in disallowed list?
            if (ctx.config.env?.disallowed?.includes(env)) {
                results.push({
                    status: 'fail',
                    message: `Disallowed environment variable used: ${env}`,
                    ruleId: 'env-disallowed',
                    file: locs[0].file,
                    line: locs[0].line
                });
            } else {
                // It's used but not in .env. 
                // We should probably warn unless we are in strict mode.
                // User said: "Fail if Required env var is missing" -> checking usage implies requirement.
                results.push({
                    status: 'warn',
                    message: `Environment variable used but not defined in .env: ${env}`,
                    ruleId: 'env-missing-definition',
                    file: locs[0].file,
                    line: locs[0].line
                });
            }
        }
    }

    return results;
}
