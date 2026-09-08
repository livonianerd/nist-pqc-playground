import { useState } from 'react';
import { Heading, Callout, Parameter, Value, Status } from '../components/UI';
import { useCrypto } from '../hooks/useCrypto';
import type { Result } from '../types/crypto';
export function SignatureLab({ family }: { family: 'ML-DSA' | 'SLH-DSA' }) {
  const [parameter, setParameter] = useState(
    family === 'ML-DSA' ? 'ML-DSA-44' : 'SLH-DSA-SHA2-128F',
  );
  const [message, setMessage] = useState('Transfer $100 to Alice.');
  const [keys, setKeys] = useState<Result | null>(null);
  const [signature, setSignature] = useState<Uint8Array>();
  const [valid, setValid] = useState<boolean>();
  const [timing, setTiming] = useState('');
  const crypto = useCrypto();
  const reset = () => {
    setKeys(null);
    setSignature(undefined);
    setValid(undefined);
    setTiming('');
  };
  return (
    <>
      <Heading
        eyebrow={`${family === 'ML-DSA' ? '03 / FIPS 204' : '04 / FIPS 205'} · DIGITAL SIGNATURES`}
        title={
          family === 'ML-DSA'
            ? 'Same message. Verifiable integrity.'
            : 'Different mathematics. The same purpose.'
        }
      >
        <p>
          {family} is a post-quantum digital-signature algorithm. A private key
          signs a message; the corresponding public key checks it. Signatures
          protect integrity and support authentication. They do not hide the
          message.
        </p>
      </Heading>
      <Callout>
        {family === 'SLH-DSA'
          ? 'ML-DSA is lattice-based; SLH-DSA is hash-based. Different mathematical foundations provide algorithmic diversity, not a universal winner. The “s” variants have smaller signatures but slower signing; “f” favors faster signing. Some variants may take many seconds.'
          : 'A valid signature means the signature corresponds to this exact message and supplied public key. Trust in the signer’s identity also requires a trustworthy connection between that person and the key.'}{' '}
        Private keys are exposed only to make this demonstration understandable.
      </Callout>
      <div className="toolbar">
        <Parameter
          family={family}
          value={parameter}
          disabled={crypto.busy}
          onChange={(v) => {
            setParameter(v);
            reset();
          }}
        />
        <button disabled={crypto.busy} onClick={reset}>
          Reset Demo
        </button>
      </div>
      <article className="card">
        <button
          disabled={crypto.busy || !!keys}
          onClick={async () => {
            const r = await crypto.run({ op: 'keygen', algorithm: parameter });
            if (r) {
              setKeys(r);
              setTiming(`Key generation: ${r.ms.toFixed(2)} ms`);
            }
          }}
        >
          Generate {family} Keys
        </button>
        <Value label="Public key" value={keys?.publicKey} />
        <Value label="Private key" value={keys?.secretKey} secret />
        <label>
          Message to sign
          <textarea
            disabled={crypto.busy}
            value={message}
            maxLength={100000}
            onChange={(e) => {
              setMessage(e.target.value);
              setValid(undefined);
            }}
          />
        </label>
        <div className="actions">
          <button
            disabled={!keys || crypto.busy}
            onClick={async () => {
              const r = await crypto.run({
                op: 'sign',
                algorithm: parameter,
                secretKey: keys?.secretKey,
                message,
              });
              if (r) {
                setSignature(r.signature);
                setValid(undefined);
                setTiming(`Signing: ${r.ms.toFixed(2)} ms`);
              }
            }}
          >
            Sign Message
          </button>
          <button
            disabled={!signature || crypto.busy}
            onClick={async () => {
              const r = await crypto.run({
                op: 'verify',
                algorithm: parameter,
                publicKey: keys?.publicKey,
                signature,
                message,
              });
              if (r) {
                setValid(r.valid);
                setTiming(`Verification: ${r.ms.toFixed(2)} ms`);
              }
            }}
          >
            Verify Signature
          </button>
          <button
            disabled={!signature || crypto.busy}
            onClick={() => {
              setMessage(
                message === 'Transfer $100 to Alice.'
                  ? 'Transfer $10,000 to Alice.'
                  : message + ' [modified]',
              );
              setValid(undefined);
            }}
          >
            Tamper With Message
          </button>
        </div>
        <Value label="Signature" value={signature} />
        <Status {...crypto} />
        <div aria-live="polite">
          {valid !== undefined && (
            <p className={valid ? 'success' : 'failure'}>
              {valid ? '✓ VALID SIGNATURE' : '✗ SIGNATURE INVALID'} —{' '}
              {valid
                ? 'The supplied public key verifies this message.'
                : 'The message or signature no longer matches the public key. Even a small edit breaks verification.'}
            </p>
          )}
        </div>
        <p className="muted">
          {timing}{' '}
          {timing &&
            '· Measurements from this device and browser. Results will vary.'}
        </p>
      </article>
      <h2>Try the full story</h2>
      <p>
        Generate keys, sign the example transfer, and verify it. Then tamper
        with the amount and verify again without signing again. Editing a signed
        message does not update its signature. Signing the edited message
        creates a new valid signature, provided you possess the private key.
      </p>
    </>
  );
}
