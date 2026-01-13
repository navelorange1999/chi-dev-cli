import path from 'path';
import fs from 'fs-extra';
import { ProjectOptions } from './prompts';
import {
  generatePackageJson,
  generateTsConfig,
  generateFrameworkConfig,
  generateCssConfig,
  generateEslintConfig,
  generatePrettierConfig,
} from './configGenerators';
import { getFileStructure } from '@templates';
import chalk from 'chalk';
import ora from 'ora';

export async function generateProject(options: ProjectOptions, targetDir: string): Promise<void> {
  const spinner = ora('Creating project...').start();
  
  try {
    // Check if directory already exists
    if (await fs.pathExists(targetDir)) {
      spinner.fail(chalk.red(`Directory ${targetDir} already exists`));
      throw new Error(`Directory ${targetDir} already exists`);
    }
    
    // Create project directory
    spinner.text = 'Creating project directory...';
    await fs.ensureDir(targetDir);
    
    // Generate package.json
    spinner.text = 'Generating package.json...';
    const packageJson = generatePackageJson(options);
    await fs.writeJSON(path.join(targetDir, 'package.json'), packageJson, { spaces: 2 });
    
    // Generate TypeScript config
    if (options.language === 'TypeScript') {
      spinner.text = 'Generating TypeScript config...';
      const tsConfig = generateTsConfig(options);
      if (tsConfig) {
        await fs.writeJSON(path.join(targetDir, 'tsconfig.json'), tsConfig, { spaces: 2 });
      }
    }
    
    // Generate framework config
    spinner.text = 'Generating framework config...';
    const frameworkConfig = generateFrameworkConfig(options);
    if (frameworkConfig) {
      await fs.writeFile(
        path.join(targetDir, frameworkConfig.filename),
        frameworkConfig.content
      );
    }
    
    // Generate CSS config
    spinner.text = 'Generating CSS config...';
    const cssConfigs = generateCssConfig(options);
    for (const config of cssConfigs) {
      await fs.writeFile(path.join(targetDir, config.filename), config.content);
    }
    
    // Generate ESLint config
    if (options.eslint) {
      spinner.text = 'Generating ESLint config...';
      const eslintConfig = generateEslintConfig(options);
      if (eslintConfig) {
        await fs.writeFile(
          path.join(targetDir, eslintConfig.filename),
          eslintConfig.content
        );
      }
    }
    
    // Generate Prettier config
    if (options.prettier) {
      spinner.text = 'Generating Prettier config...';
      const prettierConfig = generatePrettierConfig(options);
      if (prettierConfig) {
        await fs.writeFile(
          path.join(targetDir, prettierConfig.filename),
          prettierConfig.content
        );
      }
    }
    
    // Generate template files
    spinner.text = 'Generating template files...';
    const fileStructure = getFileStructure(options);
    for (const file of fileStructure) {
      if (file.isDirectory) {
        await fs.ensureDir(path.join(targetDir, file.path));
      } else {
        const filePath = path.join(targetDir, file.path);
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, file.content);
      }
    }
    
    // Generate .gitignore
    spinner.text = 'Generating .gitignore...';
    const gitignoreContent = generateGitignore(options);
    await fs.writeFile(path.join(targetDir, '.gitignore'), gitignoreContent);
    
    // Generate README
    spinner.text = 'Generating README...';
    const readmeContent = generateReadme(options);
    await fs.writeFile(path.join(targetDir, 'README.md'), readmeContent);
    
    // Initialize Git repository
    spinner.text = 'Initializing Git repository...';
    try {
      await initGitRepository(targetDir);
    } catch (error) {
      // Git initialization failure doesn't affect project creation, just log a warning
      spinner.warn('Git initialization failed, you can run git init manually later');
    }
    
    spinner.succeed(chalk.green('Project created successfully!'));
  } catch (error) {
    spinner.fail(chalk.red('Project creation failed'));
    throw error;
  }
}

async function initGitRepository(targetDir: string): Promise<void> {
  const { execSync } = await import('child_process');
  
  try {
    // Check if git is installed
    execSync('git --version', { stdio: 'ignore' });
  } catch {
    throw new Error('Git is not installed');
  }
  
  // Initialize git repository
  execSync('git init', { cwd: targetDir, stdio: 'ignore' });
  
  // Create initial commit
  try {
    execSync('git add .', { cwd: targetDir, stdio: 'ignore' });
    execSync('git commit -m "Initial commit"', { cwd: targetDir, stdio: 'ignore' });
  } catch {
    // If commit fails (e.g., git user not configured), just initialize the repository
  }
}

function generateGitignore(options: ProjectOptions): string {
  const isNext = options.framework === 'Next.js';
  const isAstro = options.framework === 'Astro';
  
  let content = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
${isNext ? '.next/' : isAstro ? '.astro/' : 'dist/'}
build/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Local env files
.env
.env*.local

# Vercel
.vercel

# Typescript
*.tsbuildinfo
next-env.d.ts
`;

  if (isNext) {
    content += `
# Next.js
out/
`;
  }
  
  if (isAstro) {
    content += `
# Astro
.astro/
`;
  }
  
  return content;
}

function generateReadme(options: ProjectOptions): string {
  const packageManager = options.packageManager;
  const runCmd = packageManager === 'npm' ? 'npm run' : packageManager;
  
  return `# ${options.projectName}

A project built with ${options.framework} + ${options.language} + ${options.cssTool}.

## Getting Started

### Install Dependencies

\`\`\`bash
${packageManager} install
\`\`\`

### Development

\`\`\`bash
${runCmd} dev
\`\`\`

### Build

\`\`\`bash
${runCmd} build
\`\`\`

## Tech Stack

- **Framework**: ${options.framework}
- **Language**: ${options.language}
- **CSS Tool**: ${options.cssTool}
- **Package Manager**: ${options.packageManager}
${options.eslint ? '- **ESLint**: ✅' : ''}
${options.prettier ? '- **Prettier**: ✅' : ''}
`;
}

