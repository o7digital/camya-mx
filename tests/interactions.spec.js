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

test('original form appearance and submit label remain; no message is sent',async({page})=>{
  const posts=[];
  await page.goto('/');
  page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
  const form=page.locator('.local-contact-form');
  await expect(form.locator('input[type="submit"]')).toHaveValue('Enviar');
  await expect(form.locator('.local-submit-status')).toHaveCount(0);
  for(const placeholder of ['Nombre','Empresa','Cargo','Correo electrónico','Mensaje']){
    await form.getByPlaceholder(placeholder,{exact:true}).fill(placeholder==='Correo electrónico'?'test@example.com':'Prueba');
  }
  await form.locator('input[type="submit"]').click();
  await expect(form.getByRole('status')).toContainText('No se ha enviado ningún mensaje');
  expect(posts).toEqual([]);
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
