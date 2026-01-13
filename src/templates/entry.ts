import { ProjectOptions } from '../utils/prompts';

export function generateMainFile(options: ProjectOptions): string {
  const ext = options.language === 'TypeScript' ? 'tsx' : 'jsx';
  
  switch (options.framework) {
    case 'Next.js':
    case 'Astro':
      return ''; // Next.js uses app directory structure, Astro doesn't need main file
    
    case 'React': {
      const cssImport = getCssImport(options.cssTool);
      return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
${cssImport}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
    }
    
    case 'Vue': {
      const cssImport = getCssImport(options.cssTool);
      return `import { createApp } from 'vue';
import App from './App.vue';
${cssImport}

createApp(App).mount('#root');
`;
    }
    
    default:
      return '';
  }
}

function getCssImport(cssTool: ProjectOptions['cssTool']): string {
  switch (cssTool) {
    case 'Tailwind CSS':
      return "import './index.css';";
    case 'SCSS':
      return "import './index.scss';";
    case 'CSS':
    default:
      return "import './index.css';";
  }
}

export function generateViteEnvFile(options: ProjectOptions): string {
  switch (options.language) {
    case 'TypeScript':
      return `/// <reference types="vite/client" />
`;
    case 'JavaScript':
    default:
      return '';
  }
}

