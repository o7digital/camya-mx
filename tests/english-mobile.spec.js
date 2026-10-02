const {test, expect} = require('@playwright/test');

test('English home hero stays readable and below the logo on phones and tablets', async ({page}) => {
  for (const route of ['/en/', '/en/home/']) {
    for (const width of [320, 375, 390, 430, 768, 1023]) {
      await page.setViewportSize({width, height: 900});
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const hero = page.locator('.vc_custom_1703879760954');
      const title = hero.locator('h2');
      await expect(title).toHaveText('Effective Legal Consulting and Advice');
      const geometry = await page.evaluate(() => {
        const title = document.querySelector('.vc_custom_1703879760954 h2');
        return {
          titleTop: title.getBoundingClientRect().top,
          titleHeight: title.getBoundingClientRect().height,
          fontSize: parseFloat(getComputedStyle(title).fontSize),
          headerBottom: document.querySelector('#site-header').getBoundingClientRect().bottom,
          fits: document.documentElement.scrollWidth <= innerWidth,
        };
      });
      expect(geometry.fontSize, `${route} at ${width}px`).toBeLessThanOrEqual(40);
      expect(geometry.titleTop, `${route} at ${width}px`).toBeGreaterThanOrEqual(geometry.headerBottom + 16);
      expect(geometry.titleHeight, `${route} at ${width}px`).toBeLessThanOrEqual(145);
      expect(geometry.fits, `${route} at ${width}px`).toBeTruthy();
      if (width < 960) {
        await expect(page.locator('.mobile-menu-toggle').first()).toBeVisible();
      } else {
        await expect(page.locator('#site-navigation')).toBeVisible();
      }
    }
  }
});
