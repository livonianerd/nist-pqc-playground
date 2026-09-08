import { test, expect } from '@playwright/test';
test('real browser crypto, private requests, refresh and mobile layout', async ({
  page,
}, info) => {
  const errors: string[] = [];
  const requests: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('request', (r) => {
    if (!r.url().startsWith('http://127.0.0.1:4173/nist-pqc-playground/'))
      requests.push(r.url());
    if (['fetch', 'xhr'].includes(r.resourceType()) || r.method() !== 'GET')
      requests.push(r.url());
  });
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'future of security',
  );
  await expect(page.locator('body')).toHaveJSProperty(
    'scrollWidth',
    await page.locator('body').evaluate((el) => el.clientWidth),
  );
  await page.screenshot({
    path: `test-results/${info.project.name}-introduction.png`,
    fullPage: true,
  });
  await page.getByRole('link', { name: /Start the Playground/ }).click();
  await page.getByRole('button', { name: /Generate Bob/ }).click();
  await page.getByRole('button', { name: /Encapsulate Secret/ }).click();
  await page.getByRole('button', { name: /Send Ciphertext/ }).click();
  await page.getByRole('button', { name: /Decapsulate/ }).click();
  await expect(
    page.getByText('✓ Alice and Bob derived the same shared secret.'),
  ).toBeVisible();
  await page.getByRole('link', { name: /Use this secret/ }).click();
  await page.getByRole('button', { name: /Encrypt with/ }).click();
  await page.getByRole('button', { name: /Decrypt with/ }).click();
  await expect(page.getByText('✓ Decrypted result')).toBeVisible();
  await page.getByRole('button', { name: 'Tamper with ciphertext' }).click();
  await page.getByRole('button', { name: /Decrypt with/ }).click();
  await expect(page.getByText(/Authentication failed:/)).toBeVisible();
  for (const family of ['ML-DSA', 'SLH-DSA']) {
    await page.goto(`./#${family.toLowerCase()}`);
    await page.getByRole('button', { name: `Generate ${family} Keys` }).click();
    await page.getByRole('button', { name: 'Sign Message' }).click();
    await page.getByRole('button', { name: 'Verify Signature' }).click();
    await expect(page.getByText(/✓ VALID SIGNATURE/)).toBeVisible();
    await page.getByRole('button', { name: 'Tamper With Message' }).click();
    await page.getByRole('button', { name: 'Verify Signature' }).click();
    await expect(page.getByText(/✗ SIGNATURE INVALID/)).toBeVisible();
  }
  await page.goto('./#comparison');
  await page
    .getByRole('button', { name: 'Benchmark selected algorithm' })
    .click();
  await expect(page.getByText('Key generation', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Security has a size',
  );
  await page.goto('./#lattice');
  await expect(page.getByRole('img')).toBeVisible();
  await page.goto('./#glossary/shared-secret');
  await expect(page.locator('#shared-secret')).toBeInViewport();
  expect(errors).toEqual([]);
  expect(requests).toEqual([]);
});
