const {test, expect} = require('@playwright/test');

test('Contacto validates fields and posts the message to Formspree', async ({page}) => {
  let submission;
  await page.route('https://formspree.io/f/mgavbgza', async route => {
    submission = route.request();
    await route.fulfill({status:200, contentType:'text/html', body:'<p>Gracias</p>'});
  });
  await page.goto('/contacto/');
  const form = page.locator('.camya-contact-form');
  await form.getByRole('button', {name:'Enviar mensaje'}).click();
  expect(submission).toBeUndefined();
  await page.getByLabel('Nombre').fill('Prueba CAMYA');
  await page.getByLabel('Correo electrónico').fill('test@example.com');
  await page.getByLabel('Teléfono').fill('5551234567');
  await page.getByLabel('Mensaje', {exact:false}).fill('Consulta de prueba');
  await form.getByRole('button', {name:'Enviar mensaje'}).click();
  await expect(page).toHaveURL('https://formspree.io/f/mgavbgza');
  expect(submission.method()).toBe('POST');
  const data = new URLSearchParams(submission.postData());
  expect(data.get('email')).toBe('test@example.com');
  expect(data.get('message')).toBe('Consulta de prueba');
  expect(data.get('name')).toBe('Prueba CAMYA');
  expect(data.get('phone')).toBe('5551234567');
});

for (const width of [390, 1440]) {
  test(`Contacto form fits at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height:900});
    await page.goto('/contacto/');
    await expect(page.locator('.camya-contact-form')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}
