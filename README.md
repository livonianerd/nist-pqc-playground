# NIST Post-Quantum Cryptography Playground

An independent, open-source field guide to quantum-resistant cryptography. Explore real ML-KEM key establishment, ML-DSA and SLH-DSA signatures, and AES-GCM encryption—entirely inside your browser. Built for 5–15 minutes of hands-on learning, with deeper parameter exploration available.

## Live Demo

Deployment URL: https://USERNAME.github.io/nist-pqc-playground/

Replace `USERNAME` with the GitHub owner's username. This is a deployment template, not a claim that this URL is already live. If you rename the repository, use its new name in the URL; deployment detects the repository name automatically.

## What It Demonstrates

- Why Shor's algorithm threatens RSA and elliptic-curve public-key cryptography, and why AES and hashing have different roles and quantum risk profiles.
- Harvest now, decrypt later, with adjustable confidentiality lifetimes and no forecast of quantum-computer arrival.
- Alice/Bob key encapsulation and decapsulation, with visible educational byte values.
- Shared-secret derivation into AES-256-GCM, including nonce, salt, ciphertext, authentication tag, and tampering rejection.
- Sign, verify, change a message, and verify again with both signature families.
- Actual parameter byte lengths and median-of-three device benchmarks in cancellable workers.
- A keyboard-controlled 2D lattice analogy; classical versus PQC roles; real-world use cases.
- A deterministic fictional migration inventory, interactive myths, linked glossary, and primary references.

## NIST Algorithms

| Standard          | Role                          | Supported parameters                             |
| ----------------- | ----------------------------- | ------------------------------------------------ |
| FIPS 203: ML-KEM  | Key establishment             | 512, 768, 1024                                   |
| FIPS 204: ML-DSA  | Digital signatures            | 44, 65, 87                                       |
| FIPS 205: SLH-DSA | Hash-based digital signatures | SHA2 and SHAKE, each with 128f/s, 192f/s, 256f/s |

All 18 parameter sets are exposed. SLH-DSA small-signature (`s`) variants can be slow, particularly at higher strengths. Computation runs off the UI thread and can be cancelled. No algorithms are silently substituted. These are finalized standard exports, not legacy Kyber/Dilithium/SPHINCS+ formats. NIST categories are comparative security targets, not interchangeable bit counts.

## Screenshots placeholder

The browser test produces desktop and mobile full-page screenshots at `test-results/desktop-introduction.png` and `test-results/mobile-introduction.png`. Add curated copies here when publishing; generated test artifacts are excluded from Git.

## Architecture

React + strict TypeScript + Vite + modern CSS. The production output is entirely static; Node is only a development/build tool.

```text
src/
  components/   Accessible shared controls and byte displays
  pages/        Educational sections and focused lab components
  crypto/       Noble adapters, typed operation dispatcher, worker, Web Crypto AES/HKDF
  data/         Navigation, glossary, references, and educational content
  hooks/        Worker lifecycle, cancellation, and understandable errors
  styles/       Responsive design with system fonts
  types/        Worker request/result contracts
  utils/        Byte formatting and educational equality checks
public/         Static files and third-party license notices
 tests/         Vitest crypto/component/config tests and Playwright browser tests
.github/workflows/deploy-pages.yml
```

Hash navigation (`/#ml-kem`, `/#glossary/shared-secret`) supports direct links and refreshes on GitHub Pages without server rewrites. Generated lab state resets when leaving a lab; completed KEM secrets remain in app memory for the secure-message page until replaced or reloaded. Parameter changes clear dependent results. Each PQC operation uses a locally bundled module worker that terminates on completion, cancellation, or unmount. No expensive key generation happens during rendering.

AES uses native asynchronous Web Crypto. Both parties independently derive a non-exportable AES-256 key using HKDF-SHA-256, a random 32-byte public salt, and the fixed context `nist-pqc-playground / ML-KEM + AES-256-GCM / v1`. Each message uses a fresh random 12-byte IV. The same context is GCM additional authenticated data; the 128-bit tag is appended by Web Crypto and displayed separately. There is no password-based key derivation and no homemade primitive.

ML-KEM implicit rejection means an altered, correctly sized ciphertext or wrong valid secret key generally produces a different shared secret rather than throwing. Invalid lengths throw. Tests exercise both outcomes; AES-GCM refuses unauthenticated decryption. ML-KEM alone does **not** authenticate the public key or either participant. This illustrative composition is not a standardized complete messaging protocol and lacks identity binding, replay defense, and lifecycle management.

## Privacy

> All cryptographic operations in this playground run locally in your browser. Keys, plaintext, ciphertext, signatures, and shared secrets are not sent to a server.

No backend, accounts, analytics, cookies, local storage, cloud APIs, remote fonts, or runtime external dependencies. Static hosting necessarily receives asset requests; crypto inputs never enter those requests. Workers load same-origin bundled static assets when needed. Reference links navigate externally only when clicked. There is no persistence; reload clears state. JavaScript does not guarantee secure memory erasure. The browser test rejects external requests, fetch/XHR traffic, and non-GET requests during lab flows.

## Run Locally

Use Node.js 24 LTS (Node 20.19+ is also supported by the installed toolchain), npm, and a current browser supporting secure randomness, module workers, and Web Crypto.

```sh
npm ci
npm run dev
```

Open http://localhost:5173/nist-pqc-playground/. HTTPS or localhost is required for Web Crypto. Capability errors are shown in the UI; no insecure fallback is provided. This project uses JavaScript, so no WASM initialization is required.

## Run Tests

```sh
npm test
npm run lint
npm run format:check
```

Vitest covers all ML-KEM and signature parameter sets, corrupted ciphertext, wrong keys, altered messages/signatures, AES-GCM round trips and rejection, parameter resets, interaction prerequisites, timeline/migration controls, formatting, Pages base paths, and workflow YAML. Exhaustive SLH-DSA tests may take a few minutes on slower systems. These are integration tests of the selected library, not a replacement for its upstream vectors or a security audit.

Real-browser verification (after building):

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

Playwright checks desktop and mobile Chromium using the production build at its repository base path: real workers and crypto, tampering, refresh navigation, glossary deep links, network behavior, horizontal overflow, and console errors. Browser binaries are a one-time development download. Other browser engines have not been certified by this project.

## Build

```sh
npm run build
npm run preview
```

Publish only `dist/`. Preview is at http://localhost:4173/nist-pqc-playground/. No server runtime, database, Docker, or paid service is needed on the deployed site. To format source, run `npm run format`.

## GitHub Pages Deployment

1. Publish this directory as a GitHub repository, preferably `nist-pqc-playground`, with a `main` branch.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
3. Push to `main` or run **Test and deploy GitHub Pages** using the Actions tab.

The workflow installs from the lockfile, lints, checks formatting, tests, builds, uploads `dist`, and deploys using supported official Pages Actions. It grants `contents: read`, `pages: write`, and `id-token: write`, with a `github-pages` environment and deployment concurrency control. No personal token or server secret is necessary.

Vite reads the Actions-provided `GITHUB_REPOSITORY` (`owner/repository`) to derive `/<repository>/`. Owner-site repositories ending in `.github.io` use `/`. Local builds default to `/nist-pqc-playground/`. For custom domains, set the desired base in `vite.config.ts`. Use hash links for sections; requesting `/repository/ml-kem` as a server path is not supported. If assets fail after a rename, rebuild with the correct repository value rather than moving an old build.

## Cryptography Dependencies

Pinned direct crypto dependency: **`@noble/post-quantum` 0.7.1**, MIT license. Its locked dependencies are `@noble/ciphers` 2.4.0, `@noble/curves` 2.4.0, and `@noble/hashes` 2.4.0, also MIT. AES-GCM, HKDF-SHA-256, and secure random values use the browser. React and React DOM are MIT. Exact versions of all dependencies are recorded in `package-lock.json`.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and the full runtime license notices distributed in `public/third-party-licenses.txt`. Development dependency licenses are recorded in [DEPENDENCY_LICENSES.md](DEPENDENCY_LICENSES.md). This license review found no incompatibility with releasing this application's source under MIT. The cryptographic library's implementation of a FIPS standard does not mean this application or its modules are FIPS validated. Do not infer that this project has independently audited the library.

## Educational Disclaimer

This is an educational demonstration, not production security advice or a replacement for security engineering review. Private-key exposure and two participants in one browser are intentionally pedagogical. Follow current NIST guidance and use reviewed, authenticated protocols for production. Browser timing measurements vary with hardware, load, runtime, and implementation. Benchmarks report a median of three fresh operations per stage, with no warm-up, on a fixed short message, excluding worker startup; they are not universal rankings. The migration percentage counts fictional planning tasks, not real security readiness. The lattice picture is an analogy, not an implementation of ML-KEM or ML-DSA.

This independent project is not affiliated with or endorsed by NIST.

## References

- [FIPS 203 — ML-KEM](https://csrc.nist.gov/pubs/fips/203/final): finalized key encapsulation standard.
- [FIPS 204 — ML-DSA](https://csrc.nist.gov/pubs/fips/204/final): finalized lattice-based signatures.
- [FIPS 205 — SLH-DSA](https://csrc.nist.gov/pubs/fips/205/final): finalized stateless hash-based signatures.
- [NIST PQC project](https://csrc.nist.gov/projects/post-quantum-cryptography): standards and project updates.
- [NIST migration project](https://www.nccoe.nist.gov/applied-cryptography/migration-to-pqc): inventory and interoperability guidance.
- [noble-post-quantum 0.7.1](https://github.com/paulmillr/noble-post-quantum/tree/0.7.1): implementation documentation and upstream tests.
- [Vite deployment guide](https://vite.dev/guide/static-deploy.html#github-pages): static Pages deployment guidance.

## License

[MIT](LICENSE). Third-party dependencies retain their respective licenses and notices.
