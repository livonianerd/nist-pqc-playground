import { useState } from 'react';
import { Heading, Callout } from '../components/UI';
const inventory = [
  [
    'Web Servers',
    'X25519',
    'Quantum-vulnerable public-key algorithm',
    'Pilot authenticated PQC key establishment with compatible clients.',
  ],
  [
    'VPN',
    'RSA-2048',
    'Quantum-vulnerable public-key algorithm',
    'Test PQC-capable authentication and key establishment on both peers.',
  ],
  [
    'SSH',
    'ECDSA P-256',
    'Quantum-vulnerable public-key algorithm',
    'Review host and user signatures, key exchange, and client compatibility.',
  ],
  [
    'Code Signing',
    'RSA-2048',
    'Quantum-vulnerable public-key algorithm',
    'Pilot ML-DSA or SLH-DSA with compatible verifiers and protected signing keys.',
  ],
  [
    'Embedded Devices',
    'Unknown firmware crypto',
    'Needs inventory review',
    'Inventory immutable trust anchors, memory, update paths, and vendor support.',
  ],
  [
    'Internal PKI',
    'ECDSA P-256',
    'Quantum-vulnerable public-key algorithm',
    'Test certificate chains, issuance, relying parties, and new signature formats.',
  ],
  [
    'Database Encryption',
    'AES-256',
    'Symmetric algorithm',
    'Retain strong symmetric encryption; review key wrapping and key management.',
  ],
  [
    'Software Update System',
    'SHA-256',
    'Hash algorithm',
    'Retain appropriate hashing; discover and review the separate signing mechanism.',
  ],
];
export function Migration() {
  const [scanned, setScanned] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  return (
    <>
      <Heading
        eyebrow="CRYPTO-AGILITY / FICTIONAL ORGANIZATION"
        title="Migration starts with knowing what you have."
      >
        <p>
          Find cryptographic dependencies, prioritize their risks, test
          replacements, and plan rollout and recovery. Switching a primitive is
          only one part of the work.
        </p>
      </Heading>
      <Callout>
        Simulated enterprise inventory. This does not scan your browser,
        network, or organization. The readiness percentage counts completed
        educational planning tasks, not deployed migrations or a real security
        rating.
      </Callout>
      <div className="toolbar">
        <button onClick={() => setScanned(true)} disabled={scanned}>
          Scan Cryptography
        </button>
        <button
          onClick={() => {
            setDone([]);
            setScanned(false);
          }}
        >
          Reset simulation
        </button>
      </div>
      <h2>PQC Migration Readiness: {Math.round((done.length / 8) * 100)}%</h2>
      <progress
        max={8}
        value={done.length}
        aria-label="Simulated migration task progress"
      />
      <p>
        {done.length} of 8 planning tasks reviewed. No actual system has been
        migrated.
      </p>
      {scanned && (
        <div className="card-grid two">
          {inventory.map(([name, algorithm, status, task]) => (
            <article className="card" key={name}>
              <span className="eyebrow">
                {done.includes(name) && status.startsWith('Quantum')
                  ? 'PQC candidate'
                  : status}
              </span>
              <h2>{name}</h2>
              <code>{algorithm}</code>
              <p>{task}</p>
              <label className="check">
                <input
                  type="checkbox"
                  checked={done.includes(name)}
                  onChange={(e) =>
                    setDone(
                      e.target.checked
                        ? [...done, name]
                        : done.filter((n) => n !== name),
                    )
                  }
                />
                Mark planning task reviewed
              </label>
            </article>
          ))}
        </div>
      )}
      <h2>Agility is a capability, not a checkbox</h2>
      <p>
        A useful inventory records algorithms, protocols, certificates,
        libraries, owners, data lifetimes, and upgrade constraints. Prioritize
        long-lived secrets and difficult-to-update systems. Validate
        interoperability, performance, rollback, and certificate tooling before
        rollout. Keep discovery repeatable as software and suppliers change.
      </p>
    </>
  );
}
