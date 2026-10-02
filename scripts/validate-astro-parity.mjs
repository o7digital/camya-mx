import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { parse } from 'parse5';

// Compare the compiled components to the approved DOM, independent of formatting.
const baseline = JSON.parse(fs.readFileSync('archive/astro-baseline.json', 'utf8'));
function find(node, id) {
  if (node.attrs?.some(attribute => attribute.name === 'id' && attribute.value === id)) return node;
  for (const child of node.childNodes ?? []) {
    const found = find(child, id);
    if (found) return found;
  }
}
function canonical(node) {
  if (!node || ['script', 'style', 'link'].includes(node.tagName)) return null;
  if (node.nodeName === '#text') return node.value.replace(/\s+/g, ' ').trim() || null;
  if (!node.tagName) return null;
  return {
    tag: node.tagName,
    attrs: Object.fromEntries((node.attrs ?? []).map(attribute => [attribute.name, attribute.value])
      .sort((a, b) => a[0].localeCompare(b[0]))),
    children: (node.childNodes ?? []).map(canonical).filter(Boolean),
  };
}
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
for (const [route, expected] of Object.entries(baseline.routes)) {
  const source = path.join('src/pages', '.' + route, 'index.astro');
  assert.ok(fs.existsSync(source), `Missing native Astro page: ${route}`);
  const template = fs.readFileSync(source, 'utf8');
  assert.ok(template.includes('<SiteLayout') && !template.includes('set:html'), `Page must use native Astro markup: ${route}`);
  const html = fs.readFileSync(path.join('dist', '.' + route, 'index.html'), 'utf8');
  assert.ok(!/jquery|\/wp-content\/|\/wp-includes\/|wpex_theme_params|setREVStartSize|nfFrontEnd/.test(html), `Old runtime referenced at ${route}`);
  const document = parse(html);
  for (const [id, expectedHash] of Object.entries(expected)) {
    assert.equal(hash(JSON.stringify(canonical(find(document, id)))), expectedHash, `Approved DOM changed at ${route} #${id}`);
  }
}
for (const [file, expected] of Object.entries(baseline.assets)) {
  assert.equal(hash(fs.readFileSync(path.join('public', file))), expected, `Approved asset changed: ${file}`);
  assert.deepEqual(fs.readFileSync(path.join('dist', file)), fs.readFileSync(path.join('public', file)), `Built asset changed: ${file}`);
}
assert.ok(!fs.existsSync('src/legacy'), 'The transitional legacy renderer must be removed');
console.log(`Native Astro parity verified: ${Object.keys(baseline.routes).length} routes, shared headers/footers and ${Object.keys(baseline.assets).length} unchanged assets.`);
