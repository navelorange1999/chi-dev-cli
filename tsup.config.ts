import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  bundle: true,
  minify: false,
  sourcemap: true,
  splitting: false,
  alias: {
    '@templates': resolve(__dirname, 'src/templates'),
  },
});

