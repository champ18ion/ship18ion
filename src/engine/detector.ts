import fs from 'fs';
import path from 'path';

export type FrameworkType = 'nextjs' | 'remix' | 'vite' | 'nestjs' | 'express' | 'fastify' | 'Node.js / Generic' | 'unknown';

export async function detectFramework(cwd: string): Promise<FrameworkType> {
    const pkgPath = path.join(cwd, 'package.json');
    if (!fs.existsSync(pkgPath)) {
        return 'unknown';
    }

    try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        if (deps['next']) return 'nextjs';
        if (deps['@remix-run/react']) return 'remix';
        if (deps['vite']) return 'vite';
        if (deps['@nestjs/core']) return 'nestjs';
        if (deps['express']) return 'express';
        if (deps['fastify']) return 'fastify';

        return 'Node.js / Generic';
    } catch (e) {
        return 'unknown';
    }
}
