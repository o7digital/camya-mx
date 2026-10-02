const {test, expect} = require('@playwright/test');
test('canonical URLs, sitemap and prelaunch indexing policy are consistent', async ({request}) => {
  const inventory = require('../src/data/pages.json');
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Disallow: /');
  const sitemap = await request.get('/sitemap.xml');
  const xml = await sitemap.text();
  expect(xml).toContain('<loc>https://www.camya.mx/en/contact/</loc>');
  for (const route of Object.keys(inventory)) {
    const response = await request.get(route);
    const html = await response.text();
    expect(html, route).not.toMatch(/wp-content|wp-includes|wp-json|xmlrpc|jquery/i);
    expect(html, route).toContain(`rel="canonical" href="https://www.camya.mx${route === '/en/' ? '/en/home/' : route}"`);
    expect(html, route).toContain('noindex,nofollow');
    if (route !== '/en/') expect(xml, route).toContain(`<loc>https://www.camya.mx${route}</loc>`);
  }
});
