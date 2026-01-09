"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPackages = checkPackages;
const fs_1 = __importDefault(require("fs"));
async function checkPackages(ctx) {
    const results = [];
    const packageJsons = ctx.files.filter(f => f.endsWith('package.json') && !f.includes('node_modules'));
    for (const pkgFile of packageJsons) {
        try {
            const content = JSON.parse(fs_1.default.readFileSync(pkgFile, 'utf-8'));
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
        }
        catch (e) {
            // ignore malformed json
        }
    }
    return results;
}
