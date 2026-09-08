const bytes = (value: Uint8Array) => new Uint8Array(value);
const context = new TextEncoder().encode(
  'nist-pqc-playground / ML-KEM + AES-256-GCM / v1',
);
export function requireWebCrypto() {
  if (!globalThis.crypto?.subtle)
    throw new Error(
      'Web Crypto is unavailable. Use a current browser over HTTPS or localhost.',
    );
}
async function derive(secret: Uint8Array, salt: Uint8Array) {
  requireWebCrypto();
  const material = await crypto.subtle.importKey(
    'raw',
    bytes(secret),
    'HKDF',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: bytes(salt), info: context },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}
export async function encrypt(message: string, secret: Uint8Array) {
  requireWebCrypto();
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await derive(secret, salt);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv, additionalData: context, tagLength: 128 },
      key,
      new TextEncoder().encode(message),
    ),
  );
  return { salt, iv, ciphertext };
}
export type Envelope = Awaited<ReturnType<typeof encrypt>>;
export async function decrypt(envelope: Envelope, secret: Uint8Array) {
  const key = await derive(secret, envelope.salt);
  try {
    return new TextDecoder().decode(
      await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: bytes(envelope.iv),
          additionalData: context,
          tagLength: 128,
        },
        key,
        bytes(envelope.ciphertext),
      ),
    );
  } catch {
    throw new Error(
      'Authentication failed: the ciphertext, nonce, salt, or shared secret does not match. No plaintext was released.',
    );
  }
}
