"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportConsole = reportConsole;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const CATEGORIES = {
    'env': { icon: '🌱', label: 'Environment' },
    'secret': { icon: '🔐', label: 'Secrets' },
    'security': { icon: '⚠️', label: 'Security' },
    'dep': { icon: '📦', label: 'Dependency & Build' },
    'build': { icon: '📦', label: 'Dependency & Build' },
    'git': { icon: '🐙', label: 'Git & Repo' },
    'hygiene': { icon: '🧹', label: 'Code Hygiene' },
    'package': { icon: '📦', label: 'Packages' },
};
function getCategory(ruleId) {
    const prefix = ruleId.split('-')[0];
    return CATEGORIES[prefix] || { icon: '❓', label: 'Other' };
}
function reportConsole(results, cwd, framework) {
    if (framework) {
        console.log(chalk_1.default.blue(`ℹ️  Framework: ${framework.toUpperCase()}`));
    }
    if (results.length === 0) {
        console.log(chalk_1.default.green('\n✅  Production Readiness Check Passed!\n'));
        return;
    }
    const fails = results.filter(r => r.status === 'fail');
    const warns = results.filter(r => r.status === 'warn');
    if (fails.length > 0) {
        console.log(chalk_1.default.red('\n❌  Production Readiness Check Failed\n'));
    }
    else {
        console.log(chalk_1.default.yellow('\n⚠️  Production Readiness Check Passed with Warnings\n'));
    }
    // Group by category
    const grouped = {};
    results.forEach(r => {
        const cat = getCategory(r.ruleId);
        const key = `${cat.icon} ${cat.label}`;
        if (!grouped[key])
            grouped[key] = [];
        grouped[key].push(r);
    });
    for (const [category, items] of Object.entries(grouped)) {
        console.log(chalk_1.default.bold(category));
        for (const item of items) {
            const sym = item.status === 'fail' ? chalk_1.default.red('✖') : chalk_1.default.yellow('!');
            const location = item.file ? `${path_1.default.relative(cwd, item.file)}${item.line ? `:${item.line}` : ''}` : '';
            console.log(`  ${sym} ${item.message} ${chalk_1.default.gray(location)}`);
        }
        console.log('');
    }
    const summary = [];
    if (fails.length > 0)
        summary.push(chalk_1.default.red(`${fails.length} errors`));
    if (warns.length > 0)
        summary.push(chalk_1.default.yellow(`${warns.length} warnings`));
    console.log(`Summary: ${summary.join(', ')}`);
    console.log('');
    if (fails.length > 0) {
        process.exit(1);
    }
}
