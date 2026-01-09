"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFramework = detectFramework;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function detectFramework(cwd) {
    const pkgPath = path_1.default.join(cwd, 'package.json');
    if (!fs_1.default.existsSync(pkgPath)) {
        return 'unknown';
    }
    try {
        const pkg = JSON.parse(fs_1.default.readFileSync(pkgPath, 'utf-8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (deps['next'])
            return 'nextjs';
        if (deps['@remix-run/react'])
            return 'remix';
        if (deps['vite'])
            return 'vite';
        if (deps['@nestjs/core'])
            return 'nestjs';
        if (deps['express'])
            return 'express';
        if (deps['fastify'])
            return 'fastify';
        return 'Node.js / Generic';
    }
    catch (e) {
        return 'unknown';
    }
}
