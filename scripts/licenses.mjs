import fs from 'node:fs';
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
const rows = [];
const notices = [];
for (const [path, entry] of Object.entries(lock.packages)) {
  if (!path) continue;
  const name = path.split('node_modules/').at(-1);
  rows.push(
    `| ${name} | ${entry.version} | ${entry.license ?? 'UNDECLARED'} | ${entry.dev ? 'Development' : 'Runtime'} |`,
  );
  if (!entry.dev && fs.existsSync(path)) {
    const file = fs.readdirSync(path).find((n) => /^licen[sc]e(\.|$)/i.test(n));
    if (!file) throw new Error(`Missing license: ${name}`);
    notices.push(
      `${name} ${entry.version}\n${'='.repeat(60)}\n${fs.readFileSync(`${path}/${file}`, 'utf8')}`,
    );
  }
}
fs.writeFileSync(
  'DEPENDENCY_LICENSES.md',
  '# Dependency licenses\n\nGenerated from package-lock.json by `node scripts/licenses.mjs`. Includes optional platform packages. Runtime license texts are bundled in public/third-party-licenses.txt.\n\n| Package | Version | Declared license | Use |\n| --- | --- | --- | --- |\n' +
    rows.sort().join('\n') +
    '\n',
);
fs.writeFileSync('public/third-party-licenses.txt', notices.join('\n\n'));
