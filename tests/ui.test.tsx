// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { KemLab } from '../src/pages/KemLab';
import { SignatureLab } from '../src/pages/SignatureLab';
import { SecureMessage } from '../src/pages/SecureMessage';
import { Threat, Myths } from '../src/pages/Education';
import { Migration } from '../src/pages/Migration';
vi.mock('../src/hooks/useCrypto', () => ({
  useCrypto: () => ({
    busy: false,
    error: '',
    cancel: vi.fn(),
    run: vi.fn(async (req: { op: string }) =>
      req.op === 'keygen'
        ? {
            publicKey: new Uint8Array([1]),
            secretKey: new Uint8Array([2]),
            ms: 1,
          }
        : { signature: new Uint8Array([3]), ms: 1 },
    ),
  }),
}));
afterEach(cleanup);
it('gates KEM steps and clears keys on parameter switching', async () => {
  const user = userEvent.setup();
  render(<KemLab onShared={vi.fn()} />);
  expect(
    screen.getByRole('button', { name: /Encapsulate Secret/ }),
  ).toBeDisabled();
  await user.click(screen.getByRole('button', { name: /Generate Bob/ }));
  expect(
    screen.getByRole('button', { name: /Encapsulate Secret/ }),
  ).toBeEnabled();
  await user.selectOptions(
    screen.getByLabelText('Parameter set'),
    'ML-KEM-512',
  );
  expect(
    screen.getByRole('button', { name: /Encapsulate Secret/ }),
  ).toBeDisabled();
});
it('signature parameter switching invalidates signatures', async () => {
  const user = userEvent.setup();
  render(<SignatureLab family="ML-DSA" />);
  await user.click(screen.getByRole('button', { name: /Generate ML-DSA/ }));
  await user.click(screen.getByRole('button', { name: 'Sign Message' }));
  expect(
    screen.getByRole('button', { name: 'Verify Signature' }),
  ).toBeEnabled();
  await user.selectOptions(screen.getByLabelText('Parameter set'), 'ML-DSA-87');
  expect(
    screen.getByRole('button', { name: 'Verify Signature' }),
  ).toBeDisabled();
});
it('does not encrypt before key establishment', () => {
  render(<SecureMessage shared={null} />);
  expect(screen.getByRole('button', { name: /Encrypt with/ })).toBeDisabled();
});
it('timeline updates the selected confidentiality window', async () => {
  render(<Threat />);
  await userEvent.selectOptions(screen.getByRole('combobox'), '50');
  expect(
    screen.getByText('50 years', { selector: 'strong' }),
  ).toBeInTheDocument();
});
it('simulation increments planning progress without scanning a network', async () => {
  render(<Migration />);
  await userEvent.click(
    screen.getByRole('button', { name: 'Scan Cryptography' }),
  );
  await userEvent.click(screen.getAllByRole('checkbox')[0]);
  expect(
    screen.getByRole('heading', { name: 'PQC Migration Readiness: 13%' }),
  ).toBeInTheDocument();
});
it('myths have keyboard accessible native disclosure controls', () => {
  const { container } = render(<Myths />);
  expect(container.querySelectorAll('details summary')).toHaveLength(5);
});
