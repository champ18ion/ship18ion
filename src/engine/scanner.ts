import { glob } from 'glob';
import path from 'path';

export async function scanFiles(cwd: string, ignore: string[] = []): Promise<string[]> {
    // Ignore build artifacts, node_modules, and git
    const defaultIgnore = [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/.turbo/**',
        '**/coverage/**'
    ];
    // Scan for relevant files: JS/TS code, Configs (JSON/YAML), Env files
    return glob('**/*.{js,ts,jsx,tsx,json,yaml,yml,env,env.*}', {
        cwd,
        ignore: [...defaultIgnore, ...ignore],
        absolute: true,
        dot: true, // Include .env files
    });
}
