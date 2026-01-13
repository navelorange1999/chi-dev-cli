import { ProjectOptions } from '../utils/prompts';

export function generateCssFile(options: ProjectOptions): string {
  switch (options.cssTool) {
    case 'Tailwind CSS':
      return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
}
`;
    
    case 'SCSS':
      return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
}

.container {
  padding: 2rem;
  text-align: center;
}
`;
    
    case 'CSS':
    default:
      return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
}

.container {
  padding: 2rem;
  text-align: center;
}
`;
  }
}

