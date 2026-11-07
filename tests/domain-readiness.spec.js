const {test, expect} = require('./fixtures');
test('canonical URLs, sitemap and preview indexing protection are consistent', async ({request}) => {
  const inventory = require('../src/data/pages.json');
  const metadata = require('../src/data/seo.json');
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Disallow: /');
  const sitemap = await request.get('/sitemap.xml');
  const xml = await sitemap.text();
  expect(xml).toContain('<loc>https://www.camya.mx/en/contact/</loc>');
  for (const route of Object.keys(inventory)) {
    const response = await request.get(route);
    const html = await response.text();
    expect(html, route).not.toMatch(/wp-content|wp-includes|wp-json|xmlrpc|jquery/i);
    const canonical = metadata[route].canonicalPath ?? route;
    expect(html, route).toContain(`rel="canonical" href="https://www.camya.mx${canonical}"`);
    expect(html, route).toContain('noindex,nofollow');
    if (canonical === route) expect(xml, route).toContain(`<loc>https://www.camya.mx${route}</loc>`);
    else expect(xml, route).not.toContain(`<loc>https://www.camya.mx${route}</loc>`);
  }
});
