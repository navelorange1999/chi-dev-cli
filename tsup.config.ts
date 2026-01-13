import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['cjs'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  bundle: true,
  minify: false,
  sourcemap: true,
  splitting: false,
  alias: {
    '@templates': resolve(__dirname, 'src/templates'),
  },
});

