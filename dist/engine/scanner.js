"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanFiles = scanFiles;
const glob_1 = require("glob");
async function scanFiles(cwd, ignore = []) {
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
    return (0, glob_1.glob)('**/*.{js,ts,jsx,tsx,json,yaml,yml,env,env.*}', {
        cwd,
        ignore: [...defaultIgnore, ...ignore],
        absolute: true,
        dot: true, // Include .env files
    });
}
