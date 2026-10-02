const {test, expect} = require('@playwright/test');
const variants = [
  {route: '/contacto/', english: false},
  {route: '/en/contact/', english: true},
  {route: '/', english: false, home: true},
  {route: '/en/home/', english: true, home: true},
  {route: '/en/', english: true, home: true},
];
for (const copy of variants) {
  test(`${copy.route} validates and posts contact data to Formspree`, async ({page}) => {
    let submission;
    await page.route('https://formspree.io/f/mgavbgza', async route => {
      submission = route.request();
      await route.fulfill({status: 200, contentType: 'text/html', body: '<p>Received</p>'});
    });
    await page.goto(copy.route);
    const form = page.locator('.camya-contact-form');
    const button = form.getByRole('button', {name: copy.english ? 'Send message' : 'Enviar mensaje'});
    await button.click();
    expect(submission).toBeUndefined();
    await form.locator('[name=name]').fill('Prueba CAMYA');
    await form.locator('[name=email]').fill('invalid');
    await form.locator('[name=message]').fill('Consulta de prueba');
    await button.click();
    expect(submission).toBeUndefined();
    await form.locator('[name=email]').fill('test@example.com');
    await form.locator('[name=phone]').fill('5551234567');
    if (copy.home) {
      await form.locator('[name=company]').fill('Example company');
      await form.locator('[name=position]').fill('Director');
    }
    await button.click();
    await expect(page).toHaveURL('https://formspree.io/f/mgavbgza');
    expect(submission.method()).toBe('POST');
    const data = new URLSearchParams(submission.postData());
    expect(data.get('email')).toBe('test@example.com');
    expect(data.get('message')).toBe('Consulta de prueba');
    expect(data.get('name')).toBe('Prueba CAMYA');
    expect(data.get('phone')).toBe('5551234567');
    if (copy.home) expect(data.get('company')).toBe('Example company');
  });
}
for (const width of [390, 1440]) {
  test(`Spanish and English contact forms fit at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    for (const copy of variants) {
      await page.goto(copy.route);
      await page.locator('.camya-contact-form').scrollIntoViewIfNeeded();
      await expect(page.locator('.camya-contact-form')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    }
  });
}
