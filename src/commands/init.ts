import path from 'path';
import chalk from 'chalk';
import { promptProjectOptions } from '../utils/prompts';
import { generateProject } from '../utils/projectGenerator';

export async function initCommand(projectName?: string): Promise<void> {
  try {
    // Get project options (if project name is provided, skip project name prompt)
    const options = await promptProjectOptions(projectName);
    
    const targetDir = path.resolve(process.cwd(), options.projectName);
    
    console.log(chalk.blue('\n✨ Starting project initialization...\n'));
    
    // Generate project
    await generateProject(options, targetDir);
    
    // Display success message
    console.log(chalk.green('\n✅ Project initialized successfully!\n'));
    console.log(chalk.yellow('📝 Next steps:'));
    console.log(chalk.cyan(`   cd ${options.projectName}`));
    console.log(chalk.cyan(`   ${options.packageManager} install`));
    console.log(chalk.cyan(`   ${options.packageManager === 'npm' ? 'npm run' : options.packageManager} dev\n`));
    
  } catch (error: any) {
    console.error(chalk.red('\n❌ Initialization failed:'), error.message);
    process.exit(1);
  }
}

