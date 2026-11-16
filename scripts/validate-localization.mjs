import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'parse5';

const pages = JSON.parse(fs.readFileSync('src/data/pages.json', 'utf8'));
const metadata = JSON.parse(fs.readFileSync('src/data/seo.json', 'utf8'));
const groups = JSON.parse(fs.readFileSync('src/data/language-routes.json', 'utf8'));
const tags = { es: 'es-MX', en: 'en-US', fr: 'fr-FR' };
const attr = (node, name) => node.attrs?.find(attribute => attribute.name === name)?.value;
function all(node, predicate) {
  return [...(predicate(node) ? [node] : []), ...(node.childNodes ?? []).flatMap(child => all(child, predicate))];
}
const french = Object.keys(pages).filter(route => route.startsWith('/fr/'));
const spanish = Object.keys(pages).filter(route => !route.startsWith('/fr/') && !route.startsWith('/en/'));
assert.equal(french.length, spanish.length, 'French must cover the entire Spanish site, including archives and pagination');

for (const [route, page] of Object.entries(pages)) {
  const group = groups.find(group => Object.keys(tags).some(language => group[language] === route) || group.aliases?.includes(route));
  assert.ok(group, `Missing language group: ${route}`);
  const document = parse(fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8'));
  const alternates = all(document, node => node.tagName === 'link' && attr(node, 'rel') === 'alternate');
  const expected = Object.entries(tags).filter(([language]) => group[language]);
  assert.equal(alternates.length, expected.length, `Wrong alternate count: ${route}`);
  for (const [language, tag] of expected) {
    const target = group[language];
    assert.ok(pages[target], `Missing ${language} translation: ${route}`);
    assert.ok(!metadata[target].canonicalPath, `Alternate must use a canonical route: ${target}`);
    assert.ok(alternates.some(node => attr(node, 'hreflang') === tag && attr(node, 'href') === `https://www.camya.mx${target}`), `Wrong ${language} alternate: ${route}`);
  }
  if (page.language !== 'fr') continue;
  assert.equal(attr(all(document, node => node.tagName === 'html')[0], 'lang'), 'fr-FR', `French document language: ${route}`);
  const main = all(document, node => node.tagName === 'main')[0];
  for (const anchor of all(main, node => node.tagName === 'a')) {
    const href = attr(anchor, 'href');
    if (!href?.startsWith('/') || href.startsWith('/assets/') || href.startsWith('//')) continue;
    assert.ok(href.startsWith('/fr/'), `French content links outside its language: ${route} → ${href}`);
  }
  assert.equal(all(document, node => node.tagName === 'footer').length, 1, `One French footer: ${route}`);
}
console.log(`Localization verified: ${french.length} French pages, reciprocal language links and French internal navigation.`);
