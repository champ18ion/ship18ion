import chalk from 'chalk';
import path from 'path';
import { RuleResult } from '../engine/types';

const CATEGORIES: Record<string, { icon: string; label: string }> = {
    'env': { icon: '🌱', label: 'Environment' },
    'secret': { icon: '🔐', label: 'Secrets' },
    'security': { icon: '⚠️', label: 'Security' },
    'dep': { icon: '📦', label: 'Dependency & Build' },
    'build': { icon: '📦', label: 'Dependency & Build' },
    'git': { icon: '🐙', label: 'Git & Repo' },
    'hygiene': { icon: '🧹', label: 'Code Hygiene' },
    'package': { icon: '📦', label: 'Packages' },
};

function getCategory(ruleId: string) {
    const prefix = ruleId.split('-')[0];
    return CATEGORIES[prefix] || { icon: '❓', label: 'Other' };
}

export function reportConsole(results: RuleResult[], cwd: string, framework?: string) {
    if (framework) {
        console.log(chalk.blue(`ℹ️  Framework: ${framework.toUpperCase()}`));
    }

    if (results.length === 0) {
        console.log(chalk.green('\n✅  Production Readiness Check Passed!\n'));
        return;
    }

    const fails = results.filter(r => r.status === 'fail');
    const warns = results.filter(r => r.status === 'warn');

    if (fails.length > 0) {
        console.log(chalk.red('\n❌  Production Readiness Check Failed\n'));
    } else {
        console.log(chalk.yellow('\n⚠️  Production Readiness Check Passed with Warnings\n'));
    }

    // Group by category
    const grouped: Record<string, RuleResult[]> = {};
    results.forEach(r => {
        const cat = getCategory(r.ruleId);
        const key = `${cat.icon} ${cat.label}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(r);
    });

    for (const [category, items] of Object.entries(grouped)) {
        console.log(chalk.bold(category));
        for (const item of items) {
            const sym = item.status === 'fail' ? chalk.red('✖') : chalk.yellow('!');
            const location = item.file ? `${path.relative(cwd, item.file)}${item.line ? `:${item.line}` : ''}` : '';
            console.log(`  ${sym} ${item.message} ${chalk.gray(location)}`);
        }
        console.log('');
    }

    const summary = [];
    if (fails.length > 0) summary.push(chalk.red(`${fails.length} errors`));
    if (warns.length > 0) summary.push(chalk.yellow(`${warns.length} warnings`));

    console.log(`Summary: ${summary.join(', ')}`);
    console.log('');

    if (fails.length > 0) {
        process.exit(1);
    }
}
