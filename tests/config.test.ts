import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { pagesBase } from '../vite.config';
import { hex, size, matches } from '../src/utils/format';
it('formats bytes without dropping zeroes', () => {
  expect(hex(new Uint8Array([0, 15, 255]))).toBe('000fff');
  expect(size(1234)).toBe('1,234 B');
  expect(size()).toBe('—');
  expect(matches(undefined, undefined)).toBe(false);
});
it('supports project, owner-site and local base paths', () => {
  expect(pagesBase('alice/nist-pqc-playground')).toBe('/nist-pqc-playground/');
  expect(pagesBase('alice/renamed')).toBe('/renamed/');
  expect(pagesBase('alice/alice.github.io')).toBe('/');
  expect(pagesBase('')).toBe('/nist-pqc-playground/');
});
it('parses a correctly permissioned Pages deployment', () => {
  const workflow = parse(
    readFileSync('.github/workflows/deploy-pages.yml', 'utf8'),
  );
  expect(workflow.on.push.branches).toEqual(['main']);
  expect(workflow.on).toHaveProperty('workflow_dispatch');
  expect(workflow.permissions['pages']).toBe('write');
  expect(workflow.permissions['id-token']).toBe('write');
  expect(
    workflow.jobs.deploy.steps.some(
      (step: { run?: string }) => step.run === 'npm test',
    ),
  ).toBe(true);
});
