import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const routes = JSON.parse(fs.readFileSync('archive/pages.json', 'utf8'));
for (const route of Object.keys(routes)) {
  const relative = path.join('.' + route, 'index.html');
  const source = fs.readFileSync(path.join('src/legacy', relative), 'utf8');
  const built = fs.readFileSync(path.join('dist', relative), 'utf8');
  assert.equal(built.trim(), source.trim(), `Astro changed the approved HTML at ${route}`);
}
function verifyAssets(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) verifyAssets(source);
    else assert.deepEqual(fs.readFileSync(path.join('dist', path.relative('public', source))), fs.readFileSync(source), `Asset changed: ${source}`);
  }
}
verifyAssets('public');
console.log(`Astro parity verified: ${Object.keys(routes).length} documents and all public assets preserved.`);
