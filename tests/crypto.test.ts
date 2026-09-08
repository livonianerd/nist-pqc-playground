import { describe, it, expect } from 'vitest';
import { kems, signers, parameters } from '../src/crypto/algorithms';
import { execute } from '../src/crypto/operations';
import { encrypt, decrypt } from '../src/crypto/aes';
import { matches } from '../src/utils/format';
for (const [name, kem] of Object.entries(kems))
  describe(name, () => {
    it('establishes matching secrets with exact advertised sizes', () => {
      const keys = kem.keygen();
      const enc = kem.encapsulate(keys.publicKey);
      expect(
        matches(
          enc.sharedSecret,
          kem.decapsulate(enc.cipherText, keys.secretKey),
        ),
      ).toBe(true);
      expect(keys.publicKey.length).toBe(kem.lengths.publicKey);
      expect(enc.cipherText.length).toBe(kem.lengths.cipherText);
    });
    it('implicitly rejects altered ciphertext and wrong keys; rejects malformed lengths', () => {
      const keys = kem.keygen();
      const enc = kem.encapsulate(keys.publicKey);
      const altered = enc.cipherText.slice();
      altered[0] ^= 1;
      expect(
        matches(enc.sharedSecret, kem.decapsulate(altered, keys.secretKey)),
      ).toBe(false);
      expect(
        matches(
          enc.sharedSecret,
          kem.decapsulate(enc.cipherText, kem.keygen().secretKey),
        ),
      ).toBe(false);
      expect(() =>
        kem.decapsulate(enc.cipherText.slice(1), keys.secretKey),
      ).toThrow();
    });
  });
for (const [name, signer] of Object.entries(signers))
  it(`${name}: original verifies, modified message and signature fail`, () => {
    const keys = signer.keygen();
    const message = new TextEncoder().encode('Transfer $100 to Alice.');
    const signature = signer.sign(message, keys.secretKey);
    expect(signer.verify(signature, message, keys.publicKey)).toBe(true);
    expect(
      signer.verify(
        signature,
        new TextEncoder().encode('Transfer $10,000 to Alice.'),
        keys.publicKey,
      ),
    ).toBe(false);
    const changed = signature.slice();
    changed[0] ^= 1;
    expect(signer.verify(changed, message, keys.publicKey)).toBe(false);
    expect(signature.length).toBe(signer.lengths.signature);
  });
it('AES-GCM round trip, nonce freshness, and authenticated rejection', async () => {
  const secret = crypto.getRandomValues(new Uint8Array(32));
  const envelope = await encrypt('Hello 🌍', secret);
  expect(await decrypt(envelope, secret)).toBe('Hello 🌍');
  expect((await encrypt('Hello 🌍', secret)).iv).not.toEqual(envelope.iv);
  const changed = envelope.ciphertext.slice();
  changed[0] ^= 1;
  await expect(
    decrypt({ ...envelope, ciphertext: changed }, secret),
  ).rejects.toThrow('Authentication failed');
  await expect(
    decrypt(envelope, crypto.getRandomValues(new Uint8Array(32))),
  ).rejects.toThrow('Authentication failed');
});
it('rejects missing state and unknown algorithms', () => {
  expect(() => execute({ op: 'sign', algorithm: 'ML-DSA-44' })).toThrow(
    'previous step',
  );
  expect(() => execute({ op: 'keygen', algorithm: 'fake' })).toThrow(
    'unavailable',
  );
  expect(parameters).toHaveLength(18);
});
it('reports actual benchmark stages', () => {
  const result = execute({ op: 'benchmark', algorithm: 'ML-KEM-512' });
  expect(Object.keys(result.timings!)).toEqual([
    'Key generation',
    'Encapsulation',
    'Decapsulation',
  ]);
  expect(Object.values(result.timings!).every((t) => t >= 0)).toBe(true);
});
