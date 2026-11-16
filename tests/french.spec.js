const {test, expect} = require('./fixtures');
const inventory = require('../src/data/pages.json');
const frenchRoutes = Object.keys(inventory).filter(route => route.startsWith('/fr/'));

for (const width of [375, 768, 1440]) {
  test(`French pages fit and initialize at ${width}px`, async ({page}) => {
    test.setTimeout(120000);
    await page.setViewportSize({width, height: 900});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of frenchRoutes) {
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('lang', 'fr-FR');
      await expect(page.locator('body')).toHaveClass(/wpex-docready/);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBeTruthy();
      await expect(page.locator('h1'), route).toHaveCount(1);
      await expect(page.locator('#footer a[href="/fr/confidentialite/"]'), route).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test('French home, mobile navigation and language switching keep the matching page', async ({page}) => {
  await page.setViewportSize({width: 390, height: 900});
  await page.goto('/');
  await page.locator('.camya-language[hreflang="fr-FR"]').click();
  await expect(page).toHaveURL(/\/fr\/$/);
  await expect(page.locator('h1')).toHaveText('Un conseil juridique qui comprend votre entreprise');
  const toggle = page.getByRole('button', {name: 'Ouvrir le menu', exact: true});
  await toggle.click();
  await expect(page.locator('#home-navigation')).toBeVisible();
  await page.locator('#home-navigation a[href="/fr/le-cabinet/"]').click();
  await expect(page).toHaveURL(/\/fr\/le-cabinet\/$/);
  await page.getByRole('button', {name: 'Ouvrir le menu mobile'}).click();
  await expect(page.getByRole('dialog', {name: 'Menu mobile'})).toBeVisible();
  await page.locator('#sidr-main a[hreflang="en-US"]').click();
  await expect(page).toHaveURL(/\/en\/the-firm\/$/);
  await page.locator('.mobile-menu-toggle').click();
  await page.locator('#sidr-main a[hreflang="fr-FR"]').click();
  await expect(page).toHaveURL(/\/fr\/le-cabinet\/$/);
});

test('French team tabs, biographies and archived article pagination work', async ({page}) => {
  await page.goto('/fr/equipe/');
  await page.locator('.vc_tta-tabs-list a').filter({hasText: 'Collaborateurs'}).click();
  await expect(page.locator('a[href="/fr/equipe/barbara-de-la-garza-becerril/"]').last()).toBeVisible();
  await page.locator('.vc_tta-tabs-list a').filter({hasText: 'Associés'}).click();
  await page.locator('a[href="/fr/equipe/omar-cuellar-gamboa/"]').last().click();
  await expect(page.getByText(/plus de 25 ans/)).toBeVisible();
  const education = page.locator('.vc_tta-panel-title a').filter({hasText: 'Formation'});
  await education.click();
  await expect(page.getByText('summa cum laude')).toBeVisible();
  await education.click();
  await expect(page.getByText('summa cum laude')).toBeHidden();
  await page.locator('#site-navigation a[hreflang="es-MX"]').click();
  await expect(page).toHaveURL(/\/staff-member\/omar-cuellar-gamboa\/$/);
  await page.goto('/fr/categorie/publications/');
  await page.locator('#main a[href="/fr/categorie/publications/page/2/"]').first().click();
  await expect(page).toHaveURL(/\/fr\/categorie\/publications\/page\/2\/$/);
  await page.locator('#main a[href="/fr/actualites/imss-facilites-administratives/"]').first().click();
  await expect(page).toHaveURL(/\/fr\/actualites\/imss-facilites-administratives\/$/);
});
