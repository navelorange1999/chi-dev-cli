import { ProjectOptions } from '../utils/prompts';
import { generateIndexHtml } from './html';
import { generateMainFile, generateViteEnvFile } from './entry';
import { generateAppComponent, generateNextLayout } from './components';
import { generateCssFile } from './styles';

export function getFileStructure(options: ProjectOptions): Array<{ path: string; content: string; isDirectory?: boolean }> {
  const files: Array<{ path: string; content: string; isDirectory?: boolean }> = [];
  const ext = options.language === 'TypeScript' ? 'tsx' : 'jsx';
  
  // Create src directory
  files.push({ path: 'src', content: '', isDirectory: true });
  
  switch (options.framework) {
    case 'Next.js': {
      // Next.js structure
      files.push({ path: 'src/app', content: '', isDirectory: true });
      files.push({ path: `src/app/layout.${ext}`, content: generateNextLayout(options) });
      files.push({ path: `src/app/page.${ext}`, content: generateAppComponent(options) });
      
      switch (options.cssTool) {
        case 'Tailwind CSS':
          files.push({ path: 'src/app/globals.css', content: generateCssFile(options) });
          break;
        case 'SCSS':
        case 'CSS':
        default:
          break;
      }
      break;
    }
    
    case 'Astro': {
      // Astro structure
      files.push({ path: 'src/pages', content: '', isDirectory: true });
      files.push({ path: 'src/pages/index.astro', content: generateAppComponent(options) });
      
      switch (options.cssTool) {
        case 'Tailwind CSS':
          files.push({ path: 'src/styles/globals.css', content: generateCssFile(options) });
          files.push({ path: 'src/styles', content: '', isDirectory: true });
          break;
        case 'SCSS':
        case 'CSS':
        default:
          break;
      }
      break;
    }
    
    case 'React':
    case 'Vue': {
      // React/Vue structure
      files.push({ path: 'index.html', content: generateIndexHtml(options) });
      
      const mainExt = options.framework === 'Vue' 
        ? (options.language === 'TypeScript' ? 'ts' : 'js')
        : ext;
      files.push({ path: `src/main.${mainExt}`, content: generateMainFile(options) });
      
      const appPath = options.framework === 'Vue' ? 'src/App.vue' : `src/App.${ext}`;
      files.push({ path: appPath, content: generateAppComponent(options) });
      
      const cssExt = getCssExtension(options.cssTool);
      files.push({ path: `src/index.${cssExt}`, content: generateCssFile(options) });
      
      // Only create vite-env.d.ts for TypeScript projects
      if (options.framework === 'React' && options.language === 'TypeScript') {
        files.push({ path: 'src/vite-env.d.ts', content: generateViteEnvFile(options) });
      }
      break;
    }
    
    default:
      break;
  }
  
  return files;
}

function getCssExtension(cssTool: ProjectOptions['cssTool']): string {
  switch (cssTool) {
    case 'SCSS':
      return 'scss';
    case 'Tailwind CSS':
    case 'CSS':
    default:
      return 'css';
  }
}

