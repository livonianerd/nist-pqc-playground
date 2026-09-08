import { useState } from 'react';
import { Heading, Callout, Parameter, Value, Status } from '../components/UI';
import { useCrypto } from '../hooks/useCrypto';
import type { Result } from '../types/crypto';
import { matches } from '../utils/format';
export type Shared = { alice: Uint8Array; bob: Uint8Array };
export function KemLab({
  onShared,
}: {
  onShared: (shared: Shared | null) => void;
}) {
  const [parameter, setParameter] = useState('ML-KEM-768');
  const [keys, setKeys] = useState<Result | null>(null);
  const [enc, setEnc] = useState<Result | null>(null);
  const [bob, setBob] = useState<Uint8Array>();
  const [sent, setSent] = useState(false);
  const crypto = useCrypto();
  const reset = () => {
    setKeys(null);
    setEnc(null);
    setBob(undefined);
    setSent(false);
    onShared(null);
  };
  return (
    <>
      <Heading
        eyebrow="01 / KEY ESTABLISHMENT · FIPS 203"
        title="One shared secret. Two participants."
      >
        <p>
          ML-KEM is a{' '}
          <a href="#glossary/key-encapsulation-mechanism">
            Key Encapsulation Mechanism
          </a>
          . ML-KEM is not normally used to encrypt a large message directly. It
          establishes a shared secret that can then be used with symmetric
          encryption.
        </p>
      </Heading>
      <div className="toolbar">
        <Parameter
          family="ML-KEM"
          value={parameter}
          disabled={crypto.busy}
          onChange={(value) => {
            setParameter(value);
            reset();
          }}
        />
        <button disabled={crypto.busy} onClick={reset}>
          Reset Demo
        </button>
      </div>
      <Callout>
        Secrets are visible here for learning only. Real applications must
        protect private keys and shared secrets. Bob’s public key must also be
        authenticated: ML-KEM alone does not prove who Bob is.
      </Callout>
      <div className="participants">
        <article className="card alice">
          <span className="avatar">A</span>
          <h2>
            Alice <small>Sender</small>
          </h2>
          <p>
            Use Bob’s public key to create fresh shared key material. Keep the
            secret; send only the encapsulation ciphertext.
          </p>
          <button
            disabled={!keys || crypto.busy || !!enc}
            onClick={async () => {
              const r = await crypto.run({
                op: 'encapsulate',
                algorithm: parameter,
                publicKey: keys?.publicKey,
              });
              if (r) setEnc(r);
            }}
          >
            2. Encapsulate Secret
          </button>
          <Value
            label="Alice’s shared secret"
            value={enc?.sharedSecret}
            secret
          />
          <Value label="Encapsulation ciphertext" value={enc?.ciphertext} />
          <button
            disabled={!enc || sent || crypto.busy}
            onClick={() => setSent(true)}
          >
            3. Send Ciphertext → Bob
          </button>
        </article>
        <article className="card bob">
          <span className="avatar">B</span>
          <h2>
            Bob <small>Recipient</small>
          </h2>
          <p>
            Create a key pair. Share the public key with Alice, while keeping
            the private key on Bob’s side.
          </p>
          <button
            disabled={crypto.busy || !!keys}
            onClick={async () => {
              const r = await crypto.run({
                op: 'keygen',
                algorithm: parameter,
              });
              if (r) setKeys(r);
            }}
          >
            1. Generate Bob&apos;s Keys
          </button>
          <Value
            label="Public key · shared with Alice"
            value={keys?.publicKey}
          />
          <Value
            label="Private key · keep secret"
            value={keys?.secretKey}
            secret
          />
          <button
            disabled={!sent || crypto.busy || !!bob}
            onClick={async () => {
              const r = await crypto.run({
                op: 'decapsulate',
                algorithm: parameter,
                ciphertext: enc?.ciphertext,
                secretKey: keys?.secretKey,
              });
              if (r?.sharedSecret) {
                setBob(r.sharedSecret);
                if (enc?.sharedSecret)
                  onShared({ alice: enc.sharedSecret, bob: r.sharedSecret });
              }
            }}
          >
            4. Decapsulate
          </button>
          <Value label="Bob’s shared secret" value={bob} secret />
        </article>
      </div>
      <Status {...crypto} />
      <p className="step-note" aria-live="polite">
        {bob
          ? matches(enc?.sharedSecret, bob)
            ? '✓ Alice and Bob derived the same shared secret.'
            : '✗ Shared secrets do not match.'
          : sent
            ? 'The ciphertext has reached Bob. Only his private key can recover the matching secret.'
            : enc
              ? 'Alice has a secret and a ciphertext. The secret itself is never transmitted.'
              : keys
                ? 'Bob’s public key is now available to Alice. A public key is safe to share, but its identity still needs verification.'
                : 'Start with Bob: generate a fresh key pair.'}
      </p>
      {bob && (
        <a className="button primary" href="#secure-message">
          Use this secret to protect a message →
        </a>
      )}
      <h2>What if the ciphertext changes?</h2>
      <p>
        ML-KEM uses implicit rejection: a correctly sized but invalid ciphertext
        generally yields a different secret, rather than an error that reveals
        whether the ciphertext was valid. Malformed lengths are rejected. A
        subsequent authenticated-encryption check detects that the parties do
        not have matching keys.
      </p>
    </>
  );
}
