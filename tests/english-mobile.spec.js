const {test, expect} = require('@playwright/test');

test('English home hero stays readable and below the logo on phones and tablets', async ({page}) => {
  for (const route of ['/en/', '/en/home/']) {
    for (const width of [320, 375, 390, 430, 768, 1023]) {
      await page.setViewportSize({width, height: 900});
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const hero = page.locator('.camya-hero');
      const title = hero.locator('h1');
      await expect(title).toHaveText('Legal advice that truly understands your business');
      const geometry = await page.evaluate(() => {
        const title = document.querySelector('.camya-hero h1');
        return {
          titleTop: title.getBoundingClientRect().top,
          titleHeight: title.getBoundingClientRect().height,
          fontSize: parseFloat(getComputedStyle(title).fontSize),
          headerBottom: document.querySelector('#site-header').getBoundingClientRect().bottom,
          fits: document.documentElement.scrollWidth <= innerWidth,
        };
      });
      expect(geometry.fontSize, `${route} at ${width}px`).toBeLessThanOrEqual(width <= 430 ? 40 : 56);
      expect(geometry.titleTop, `${route} at ${width}px`).toBeGreaterThanOrEqual(geometry.headerBottom + 16);
      expect(geometry.titleHeight, `${route} at ${width}px`).toBeLessThanOrEqual(180);
      expect(geometry.fits, `${route} at ${width}px`).toBeTruthy();
      await expect(page.locator('.camya-menu-toggle')).toBeVisible();
    }
  }
});
