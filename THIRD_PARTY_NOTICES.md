# Third-party notices

This application's code is MIT licensed. Dependencies retain their own copyrights and licenses.

The runtime dependency set is React, React DOM, scheduler, @noble/post-quantum, @noble/ciphers, @noble/curves, and @noble/hashes. All declare MIT licenses. Full installed runtime license texts, including copyright attribution, are distributed in [public/third-party-licenses.txt](public/third-party-licenses.txt) and copied into production builds by Vite.

[DEPENDENCY_LICENSES.md](DEPENDENCY_LICENSES.md) records the lockfile's runtime, development, and optional platform package licenses. The recorded licenses are MIT, MIT-0, ISC, BSD-2-Clause, BSD-3-Clause, Apache-2.0, BlueOak-1.0.0, CC0-1.0, CC-BY-4.0, and MPL-2.0. The CC-BY-4.0 caniuse-lite dataset and MPL-2.0 Lightning CSS packages are development-only tooling, not bundled runtime dependencies. Their presence does not relicense this application’s source or generated CSS; modified Lightning CSS source would retain its own MPL obligations. No incompatibility with releasing this application under MIT was identified. Development tools are not shipped as an application server or required by deployed browsers.

Regenerate the inventory after dependency changes with `node scripts/licenses.mjs`, inspect newly introduced licenses and notices, then run `npm run format`. No third-party images or fonts are used.
