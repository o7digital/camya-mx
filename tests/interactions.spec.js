const {test,expect}=require('@playwright/test');

test('practice details and all five partner dialogs work with focus restored',async({page})=>{
  await page.goto('/');
  const service=page.locator('.practice').first();
  await service.locator('summary').click();
  await expect(service).toHaveAttribute('open','');
  await expect(service.locator('p')).toBeVisible();
  for (const key of ['omar','roberto','rafael','ilian','jose']) {
    const trigger=page.locator(`[data-person="${key}"]`);
    await trigger.click();
    await expect(page.locator('dialog')).toBeVisible();
    await expect(page.locator('.dialog-profile-link')).toHaveAttribute('href',/\/staff-member\//);
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await page.locator('[data-person="omar"]').click();
  await page.locator('.dialog-close').click();
  await expect(page.locator('dialog')).not.toBeVisible();
});

test('team tabs preserve associates and complete original biographies',async({page})=>{
  await page.goto('/equipo/');
  await page.getByRole('tab',{name:'Of Counsel',exact:true}).click();
  await expect(page.getByRole('link',{name:/LEÓN FELIPE/})).toBeVisible();
  await page.getByRole('tab',{name:'Asociados',exact:true}).click();
  await expect(page.locator('.directory-person[href="/staff-member/barbara-de-la-garza-becerril/"]')).toBeVisible();
  await page.getByRole('tab',{name:'Socios',exact:true}).click();
  await page.getByRole('link',{name:/OMAR CUELLAR/}).click();
  await expect(page).toHaveURL(/\/staff-member\/omar-cuellar-gamboa\/$/);
  await page.locator('summary').filter({hasText:'Educación'}).click();
  await expect(page.getByText(/summa cum laude/)).toBeVisible();
  await page.locator('#language').click();
  await expect(page).toHaveURL(/\/en\/staff-member\/omar-cuellar-gamboa-en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang','en-US');
});

test('form composes mail and makes no submission request or success claim',async({page})=>{
  const requests=[];
  await page.goto('/');
  page.on('request',r=>{if(r.method()==='POST')requests.push(r.url());});
  const form=page.locator('#contact-form');
  await form.locator('[name="name"]').fill('Test CAMYA');
  await form.locator('[name="company"]').fill('Example');
  await form.locator('[name="position"]').fill('Director');
  await form.locator('[name="email"]').fill('test@example.com');
  await form.locator('[name="message"]').fill('Demande de consultation');
  const target=await form.evaluate(form=>{
    const event=new Event('submit',{bubbles:true,cancelable:true});
    form.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(target).toBe(true);
  await expect(form).toBeVisible();
  await expect(form).toContainText('No se envía automáticamente');
  expect(requests).toEqual([]);
});
