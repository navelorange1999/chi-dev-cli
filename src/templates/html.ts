import { ProjectOptions } from '../utils/prompts';

export function generateIndexHtml(options: ProjectOptions): string {
  switch (options.framework) {
    case 'Next.js':
    case 'Astro':
      return ''; // Next.js and Astro don't need index.html
    
    case 'React':
    case 'Vue':
    default:
      const ext = options.language === 'TypeScript' ? 'tsx' : 'jsx';
      return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${options.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${ext}"></script>
  </body>
</html>
`;
  }
}

