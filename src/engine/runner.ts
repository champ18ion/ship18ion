import { Ship18ionConfig } from './config';
import { scanFiles } from './scanner';
import { RuleContext, RuleResult } from './types';
import { checkEnvVars } from '../rules/env';
import { checkSecrets } from '../rules/secrets';
import { checkSecurity } from '../rules/security';
import { checkDependencies, checkBuild } from '../rules/build';
import { checkHygiene } from '../rules/hygiene';
import { checkPackages } from '../rules/packages';
import { checkNextJs } from '../rules/frameworks/nextjs';
import { checkGit } from '../rules/git';

import { detectFramework } from './detector';

export async function runChecks(
    config: Ship18ionConfig,
    cwd: string,
    onProgress?: (stage: string) => void
): Promise<RuleResult[]> {
    if (onProgress) onProgress('Scanning files...');
    const files = await scanFiles(cwd, config.ignore);
    // Framework detection
    const framework = await detectFramework(cwd);

    const ctx: RuleContext = { config, files, cwd, framework };

    const results: RuleResult[] = [];

    // Run all checks
    if (onProgress) onProgress('Checking environment variables...');
    results.push(...await checkEnvVars(ctx));

    if (onProgress) onProgress('Scanning for secrets...');
    results.push(...await checkSecrets(ctx));

    if (onProgress) onProgress('Analyzing security configurations...');
    results.push(...await checkSecurity(ctx));

    if (onProgress) onProgress('Verifying dependencies...');
    results.push(...await checkDependencies(ctx));

    if (onProgress) onProgress('Inspecting build artifacts...');
    results.push(...await checkBuild(ctx));

    // New Rules
    if (onProgress) onProgress('Checking code hygiene...');
    results.push(...await checkHygiene(ctx));

    if (onProgress) onProgress('Validating packages...');
    results.push(...await checkPackages(ctx));

    // Framework specific checks
    if (framework === 'nextjs') {
        if (onProgress) onProgress('Running Next.js specific checks...');
        results.push(...await checkNextJs(ctx));
    }

    if (onProgress) onProgress('Checking git status...');
    results.push(...await checkGit(ctx));

    return results;
}
