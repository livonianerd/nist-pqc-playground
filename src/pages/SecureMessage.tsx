import { useState } from 'react';
import { Heading, Callout, Value } from '../components/UI';
import { encrypt, decrypt, type Envelope } from '../crypto/aes';
import type { Shared } from './KemLab';
export function SecureMessage({ shared }: { shared: Shared | null }) {
  const [message, setMessage] = useState('Meet me at 10:00 tomorrow.');
  const [envelope, setEnvelope] = useState<Envelope>();
  const [plain, setPlain] = useState<string>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const available = !!globalThis.crypto?.subtle;
  return (
    <>
      <Heading
        eyebrow="02 / HYBRID ENCRYPTION"
        title="A secret becomes a secure message."
      >
        <p>
          Public-key cryptography is useful for establishing keys. Symmetric
          encryption is efficient for encrypting large amounts of data. Real
          systems commonly combine the two.
        </p>
      </Heading>
      <div className="flow">
        Plaintext → ML-KEM shared secret → HKDF-SHA-256 → AES-256-GCM →
        Ciphertext → Original plaintext
      </div>
      <Callout>
        HKDF derives a non-exportable AES-256 key from each participant’s
        secret, a fresh public 32-byte salt, and a fixed application context.
        Every encryption gets a fresh 96-bit nonce. AES-GCM authenticates the
        ciphertext and context with a 128-bit tag. This example is not a
        complete authenticated messaging protocol.
      </Callout>
      {!shared && (
        <p className="failure">
          Establish a shared secret in the <a href="#ml-kem">ML-KEM Lab</a>{' '}
          before encrypting.
        </p>
      )}
      {!available && (
        <p role="alert">
          Web Crypto is unavailable. Open this site over HTTPS or localhost in a
          current browser.
        </p>
      )}
      <article className="card">
        <label>
          Plaintext
          <textarea
            value={message}
            maxLength={100000}
            onChange={(e) => {
              setMessage(e.target.value);
              setEnvelope(undefined);
              setPlain(undefined);
            }}
          />
        </label>
        <div className="actions">
          <button
            disabled={!shared || !available || busy}
            onClick={async () => {
              if (!shared) return;
              setBusy(true);
              setError('');
              setPlain(undefined);
              try {
                setEnvelope(await encrypt(message, shared.alice));
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Encryption failed.');
              } finally {
                setBusy(false);
              }
            }}
          >
            Encrypt with Alice’s key
          </button>
          <button
            disabled={!shared || !envelope || busy || !available}
            onClick={async () => {
              if (!shared || !envelope) return;
              setBusy(true);
              setError('');
              setPlain(undefined);
              try {
                setPlain(await decrypt(envelope, shared.bob));
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Decryption failed.');
              } finally {
                setBusy(false);
              }
            }}
          >
            Decrypt with Bob’s key
          </button>
          <button
            disabled={!envelope || busy}
            onClick={() => {
              if (envelope) {
                const ciphertext = envelope.ciphertext.slice();
                ciphertext[0] ^= 1;
                setEnvelope({ ...envelope, ciphertext });
                setPlain(undefined);
                setError(
                  'Ciphertext modified. Try decrypting to see authentication reject it.',
                );
              }
            }}
          >
            Tamper with ciphertext
          </button>
        </div>
        <Value label="HKDF salt · public" value={envelope?.salt} />
        <Value label="Nonce / IV · public" value={envelope?.iv} />
        <Value
          label="Ciphertext · excludes tag below"
          value={envelope?.ciphertext.slice(0, -16)}
        />
        <Value
          label="Authentication tag · last 16 bytes"
          value={envelope?.ciphertext.slice(-16)}
        />
        <div aria-live="polite">
          {busy && <p>Computing locally…</p>}
          {error && <p className="failure">{error}</p>}
          {plain !== undefined && (
            <div className="success">
              <strong>✓ Decrypted result</strong>
              <p className="plaintext">{plain || '(empty message)'}</p>
            </div>
          )}
        </div>
      </article>
      <h2>Encryption is not identity</h2>
      <p>
        GCM proves integrity relative to the derived key. Without an
        authenticated public key exchange, an attacker could substitute a public
        key. Production protocols also need identities, replay protection,
        transcript binding, and key lifecycle management.
      </p>
    </>
  );
}
