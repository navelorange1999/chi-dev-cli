# Chi CLI

A powerful command-line tool for quickly initializing modern web projects with your preferred tech stack.

## Features

- 🚀 **Interactive Setup**: Step-by-step interactive prompts to configure your project
- 📦 **Multiple Package Managers**: Support for npm, yarn, pnpm, and bun
- ⚛️ **Framework Support**: React, Vue, Next.js, and Astro
- 🎨 **CSS Tools**: Tailwind CSS, SCSS, or plain CSS
- 📝 **TypeScript/JavaScript**: Choose your preferred language
- 🔧 **Code Quality**: Optional ESLint and Prettier configuration
- 🔄 **Git Integration**: Automatic Git repository initialization

## Installation

### Global Installation

```bash
npm install -g @chi/cli
# or
yarn global add @chi/cli
# or
pnpm add -g @chi/cli
# or
bun install -g @chi/cli
```

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd chi-dev-cli

# Install dependencies (recommended)
bun install --frozen-lockfile

# Build the project
bun run build
```

## Usage

### Initialize a New Project

```bash
chi init [project-name]
```

If you don't provide a project name, you'll be prompted to enter one.

### Interactive Prompts

The CLI will guide you through the following steps:

1. **Project Name**: Enter your project name (if not provided as argument)
2. **Package Manager**: Choose from npm, yarn, pnpm, or bun
3. **Framework**: Select React, Vue, Next.js, or Astro
4. **CSS Tool**: Choose Tailwind CSS, SCSS, or plain CSS
5. **Language**: Select TypeScript or JavaScript
6. **ESLint**: Choose whether to include ESLint configuration
7. **Prettier**: Choose whether to include Prettier configuration

### Example

```bash
$ chi init my-awesome-project

✨ Starting project initialization...

? Select package manager: pnpm
? Select framework: Next.js
? Select CSS tool: Tailwind CSS
? Select language: TypeScript
? Do you need ESLint? Yes
? Do you need Prettier? Yes

✅ Project initialized successfully!

📝 Next steps:
   cd my-awesome-project
   pnpm install
   pnpm dev
```

## Supported Technologies

### Package Managers
- npm
- yarn
- pnpm
- bun

### Frameworks
- **React**: With Vite
- **Vue**: With Vite
- **Next.js**: Full Next.js setup
- **Astro**: Astro project structure

### CSS Tools
- **Tailwind CSS**: With PostCSS and Autoprefixer
- **SCSS**: Sass/SCSS support
- **CSS**: Plain CSS

### Languages
- TypeScript
- JavaScript

### Code Quality Tools
- ESLint (optional)
- Prettier (optional)

## Development

### Prerequisites

- Node.js 18+
- Bun (recommended)

### Scripts

```bash
# Install deps
bun install --frozen-lockfile

# Development mode (runs TypeScript directly)
bun run dev

# Build for production
bun run build

# Run built version
bun run start
```

### Release / Publish (Maintainers)

This repo uses **release-please** to manage versions/tags/GitHub Releases, and a separate workflow to publish to **npm** automatically.

**How it works**

1. Every push to `master` updates/creates a **Release PR** (via GitHub Actions).
2. Merging the Release PR will:
    - bump `package.json` version
    - update changelog content in the PR
    - create a git tag (usually `vX.Y.Z`)
    - create a GitHub Release
3. When the GitHub Release is **published**, another workflow builds with Bun and runs `npm publish`.

**Requirements**

- GitHub repo secret: `NPM_TOKEN`
   - Create an npm **Automation token** and add it at: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

**Commit message convention (recommended)**

release-please is designed to work best with Conventional Commits, for example:

- `feat: add new init option` (minor)
- `fix: handle empty project name` (patch)
- `feat!: change default template` (major)

### Project Structure

### Project Structure

```
chi-dev-cli/
├── src/
│   ├── cli.ts                  # Main CLI entry point
│   ├── commands/
│   │   └── init.ts              # Init command implementation
│   └── utils/
│       ├── prompts.ts           # Interactive prompts
│       ├── configGenerators.ts  # Configuration file generators
│       └── projectGenerator.ts  # Main project generator
├── templates/                   # Project templates
├── dist/                      # Build output
├── tsconfig.json              # TypeScript configuration
├── tsup.config.ts             # Build configuration
└── package.json
```

## How It Works

1. **Prompts**: The CLI uses `inquirer` to collect user preferences
2. **Configuration Generation**: Based on selections, generates:
   - `package.json` with appropriate dependencies
   - Framework-specific configuration files
   - TypeScript configuration (if selected)
   - CSS tool configuration (Tailwind/SCSS)
   - ESLint and Prettier configs (if selected)
3. **Template Generation**: Creates starter files based on the selected framework
4. **Git Initialization**: Automatically initializes a Git repository

## Generated Project Structure

The CLI generates a complete project structure based on your selections:

- **React/Vue**: Vite-based setup with proper entry points
- **Next.js**: App Router structure with layout and pages
- **Astro**: Astro pages structure

All projects include:
- Proper configuration files
- Starter component/page files
- CSS setup based on your choice
- `.gitignore` file
- `README.md` with setup instructions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

navelorange1999


