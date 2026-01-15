#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { version: string };

const program = new Command();

program
  .name('chi')
  .description('CLI for Chi')
  .version(pkg.version);

// 初始化项目命令
program
  .command('init')
  .description('Initialize a new project')
  .argument('[project-name]', 'Name of the project')
  .action(async (projectName) => {
    await initCommand(projectName);
  });

// 解析命令行参数
program.parse();

