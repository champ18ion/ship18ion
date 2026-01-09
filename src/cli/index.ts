#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig } from '../engine/config';
import { runChecks } from '../engine/runner';
import { reportConsole } from '../reporters/console';

const program = new Command();

import figlet from 'figlet';
import gradient from 'gradient-string';
import ora from 'ora';
import { detectFramework } from '../engine/detector';

program
    .command('check', { isDefault: true })
    .description('Run production readiness checks')
    .option('--ci', 'Run in CI mode (minimal output, exit codes)')
    .action(async (options) => {
        if (!options.ci) {
            console.log(gradient.pastel.multiline(figlet.textSync('SHIP18ION')));
            console.log(chalk.dim('Production Readiness Inspector\n'));
        }

        const cwd = process.cwd();
        const config = await loadConfig(cwd);
        const spinner = ora('Initializing...').start();

        try {
            let framework: string = 'unknown';
            if (!options.ci) {
                framework = await detectFramework(cwd);
                spinner.text = `Detected Framework: ${chalk.cyan(framework.toUpperCase())}`;
                await new Promise(r => setTimeout(r, 800)); // Brief pause to show framework
            } else {
                // Even in CI, simple detection is useful for reporting if needed, or we just skip
                framework = await detectFramework(cwd);
            }

            const results = await runChecks(config, cwd, (stage) => {
                if (!options.ci) spinner.text = stage;
            });

            spinner.succeed(chalk.green('Checks completed!'));
            console.log('');

            // Uses console reporter for both normal and CI for now (it handles exit codes)
            reportConsole(results, cwd, framework);
        } catch (e) {
            spinner.fail(chalk.red('Error running checks'));
            console.error(e);
            process.exit(1);
        }
    });

program.parse(process.argv);
