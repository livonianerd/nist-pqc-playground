import { kems, signers } from './algorithms';
import type { Request, Result } from '../types/crypto';
const required = (bytes?: Uint8Array) => {
  if (!bytes) throw new Error('Complete the previous step first.');
  return bytes;
};
export function execute(req: Request): Result {
  const start = performance.now();
  const kem = kems[req.algorithm];
  const signer = signers[req.algorithm];
  const algorithm = kem ?? signer;
  if (!algorithm)
    throw new Error(
      'This algorithm is unavailable. Select a supported parameter set.',
    );
  const message = new TextEncoder().encode(req.message ?? 'Benchmark message');
  let result: Omit<Result, 'ms'> = {};
  switch (req.op) {
    case 'keygen':
      result = algorithm.keygen();
      break;
    case 'encapsulate': {
      if (!kem) throw new Error('Choose ML-KEM.');
      const r = kem.encapsulate(required(req.publicKey));
      result = { ciphertext: r.cipherText, sharedSecret: r.sharedSecret };
      break;
    }
    case 'decapsulate':
      if (!kem) throw new Error('Choose ML-KEM.');
      result = {
        sharedSecret: kem.decapsulate(
          required(req.ciphertext),
          required(req.secretKey),
        ),
      };
      break;
    case 'sign':
      if (!signer) throw new Error('Choose a signature algorithm.');
      result = { signature: signer.sign(message, required(req.secretKey)) };
      break;
    case 'verify':
      if (!signer) throw new Error('Choose a signature algorithm.');
      result = {
        valid: signer.verify(
          required(req.signature),
          message,
          required(req.publicKey),
        ),
      };
      break;
    case 'benchmark': {
      const samples: Record<string, number[]> = {};
      const measure = <T>(name: string, fn: () => T): T => {
        const t = performance.now();
        const value = fn();
        (samples[name] ??= []).push(performance.now() - t);
        return value;
      };
      for (let i = 0; i < 3; i++) {
        const keys = measure('Key generation', () => algorithm.keygen());
        if (kem) {
          const encapsulated = measure('Encapsulation', () =>
            kem.encapsulate(keys.publicKey),
          );
          measure('Decapsulation', () =>
            kem.decapsulate(encapsulated.cipherText, keys.secretKey),
          );
        } else {
          const sig = measure('Signing', () =>
            signer.sign(message, keys.secretKey),
          );
          measure('Verification', () =>
            signer.verify(sig, message, keys.publicKey),
          );
        }
      }
      result = {
        timings: Object.fromEntries(
          Object.entries(samples).map(([key, values]) => [
            key,
            values.sort((a, b) => a - b)[1],
          ]),
        ),
      };
      break;
    }
  }
  return { ...result, ms: performance.now() - start };
}
