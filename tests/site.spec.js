const {test, expect} = require('@playwright/test');
const fs = require('node:fs');
const pages = JSON.parse(fs.readFileSync('archive/pages.json','utf8'));

test('all original public routes respond and remain noindex', async ({request}) => {
  for (const route of Object.keys(pages)) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    expect(await response.text(), route).toContain('noindex');
  }
});
for (const width of [390,768,1440]) {
  test(`navigation, images and layout at ${width}px`, async ({page, baseURL}) => {
    await page.setViewportSize({width,height:900});
    const errors=[];
    page.on('pageerror', e=>errors.push(e.message));
    const external=[];
    page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(new URL(baseURL).origin))external.push(r.url());});
    for (const route of ['/', '/en/home/', '/la-firma/', '/areas-de-practica/', '/equipo/', '/noticias/', '/staff-member/omar-cuellar-gamboa/']) {
      await page.goto(route);
      await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,30));}scrollTo({top:0,behavior:'instant'});});
      await page.waitForTimeout(200);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBeTruthy();
      await expect.poll(()=>page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.getBoundingClientRect().height && i.checkVisibility() && (!i.complete||!i.naturalWidth)).map(i=>i.src)),{message:route,timeout:10000}).toEqual([]);
    }
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
  });
}
test('mobile menu opens, links preserve full routes and language pairs',async({page})=>{
  await page.setViewportSize({width:390,height:900});
  await page.goto('/');
  if (await page.locator('#menu').count()) {
    await page.locator('#menu').click();
    await expect(page.locator('#navigation')).toBeVisible();
    await page.locator('#navigation a[href="/la-firma/"]').click();
    await expect(page).toHaveURL(/\/la-firma\/$/);
    await page.locator('#language').click();
    await expect(page).toHaveURL(/\/en\/the-firm\/$/);
  } else {
    await page.locator('.mobile-menu-toggle').first().click();
    await expect(page.locator('#sidr-main')).toBeVisible();
    await page.locator('#sidr-main a[href="/la-firma/"]').first().click();
    await expect(page).toHaveURL(/\/la-firma\/$/);
    await page.locator('.mobile-menu-toggle').first().click();
    await page.locator('#sidr-main a[hreflang="en-US"]').click();
    await expect(page).toHaveURL(/\/en\/the-firm\/$/);
  }
});
