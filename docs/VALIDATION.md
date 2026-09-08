# Validation record

The repository was validated locally with Node 20.20.0 and npm 10.8.2. The deployment workflow uses Node 24. This record describes local validation; it does not claim a public GitHub Pages deployment exists.

- Clean local Git clone: `npm ci`, `npm test`, and `npm run build` all succeeded without relying on the original working directory’s node_modules.
- Vitest: 33 passing tests, including all 18 supported algorithm parameter sets.
- ESLint, Prettier check, strict TypeScript, and Vite production build: passing.
- Playwright: desktop Chromium and Pixel 7 viewport Chromium flows passing against the production repository base path `/nist-pqc-playground/`.
- Browser flows: real ML-KEM worker key establishment, matching secrets, AES-GCM round trip and tamper rejection, ML-DSA and SLH-DSA signing and tamper rejection, worker benchmark, refresh navigation, glossary deep links, mobile overflow checks, and screenshot review.
- No page errors or console errors during tested flows; no external, fetch/XHR, or non-GET requests observed. Same-origin static asset requests are expected.
- Deployment YAML parsed by automated test; trigger, permissions, and test step checked. Actual GitHub deployment requires publishing the repository and enabling Pages with Actions.
- Runtime MIT licenses and development license declarations reviewed; complete runtime texts included in the build. See the license inventory and notices.

Screenshots show the tested desktop and mobile introduction. This is not a cross-browser certification, accessibility audit, cryptographic audit, or production protocol review. Browser tests use default lab parameter sets; the Vitest suite checks all supported parameter sets. Timings are not universal benchmarks.
