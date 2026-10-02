const {test,expect}=require('@playwright/test');

test('original team tabs and complete biographies work',async({page})=>{
  await page.goto('/equipo/');
  await page.locator('.vc_tta-tabs-list a').filter({hasText:'Of Counsel'}).click();
  await expect(page.locator('a[href="/staff-member/leon-felipe-aguilar-jimenez/"]').last()).toBeVisible();
  await page.locator('.vc_tta-tabs-list a').filter({hasText:'Asociados'}).click();
  await expect(page.locator('a[href="/staff-member/barbara-de-la-garza-becerril/"]').last()).toBeVisible();
  await page.locator('.vc_tta-tabs-list a').filter({hasText:'Socios'}).click();
  await page.locator('a[href="/staff-member/omar-cuellar-gamboa/"]').last().click();
  await expect(page).toHaveURL(/\/staff-member\/omar-cuellar-gamboa\/$/);
  await page.locator('.vc_tta-panel-title a').filter({hasText:'Educación'}).click();
  await expect(page.getByText(/summa cum laude/)).toBeVisible();
  await page.locator('a[hreflang="en-US"]').first().click();
  await expect(page).toHaveURL(/\/en\/staff-member\/omar-cuellar-gamboa-en\/$/);
});

test('one original footer is rendered on every route',async({page})=>{
  const inventory=require('../archive/pages.json');
  for(const route of Object.keys(inventory)){
    await page.goto(route);
    await expect(page.locator('footer#footer'),route).toHaveCount(1);
    await expect(page.locator('#footer-bottom'),route).toHaveCount(1);
    await expect(page.locator('.original-footer,.footer-top,.footer-bottom,.hero-image')).toHaveCount(0);
  }
});
