#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("../engine/config");
const runner_1 = require("../engine/runner");
const console_1 = require("../reporters/console");
const program = new commander_1.Command();
const figlet_1 = __importDefault(require("figlet"));
const gradient_string_1 = __importDefault(require("gradient-string"));
const ora_1 = __importDefault(require("ora"));
const detector_1 = require("../engine/detector");
program
    .command('check', { isDefault: true })
    .description('Run production readiness checks')
    .option('--ci', 'Run in CI mode (minimal output, exit codes)')
    .action(async (options) => {
    if (!options.ci) {
        console.log(gradient_string_1.default.pastel.multiline(figlet_1.default.textSync('SHIP18ION')));
        console.log(chalk_1.default.dim('Production Readiness Inspector\n'));
    }
    const cwd = process.cwd();
    const config = await (0, config_1.loadConfig)(cwd);
    const spinner = (0, ora_1.default)('Initializing...').start();
    try {
        let framework = 'unknown';
        if (!options.ci) {
            framework = await (0, detector_1.detectFramework)(cwd);
            spinner.text = `Detected Framework: ${chalk_1.default.cyan(framework.toUpperCase())}`;
            await new Promise(r => setTimeout(r, 800)); // Brief pause to show framework
        }
        else {
            // Even in CI, simple detection is useful for reporting if needed, or we just skip
            framework = await (0, detector_1.detectFramework)(cwd);
        }
        const results = await (0, runner_1.runChecks)(config, cwd, (stage) => {
            if (!options.ci)
                spinner.text = stage;
        });
        spinner.succeed(chalk_1.default.green('Checks completed!'));
        console.log('');
        // Uses console reporter for both normal and CI for now (it handles exit codes)
        (0, console_1.reportConsole)(results, cwd, framework);
    }
    catch (e) {
        spinner.fail(chalk_1.default.red('Error running checks'));
        console.error(e);
        process.exit(1);
    }
});
program.parse(process.argv);
