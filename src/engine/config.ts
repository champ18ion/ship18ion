import fs from 'fs';
import path from 'path';

export interface Ship18ionConfig {
    env?: {
        required?: string[];
        disallowed?: string[];
    };
    security?: {
        noCorsWildcard?: boolean;
        requireRateLimit?: boolean;
    };
    ignore?: string[];
}

export async function loadConfig(cwd: string = process.cwd()): Promise<Ship18ionConfig> {
    const configPath = path.join(cwd, 'ship18ion.config.json');
    if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf-8');
        try {
            return JSON.parse(content);
        } catch (e) {
            console.error('Failed to parse config file:', e);
            return {};
        }
    }
    return {};
}
