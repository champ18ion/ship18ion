import { Ship18ionConfig } from './config';
import { FrameworkType } from './detector';

export interface RuleResult {
    status: 'pass' | 'fail' | 'warn';
    message: string;
    file?: string;
    line?: number;
    ruleId: string;
}

export interface RuleContext {
    config: Ship18ionConfig;
    files: string[];
    cwd: string;
    framework: FrameworkType;
}
