import { ProjectOptions } from './prompts';

export function generatePackageJson(options: ProjectOptions): object {
  const ext = options.language === 'TypeScript' ? 'ts' : 'js';
  const isNext = options.framework === 'Next.js';
  const isAstro = options.framework === 'Astro';
  
  // 基础依赖
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};
  
  // 框架依赖
  if (options.framework === 'React') {
    dependencies.react = '^18.3.1';
    dependencies['react-dom'] = '^18.3.1';
    devDependencies['@vitejs/plugin-react'] = '^4.3.1';
    devDependencies.vite = '^5.4.0';
  } else if (options.framework === 'Vue') {
    dependencies.vue = '^3.5.13';
    devDependencies['@vitejs/plugin-vue'] = '^5.2.1';
    devDependencies.vite = '^5.4.0';
  } else if (options.framework === 'Next.js') {
    dependencies.next = '^15.1.3';
    dependencies.react = '^18.3.1';
    dependencies['react-dom'] = '^18.3.1';
  } else if (options.framework === 'Astro') {
    dependencies.astro = '^5.1.3';
  }
  
  // CSS 工具依赖
  if (options.cssTool === 'Tailwind CSS') {
    devDependencies.tailwindcss = '^3.4.17';
    devDependencies.postcss = '^8.4.49';
    devDependencies.autoprefixer = '^10.4.20';
  } else if (options.cssTool === 'SCSS') {
    devDependencies.sass = '^1.83.0';
  }
  
  // TypeScript 依赖
  if (options.language === 'TypeScript') {
    devDependencies.typescript = '^5.7.2';
    devDependencies['@types/node'] = '^22.10.2';
    if (options.framework === 'React') {
      devDependencies['@types/react'] = '^18.3.12';
      devDependencies['@types/react-dom'] = '^18.3.1';
    } else if (options.framework === 'Vue') {
      devDependencies['@volar/vue-language-plugin-pug'] = '^2.1.6';
    }
  }
  
  // ESLint 依赖
  if (options.eslint) {
    devDependencies.eslint = '^9.17.0';
    if (options.language === 'TypeScript') {
      devDependencies['@typescript-eslint/eslint-plugin'] = '^8.18.2';
      devDependencies['@typescript-eslint/parser'] = '^8.18.2';
    }
    if (options.framework === 'React') {
      devDependencies['eslint-plugin-react'] = '^7.37.3';
      devDependencies['eslint-plugin-react-hooks'] = '^5.1.0';
    } else if (options.framework === 'Vue') {
      devDependencies['eslint-plugin-vue'] = '^9.32.0';
    } else if (options.framework === 'Next.js') {
      devDependencies['eslint-config-next'] = '^15.1.3';
    }
  }
  
  // Prettier 依赖
  if (options.prettier) {
    devDependencies.prettier = '^3.4.2';
    if (options.cssTool === 'Tailwind CSS') {
      devDependencies['prettier-plugin-tailwindcss'] = '^0.6.9';
    }
  }
  
  // Scripts
  const scripts: Record<string, string> = {};
  const packageManager = options.packageManager;
  const runCmd = packageManager === 'npm' ? 'npm run' : packageManager;
  
  if (isNext) {
    scripts.dev = 'next dev';
    scripts.build = 'next build';
    scripts.start = 'next start';
    if (options.eslint) {
      scripts.lint = 'next lint';
    }
  } else if (isAstro) {
    scripts.dev = 'astro dev';
    scripts.build = 'astro build';
    scripts.start = 'astro preview';
  } else {
    scripts.dev = 'vite';
    scripts.build = 'vite build';
    scripts.preview = 'vite preview';
  }
  
  if (options.prettier) {
    scripts.format = 'prettier --write "**/*.{ts,tsx,js,jsx,json,css,scss,md}"';
  }
  
  // 清理 undefined
  Object.keys(scripts).forEach(key => {
    if (scripts[key] === undefined) delete scripts[key];
  });
  
  const packageJson: any = {
    name: options.projectName,
    version: '0.1.0',
    private: true,
    scripts,
    dependencies,
    devDependencies,
  };
  
  // Next.js 不需要 type: 'module'，其他框架使用 ES modules
  if (!isNext) {
    packageJson.type = 'module';
  }
  
  return packageJson;
}

export function generateTsConfig(options: ProjectOptions): object | null {
  if (options.language !== 'TypeScript') return null;
  
  const isNext = options.framework === 'Next.js';
  const isAstro = options.framework === 'Astro';
  
  if (isNext) {
    return {
      compilerOptions: {
        target: 'ES2017',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    };
  }
  
  if (isAstro) {
    return {
      extends: 'astro/tsconfigs/strict',
      compilerOptions: {
        jsx: 'react-jsx',
        jsxImportSource: 'react',
      },
    };
  }
  
  return {
    compilerOptions: {
      target: 'ES2020',
      module: 'ESNext',
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      jsx: options.framework === 'React' ? 'react-jsx' : undefined,
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      allowJs: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      isolatedModules: true,
    },
    include: ['src'],
    exclude: ['node_modules'],
  };
}

export function generateFrameworkConfig(options: ProjectOptions): { filename: string; content: string } | null {
  const ext = options.language === 'TypeScript' ? 'ts' : 'js';
  const isNext = options.framework === 'Next.js';
  const isAstro = options.framework === 'Astro';
  
  if (isNext) {
    return {
      filename: `next.config.${ext}`,
      content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add your Next.js config here
}

module.exports = nextConfig
`,
    };
  }
  
  if (isAstro) {
    return {
      filename: 'astro.config.mjs',
      content: `import { defineConfig } from 'astro/config';
${options.framework === 'React' ? "import react from '@astrojs/react';" : ''}

export default defineConfig({
  ${options.framework === 'React' ? 'integrations: [react()],' : ''}
});
`,
    };
  }
  
  // Vite config for React/Vue
  if (options.framework === 'React' || options.framework === 'Vue') {
    const plugin = options.framework === 'React' ? 'react' : 'vue';
    return {
      filename: `vite.config.${ext}`,
      content: `import { defineConfig } from 'vite';
import ${plugin} from '@vitejs/plugin-${plugin}';

export default defineConfig({
  plugins: [${plugin}()],
});
`,
    };
  }
  
  return null;
}

export function generateCssConfig(options: ProjectOptions): Array<{ filename: string; content: string }> {
  const configs: Array<{ filename: string; content: string }> = [];
  
  if (options.cssTool === 'Tailwind CSS') {
    configs.push({
      filename: 'tailwind.config.js',
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
    });
    
    configs.push({
      filename: 'postcss.config.js',
      content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,
    });
  }
  
  return configs;
}

export function generateEslintConfig(options: ProjectOptions): { filename: string; content: string } | null {
  if (!options.eslint) return null;
  
  const isNext = options.framework === 'Next.js';
  const isAstro = options.framework === 'Astro';
  
  if (isNext) {
    return {
      filename: '.eslintrc.json',
      content: JSON.stringify({
        extends: 'next/core-web-vitals',
      }, null, 2),
    };
  }
  
  const config: any = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [],
    parser: options.language === 'TypeScript' ? '@typescript-eslint/parser' : undefined,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: options.framework === 'React' || options.framework === 'Vue',
      },
    },
    plugins: [],
    rules: {},
  };
  
  if (options.language === 'TypeScript') {
    config.extends.push('plugin:@typescript-eslint/recommended');
    config.plugins.push('@typescript-eslint');
  }
  
  if (options.framework === 'React') {
    config.extends.push('plugin:react/recommended', 'plugin:react-hooks/recommended');
    config.plugins.push('react', 'react-hooks');
    config.settings = {
      react: {
        version: 'detect',
      },
    };
  } else if (options.framework === 'Vue') {
    config.extends.push('plugin:vue/vue3-recommended');
    config.plugins.push('vue');
  }
  
  // 清理 undefined
  if (!config.parser) delete config.parser;
  
  return {
    filename: '.eslintrc.json',
    content: JSON.stringify(config, null, 2),
  };
}

export function generatePrettierConfig(options: ProjectOptions): { filename: string; content: string } | null {
  if (!options.prettier) return null;
  
  const config: any = {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    printWidth: 80,
  };
  
  if (options.cssTool === 'Tailwind CSS') {
    config.plugins = ['prettier-plugin-tailwindcss'];
  }
  
  return {
    filename: '.prettierrc',
    content: JSON.stringify(config, null, 2),
  };
}

