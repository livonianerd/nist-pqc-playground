import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export function pagesBase(repo = process.env.GITHUB_REPOSITORY) {
  const name = repo?.split('/')[1];
  return name
    ? name.endsWith('.github.io')
      ? '/'
      : `/${name}/`
    : '/nist-pqc-playground/';
}
export default defineConfig({
  plugins: [react()],
  base: pagesBase(),
  worker: { format: 'es' },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    testTimeout: 120000,
  },
});
