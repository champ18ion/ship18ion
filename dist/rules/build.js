"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDependencies = checkDependencies;
exports.checkBuild = checkBuild;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function checkDependencies(ctx) {
    const results = [];
    const packageJsons = ctx.files.filter(f => f.endsWith('package.json') && !f.includes('node_modules'));
    const devToolsInProd = ['eslint', 'jest', 'mocha', 'nodemon', 'ts-node', 'typescript', 'webpack', 'babel-loader'];
    for (const pkgFile of packageJsons) {
        try {
            const content = JSON.parse(fs_1.default.readFileSync(pkgFile, 'utf-8'));
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
        }
        catch (e) {
            // ignore
        }
    }
    return results;
}
const glob_1 = require("glob");
async function checkBuild(ctx) {
    const results = [];
    // Explicitly scan build folders (dist, build, .next, .output) for dangerous files
    // The main scanner ignores these, so we check them separately here.
    const buildDirs = ['dist', 'build', '.next', '.output'];
    const foundBuildDirs = buildDirs.filter(d => fs_1.default.existsSync(path_1.default.join(ctx.cwd, d)));
    if (foundBuildDirs.length === 0) {
        return results;
    }
    // 1. Check for Source Maps (.map)
    // We search inside the found build directories
    for (const dir of foundBuildDirs) {
        const mapFiles = await (0, glob_1.glob)(`${dir}/**/*.map`, { cwd: ctx.cwd, absolute: true });
        if (mapFiles.length > 0) {
            results.push({
                status: 'warn',
                message: `Found ${mapFiles.length} source map files in '${dir}' (e.g. ${path_1.default.basename(mapFiles[0])}). Ensure these are not exposed publicly.`,
                ruleId: 'build-source-map',
                file: dir // Point to the directory itself
            });
        }
        // 2. Check for .env files in build output
        // We look for .env* files inside the build dir
        const envFiles = await (0, glob_1.glob)(`${dir}/**/*.env*`, { cwd: ctx.cwd, absolute: true });
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
