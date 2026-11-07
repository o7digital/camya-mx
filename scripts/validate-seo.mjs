import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'parse5';
import { isIndexingAllowed } from '../src/data/indexing-policy.mjs';

const inventory = JSON.parse(fs.readFileSync('src/data/pages.json', 'utf8'));
const metadata = JSON.parse(fs.readFileSync('src/data/seo.json', 'utf8'));
const origin = 'https://www.camya.mx';
function all(node, predicate) {
  return [ ...(predicate(node) ? [node] : []), ...(node.childNodes ?? []).flatMap(child => all(child, predicate)) ];
}
const attr = (node, name) => node.attrs?.find(attribute => attribute.name === name)?.value;
const text = node => node.value ?? (node.childNodes ?? []).map(text).join('');

// Preview must stay private even if a production setting is accidentally inherited.
for (const setting of [undefined, 'true', 'false']) {
  assert.equal(isIndexingAllowed('preview', setting), false, 'Preview indexing must stay off');
}
assert.equal(isIndexingAllowed('production', undefined), true, 'Production release must enable indexing');
assert.equal(isIndexingAllowed('production', 'true'), true);
assert.equal(isIndexingAllowed('production', 'false'), false, 'Keep the explicit production kill switch');
assert.equal(isIndexingAllowed(undefined, undefined), false, 'Local builds default to noindex');
assert.equal(isIndexingAllowed(undefined, 'true'), true, 'Allow explicit local production-policy checks');
assert.deepEqual(Object.keys(metadata).sort(), Object.keys(inventory).sort(), 'Metadata must cover every route');

const titles = new Set();
const descriptions = new Set();
const canonicalUrls = [];
const indexable = isIndexingAllowed(process.env.VERCEL_ENV, process.env.PUBLIC_ALLOW_INDEXING);
for (const route of Object.keys(inventory)) {
  const document = parse(fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8'));
  const find = predicate => all(document, predicate);
  const titleNodes = find(node => node.tagName === 'title');
  const descriptionNodes = find(node => node.tagName === 'meta' && attr(node, 'name') === 'description');
  const robotsNodes = find(node => node.tagName === 'meta' && attr(node, 'name') === 'robots');
  const canonicalNodes = find(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical');
  assert.equal(titleNodes.length, 1, `One title required: ${route}`);
  assert.equal(descriptionNodes.length, 1, `One description required: ${route}`);
  assert.equal(robotsNodes.length, 1, `One robots directive required: ${route}`);
  assert.equal(canonicalNodes.length, 1, `One canonical required: ${route}`);
  assert.equal(find(node => node.tagName === 'h1').length, 1, `One primary heading required: ${route}`);
  const title = text(titleNodes[0]).trim();
  const description = attr(descriptionNodes[0], 'content');
  assert.ok(title.length > 10 && title.length < 110, `Descriptive title required: ${route}`);
  assert.ok(description.length >= 80 && description.length <= 190, `Useful description required: ${route}`);
  const canonicalPath = metadata[route].canonicalPath ?? route;
  assert.ok(inventory[canonicalPath], `Canonical must point to an existing route: ${route}`);
  assert.equal(attr(canonicalNodes[0], 'href'), origin + canonicalPath, `Wrong canonical: ${route}`);
  assert.equal(attr(robotsNodes[0], 'content'), indexable ? 'index,follow' : 'noindex,nofollow', `Wrong robots directive: ${route}`);
  for (const property of ['title', 'description', 'url']) {
    const tags = find(node => node.tagName === 'meta' && attr(node, 'property') === `og:${property}`);
    assert.equal(tags.length, 1, `One og:${property} required: ${route}`);
    assert.equal(attr(tags[0], 'content'), { title, description, url: origin + canonicalPath }[property], `Inconsistent social metadata: ${route}`);
  }
  if (canonicalPath === route) {
    assert.ok(!titles.has(title), `Duplicate canonical-page title: ${route}`);
    assert.ok(!descriptions.has(description), `Duplicate canonical-page description: ${route}`);
    titles.add(title);
    descriptions.add(description);
    canonicalUrls.push(origin + route);
  }
}
const xml = fs.readFileSync('dist/sitemap.xml', 'utf8');
const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(listed).size, listed.length, 'Sitemap must contain no duplicates');
assert.deepEqual(listed.sort(), canonicalUrls.sort(), 'Sitemap must contain every canonical route and no aliases');
assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
assert.ok(xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
const robots = fs.readFileSync('dist/robots.txt', 'utf8');
assert.equal(robots, `User-agent: *\n${indexable ? 'Allow: /' : 'Disallow: /'}\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`SEO verified: ${Object.keys(inventory).length} pages, ${canonicalUrls.length} canonical sitemap URLs, unique metadata, H1s and ${indexable ? 'production indexing' : 'noindex protection'}.`);
