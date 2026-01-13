import inquirer from 'inquirer';

export interface ProjectOptions {
  projectName: string;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  framework: 'React' | 'Vue' | 'Next.js' | 'Astro';
  cssTool: 'Tailwind CSS' | 'SCSS' | 'CSS';
  language: 'TypeScript' | 'JavaScript';
  eslint: boolean;
  prettier: boolean;
}

export async function promptProjectOptions(projectName?: string): Promise<ProjectOptions> {
  const questions: any[] = [];
  
  // If project name is not provided, add project name prompt
  if (!projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'Enter project name:',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Project name cannot be empty';
        }
        if (!/^[a-z0-9-]+$/i.test(input)) {
          return 'Project name can only contain letters, numbers, and hyphens';
        }
        return true;
      },
    });
  }
  
  const answers = await inquirer.prompt([
    ...questions,
    {
      type: 'list',
      name: 'packageManager',
      message: 'Select package manager:',
      choices: ['npm', 'yarn', 'pnpm', 'bun'],
      default: 'pnpm',
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Select framework:',
      choices: ['React', 'Vue', 'Next.js', 'Astro'],
    },
    {
      type: 'list',
      name: 'cssTool',
      message: 'Select CSS tool:',
      choices: ['Tailwind CSS', 'SCSS', 'CSS'],
    },
    {
      type: 'list',
      name: 'language',
      message: 'Select language:',
      choices: ['TypeScript', 'JavaScript'],
    },
    {
      type: 'confirm',
      name: 'eslint',
      message: 'Do you need ESLint?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'prettier',
      message: 'Do you need Prettier?',
      default: true,
    },
  ]);

  return {
    ...answers,
    projectName: projectName || answers.projectName,
  } as ProjectOptions;
}

