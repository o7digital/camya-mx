const {test, expect} = require('@playwright/test');

test('all pages run with native Astro scripts and no JavaScript errors', async ({page}) => {
  const inventory = require('../archive/pages.json');
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of Object.keys(inventory)) {
    await page.goto(route);
    await expect(page.locator('body')).toHaveClass(/wpex-docready/);
    const runtime = await page.evaluate(() => ({
      scripts: [...document.scripts].filter(script => script.src).map(script => new URL(script.src).pathname),
      jquery: typeof window.jQuery,
      plugins: typeof window.wpex_theme_params,
    }));
    expect(runtime.jquery, route).toBe('undefined');
    expect(runtime.plugins, route).toBe('undefined');
    expect(runtime.scripts.every(src => src.startsWith('/_astro/')), route).toBeTruthy();
  }
  expect(errors).toEqual([]);
});

test('native mobile drawer closes with Escape and restores focus', async ({page}) => {
  await page.setViewportSize({width:390, height:900});
  await page.goto('/la-firma/');
  const toggle = page.locator('.mobile-menu-toggle').first();
  await toggle.click();
  await expect(page.locator('#sidr-main')).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(page.locator('#sidr-main')).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('team tabs respond to arrow keys and biography accordions toggle', async ({page}) => {
  await page.goto('/equipo/');
  const tabs = page.locator('.vc_tta-tabs-list a');
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('a[href="/staff-member/leon-felipe-aguilar-jimenez/"]').last()).toBeVisible();
  await page.goto('/staff-member/omar-cuellar-gamboa/');
  const education = page.locator('.vc_tta-panel-title a').filter({hasText:'Educación'});
  await education.focus();
  await page.keyboard.press('Space');
  await expect(education).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText(/summa cum laude/)).toBeVisible();
  await education.click();
  await expect(education).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText(/summa cum laude/)).toBeHidden();
});

test('native search, sticky header and share controls work', async ({page}) => {
  await page.goto('/la-firma/');
  const search = page.locator('.site-search-toggle');
  await search.click();
  await expect(page.locator('#searchform-dropdown')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(search).toHaveAttribute('aria-expanded', 'false');
  await page.evaluate(() => scrollTo(0, 600));
  await expect(page.locator('#site-header')).toHaveClass(/camya-header-sticky/);
  await expect(page.locator('#site-scroll-top')).toBeVisible();
  await page.locator('#site-scroll-top').click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.goto('/sin-categoria-es/fiscal/');
  const twitter = page.locator('.wpex-social-share__link--twitter');
  await expect(twitter).toHaveAttribute('href', /twitter\.com\/intent\/tweet\?url=/);
});
