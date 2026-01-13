#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';

const program = new Command();

program
  .name('chi')
  .description('CLI for Chi')
  .version('1.0.0');

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

