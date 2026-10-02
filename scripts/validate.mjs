import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const pages = JSON.parse(fs.readFileSync('archive/pages.json', 'utf8'));
const problems = [];
for (const route of Object.keys(pages)) {
  const file = path.join(root, route, 'index.html');
  if (!fs.existsSync(file)) { problems.push(`Missing route: ${route}`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  if (!/noindex/.test(html)) problems.push(`Missing noindex: ${route}`);
  if (/ajaxNonce|wp-admin\/admin-ajax|nfFrontEnd/.test(html)) problems.push(`Server configuration present: ${route}`);
  for (const match of html.matchAll(/(?:src|href)=["'](\/[^"'#?]+)["']/g)) {
    const asset = decodeURIComponent(match[1]);
    const target = path.join(root, asset);
    if (!fs.existsSync(target) && !fs.existsSync(path.join(target, 'index.html'))) problems.push(`Missing link or asset: ${route} → ${asset}`);
  }
}
if (problems.length) { console.error([...new Set(problems)].join('\n')); process.exit(1); }
console.log(`Validated ${Object.keys(pages).length} preserved routes and local assets.`);
