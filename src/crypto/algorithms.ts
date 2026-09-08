import {
  ml_kem512,
  ml_kem768,
  ml_kem1024,
} from '@noble/post-quantum/ml-kem.js';
import { ml_dsa44, ml_dsa65, ml_dsa87 } from '@noble/post-quantum/ml-dsa.js';
import * as slh from '@noble/post-quantum/slh-dsa.js';
import type { KEM, Signer } from '@noble/post-quantum/utils.js';
export const kems: Record<string, KEM> = {
  'ML-KEM-512': ml_kem512,
  'ML-KEM-768': ml_kem768,
  'ML-KEM-1024': ml_kem1024,
};
export const signers: Record<string, Signer> = {
  'ML-DSA-44': ml_dsa44,
  'ML-DSA-65': ml_dsa65,
  'ML-DSA-87': ml_dsa87,
  ...Object.fromEntries(
    Object.entries(slh)
      .filter(([name]) => /^slh_dsa_(sha2|shake)_\d+[fs]$/.test(name))
      .map(([name, value]) => [
        name.replaceAll('_', '-').toUpperCase(),
        value as Signer,
      ]),
  ),
};
export const parameters = [
  ...Object.entries(kems),
  ...Object.entries(signers),
].map(([name, algorithm]) => ({ name, ...algorithm.lengths }));
