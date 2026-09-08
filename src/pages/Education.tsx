import { useState } from 'react';
import { Heading, Callout } from '../components/UI';
import { glossary, myths, uses, references, slug } from '../data/content';
export function Introduction() {
  return (
    <>
      <Heading
        eyebrow="A HANDS-ON FIELD GUIDE / 5–15 MINUTES"
        title="The future of security. Running in your browser."
      >
        <p>
          Post-quantum cryptography isn&apos;t about encrypting data with a
          quantum computer. It is about protecting today&apos;s computers and
          communications against attackers who may have powerful quantum
          computers in the future.
        </p>
      </Heading>
      <div
        className="hero-art"
        role="img"
        aria-label="A lattice of connected points representing ordinary computing and new mathematical foundations"
      >
        <div className="orb">
          PQC<span>NEW MATH. SAME COMPUTERS.</span>
        </div>
        <span className="art-label">QUANTUM-RESISTANT BY DESIGN</span>
      </div>
      <a className="button primary" href="#ml-kem">
        Start the Playground ↗
      </a>
      <p className="muted">
        Real algorithms · No account · Nothing leaves your browser
      </p>
      <div className="flow">
        Today&apos;s public-key cryptography → Future quantum threat →
        Post-quantum migration → ML-KEM / ML-DSA / SLH-DSA
      </div>
      <h2>Why change the mathematics?</h2>
      <p>
        Public-key cryptography lets people establish secrets or verify
        signatures without first sharing a secret key. RSA and elliptic-curve
        cryptography underpin much of today’s secure communication,
        certificates, and software authentication. Their security rests on
        mathematical problems that are hard for known classical attacks.
      </p>
      <p>
        A sufficiently powerful quantum computer could solve some of those
        problems efficiently. Post-quantum algorithms use different problems
        that are believed to resist known classical and quantum attacks. They
        run on ordinary processors, including the one displaying this page.
      </p>
      <div className="card-grid">
        <a className="card link-card" href="#ml-kem">
          <span className="eyebrow">01 / ESTABLISH</span>
          <h2>ML-KEM ↗</h2>
          <p>Two participants arrive at a shared secret.</p>
        </a>
        <a className="card link-card" href="#ml-dsa">
          <span className="eyebrow">02 / AUTHENTICATE</span>
          <h2>ML-DSA ↗</h2>
          <p>Sign a message, then see what happens when it changes.</p>
        </a>
        <a className="card link-card" href="#slh-dsa">
          <span className="eyebrow">03 / DIVERSIFY</span>
          <h2>SLH-DSA ↗</h2>
          <p>Explore signatures built from hash functions.</p>
        </a>
      </div>
      <Callout>
        Not all cryptography is affected equally. AES encrypts bulk data;
        SHA-256 hashes it. Quantum search affects these differently from the
        attacks on RSA and elliptic curves. PQC does not mean replacing every
        cryptographic primitive.
      </Callout>
    </>
  );
}
export function Threat() {
  const [years, setYears] = useState(10);
  return (
    <>
      <Heading
        eyebrow="THE MOTIVATION"
        title="Protect the lifetime of your data."
      >
        <p>
          The threat concerns a sufficiently capable, fault-tolerant quantum
          computer—not simply a machine with a large advertised qubit count.
          There is no reliable date to put on its arrival.
        </p>
      </Heading>
      <h2>Shor’s algorithm, without the equations</h2>
      <p>
        Shor’s algorithm uses quantum computation to uncover mathematical
        periodicity. This makes integer factorization and discrete logarithms
        efficiently solvable in principle. RSA relies on the difficulty of
        factoring; common elliptic-curve systems rely on discrete logarithms. At
        sufficient scale, with error correction, this threatens both key
        establishment and signatures.
      </p>
      <p>
        This does not mean all encryption becomes useless. Symmetric encryption
        and hashing involve different problems. Grover’s algorithm gives a
        generic quadratic search speedup in an idealized model, with substantial
        practical resource requirements. AES-256 retains a large security
        margin; algorithm choice still belongs within current guidance and
        protocol review.
      </p>
      <h2>Harvest Now, Decrypt Later</h2>
      <p>
        An attacker can potentially collect encrypted information today, store
        it for years, and attempt to decrypt it later if sufficiently capable
        quantum computers become available. This matters when the captured
        key-establishment exchange can later be broken. Classical forward
        secrecy does not by itself protect recorded vulnerable key exchanges
        against such quantum attacks.
      </p>
      <article className="card">
        <label>
          How long must your information remain confidential?
          <select
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          >
            {[1, 5, 10, 25, 50].map((y) => (
              <option key={y} value={y}>
                {y} {y === 1 ? 'year' : 'years'}
              </option>
            ))}
          </select>
        </label>
        <ol className="timeline">
          <li>
            Today<span>Encrypted data captured</span>
          </li>
          <li>
            Storage<span>Traffic retained for years</span>
          </li>
          <li>
            Unknown future<span>Capable quantum computer</span>
          </li>
          <li>
            Exposure<span>Old data may become vulnerable</span>
          </li>
        </ol>
        <p aria-live="polite">
          Your confidentiality window is{' '}
          <strong>
            {years} {years === 1 ? 'year' : 'years'}
          </strong>
          .{' '}
          {years >= 10
            ? 'Long-lived sensitive information makes planning urgent: data captured today may still matter decades later.'
            : 'A shorter lifetime narrows the exposure window, but system migration and authentication still require planning.'}{' '}
          This is an exposure scenario, not a prediction of quantum-computer
          availability.
        </p>
      </article>
      <Callout>
        Think in three timescales: how long data must stay secret, how long
        migration takes, and when a capable attacker could arrive. The last is
        uncertain; the first two can already be investigated.
      </Callout>
    </>
  );
}
export function Classical() {
  return (
    <>
      <Heading
        eyebrow="ROLES, NOT ONE-TO-ONE REPLACEMENTS"
        title="Put each primitive in its place."
      >
        <p>
          Key establishment, bulk encryption, signatures, and hashing solve
          different problems. A secure protocol combines these roles.
        </p>
      </Heading>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Common classical examples</th>
              <th>Post-quantum direction</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Key establishment</th>
              <td>ECDH / X25519; legacy RSA key transport</td>
              <td>ML-KEM in an authenticated protocol</td>
            </tr>
            <tr>
              <th>Digital signatures</th>
              <td>RSA signatures / ECDSA</td>
              <td>ML-DSA / SLH-DSA</td>
            </tr>
            <tr>
              <th>Bulk encryption</th>
              <td>AES-GCM</td>
              <td>AES remains relevant; review key strength</td>
            </tr>
            <tr>
              <th>Hashing</th>
              <td>SHA-256</td>
              <td>
                Hashes remain relevant; assess required properties and strength
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>Two separate public-key jobs</h2>
      <p>
        A signature lets a verifier check a message using a public key. A KEM
        lets two parties obtain secret key material. ML-KEM does not verify
        software updates, and ML-DSA does not create an encrypted tunnel by
        itself. RSA can serve different roles depending on the scheme; those
        uses must be inventoried separately.
      </p>
      <div className="flow">
        Authenticated key establishment (ML-KEM + identity mechanism) → Bulk
        protection (AES-GCM)
        <br />
        Signed software (ML-DSA or SLH-DSA) → Verify before use
        <br />
        Hashing (SHA-256) → Digests, derivation, and protocol components
      </div>
      <Callout>
        Post-quantum cryptography uses new algorithms on conventional hardware.
        Quantum key distribution uses physical quantum systems and specialized
        equipment. They are distinct approaches, and QKD still requires
        authentication.
      </Callout>
    </>
  );
}
export function Uses() {
  return (
    <>
      <Heading
        eyebrow="BEYOND THE LAB"
        title="Cryptography lives inside systems."
      >
        <p>
          Migration is a coordination problem as well as an algorithm choice.
          Formats, trust, hardware limits, and the lifetime of deployed devices
          all matter.
        </p>
      </Heading>
      <div className="card-grid two">
        {uses.map(([title, text]) => (
          <article className="card" key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </>
  );
}
export function Myths() {
  return (
    <>
      <Heading
        eyebrow="CHECK YOUR INTUITION"
        title="Five myths. Better mental models."
      >
        <p>Open each claim to reveal the explanation.</p>
      </Heading>
      {myths.map(([claim, answer], i) => (
        <details className="card myth" key={claim}>
          <summary>
            <span className="eyebrow">MYTH 0{i + 1}</span>
            <h2>{claim}</h2>
            <span>Reveal explanation +</span>
          </summary>
          <p>{answer}</p>
        </details>
      ))}
    </>
  );
}
export function Glossary() {
  return (
    <>
      <Heading
        eyebrow="A SHARED VOCABULARY"
        title="A little terminology goes a long way."
      />
      <dl className="glossary">
        {Object.entries(glossary).map(([term, definition]) => (
          <div id={slug(term)} key={term}>
            <dt>
              <a href={`#glossary/${slug(term)}`}>{term}</a>
            </dt>
            <dd>{definition}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
export function About() {
  return (
    <>
      <Heading
        eyebrow="OPEN SOURCE / MIT LICENSE"
        title="Learn here. Engineer with care."
      >
        <p>
          An independent educational playground for the NIST standards. This
          project is not affiliated with or endorsed by NIST.
        </p>
      </Heading>
      <h2>About this implementation</h2>
      <p>
        All PQC operations use the third-party JavaScript library
        @noble/post-quantum 0.7.1. We use finalized ML-KEM, ML-DSA, and SLH-DSA
        exports, not the older Kyber, Dilithium, or SPHINCS+ submission formats.
        AES-GCM and HKDF use the browser’s Web Crypto API. No WebAssembly
        initialization or external service is required.
      </p>
      <Callout>
        This is an educational demonstration, not a substitute for security
        engineering review. Follow current NIST guidance for production systems.
        Exposing keys, comparing secrets on screen, and moving both
        participants’ secrets into one browser are teaching devices. Browser
        timing results are not universal performance measurements.
      </Callout>
      <h2>Privacy by architecture</h2>
      <p>
        No login, tracking, cookies, analytics, storage, or backend. Keys exist
        in browser memory and may reset on navigation or reload. Workers are
        local execution contexts, not servers. JavaScript cannot guarantee
        secure memory erasure. Reference links only leave this site when you
        choose to open them.
      </p>
      <h2>Standards & primary references</h2>
      <div className="references">
        {references.map(([title, url, text]) => (
          <a href={url} key={url} target="_blank" rel="noreferrer">
            <h3>{title} ↗</h3>
            <p>{text}</p>
          </a>
        ))}
      </div>
    </>
  );
}
