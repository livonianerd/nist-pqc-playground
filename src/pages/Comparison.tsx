import { useState } from 'react';
import { Heading, Callout, Status } from '../components/UI';
import { parameters } from '../crypto/algorithms';
import { size } from '../utils/format';
import { useCrypto } from '../hooks/useCrypto';
export function Comparison() {
  const [selected, setSelected] = useState('ML-KEM-768');
  const [results, setResults] = useState<
    Record<string, Record<string, number>>
  >({});
  const crypto = useCrypto();
  const p = parameters.find((p) => p.name === selected)!;
  return (
    <>
      <Heading
        eyebrow="PARAMETER EXPLORER & DEVICE BENCHMARK"
        title="Security has a size. And a cost."
      >
        <p>
          These algorithms are not all one-to-one replacements. ML-KEM performs
          key establishment, while ML-DSA and SLH-DSA perform digital
          signatures.
        </p>
      </Heading>
      <Callout>
        Higher security levels usually increase keys, signatures, ciphertext
        sizes, computation, or some combination of these. NIST categories are
        comparative attack-cost targets, not a simple measurement of “bits.”
        ML-KEM uses categories 1/3/5; ML-DSA uses 2/3/5; SLH-DSA 128/192/256
        variants use 1/3/5.
      </Callout>
      <article className="card">
        <label>
          Explore a parameter set
          <select
            disabled={crypto.busy}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {parameters.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
        </label>
        <div className="metrics">
          <div>
            <span>Public key</span>
            <strong>{size(p.publicKey)}</strong>
          </div>
          <div>
            <span>Private key</span>
            <strong>{size(p.secretKey)}</strong>
          </div>
          <div>
            <span>
              {selected.startsWith('ML-KEM') ? 'Ciphertext' : 'Signature'}
            </span>
            <strong>
              {size(
                'cipherText' in p
                  ? p.cipherText
                  : 'signature' in p
                    ? p.signature
                    : undefined,
              )}
            </strong>
          </div>
        </div>
        <p>
          Sizes come from this library’s actual byte-length constants.
          Private-key values describe its expanded serialized representation,
          not an optional compact seed. SLH-DSA “s” favors smaller signatures;
          “f” favors faster signing.
        </p>
        <button
          disabled={crypto.busy}
          onClick={async () => {
            const result = await crypto.run({
              op: 'benchmark',
              algorithm: selected,
            });
            if (result?.timings)
              setResults((previous) => ({
                ...previous,
                [selected]: result.timings!,
              }));
          }}
        >
          Benchmark selected algorithm
        </button>
        <Status {...crypto} />
        <p className="muted">
          Measurements from this device and browser. Results will vary. Median
          of 3 fresh operations per stage, on a fixed short message, excluding
          worker startup. No warm-up; not a controlled cross-platform benchmark.
          Slow SLH-DSA sets can take minutes; cancel at any time.
        </p>
        {results[selected] && (
          <dl className="timings">
            {Object.entries(results[selected]).map(([name, time]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{time.toFixed(2)} ms</dd>
              </div>
            ))}
          </dl>
        )}
      </article>
      <h2>All supported standardized parameters</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Public key</th>
              <th>Private key</th>
              <th>Ciphertext</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((row) => (
              <tr key={row.name}>
                <th>{row.name}</th>
                <td>{size(row.publicKey)}</td>
                <td>{size(row.secretKey)}</td>
                <td>
                  {size('cipherText' in row ? row.cipherText : undefined)}
                </td>
                <td>{size('signature' in row ? row.signature : undefined)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        A dash means the metric does not apply. Transport overhead, certificate
        chains, protocol handshakes, memory, and device constraints add costs
        beyond these raw values.
      </p>
    </>
  );
}
