const {test, expect} = require('@playwright/test');

const languages = [
  {route: '/', title: 'Asesoría Legal que sí entiende tu negocio', subtitle: 'Más de 10 años protegiendo a empresas, acompañando su crecimiento con asesoría estratégica y confiable',
    labels: ['Inicio', 'Servicios', 'Nosotros', 'Sectores', 'Equipo', 'Contacto'], practice: '/areas-de-practica/', firm: '/la-firma/', contact: '/#contacto', anchor: '#contacto', language: '/en/home/'},
  {route: '/en/home/', title: 'Legal advice that truly understands your business', subtitle: 'More than 10 years protecting businesses, supporting their growth with strategic and reliable legal advice',
    labels: ['Home', 'Services', 'About Us', 'Sectors', 'Our Team', 'Contact'], practice: '/en/pratic-areas/', firm: '/en/the-firm/', contact: '/en/home/#contactus', anchor: '#contactus', language: '/'},
];

for (const width of [375, 390, 430, 768, 1440]) {
  test(`refreshed ES/EN home is readable and functional at ${width}px`, async ({page, request, baseURL}) => {
    await page.setViewportSize({width, height: 1000});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const copy of languages) {
      await page.goto(copy.route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toHaveText(copy.title);
      await expect(page.locator('.camya-hero-description')).toHaveText(copy.subtitle);
      await expect(page.locator('#home-navigation a')).toHaveText(copy.labels);
      await expect(page.locator('.camya-language')).toHaveAttribute('href', copy.language);
      await expect(page.locator('.camya-consult')).toHaveAttribute('href', copy.contact);
      await expect(page.locator('.camya-hero a')).toHaveCount(0);
      await expect(page.locator('#home-navigation a').nth(1)).toHaveAttribute('href', copy.practice);
      await expect(page.locator('#home-navigation a').nth(2)).toHaveAttribute('href', copy.firm);
      await expect(page.locator('#home-navigation a').nth(3)).toHaveAttribute('href', copy.practice + '#content');
      const sectors = await request.get(copy.practice);
      expect(await sectors.text()).toContain('id="content"');
      expect(await sectors.text()).toMatch(/Energía, Petróleo y Gas|Energy/);

      const geometry = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        headerBottom: document.querySelector('#site-header').getBoundingClientRect().bottom,
        titleTop: document.querySelector('h1').getBoundingClientRect().top,
        gradient: getComputedStyle(document.querySelector('#site-header')).backgroundImage,
        overlay: getComputedStyle(document.querySelector('.camya-hero-overlay')).backgroundImage,
        font: getComputedStyle(document.querySelector('h1')).fontFamily,
        fontWeight: getComputedStyle(document.querySelector('h1')).fontWeight,
      }));
      expect(geometry.overflow).toBe(false);
      expect(geometry.titleTop).toBeGreaterThan(geometry.headerBottom + 16);
      expect(geometry.gradient).toBe('linear-gradient(110deg, rgb(190, 24, 72) 35%, rgb(26, 47, 90) 35%)');
      expect(geometry.overlay).toContain('rgba(18, 40, 76, 0.7)');
      expect(geometry.font).toContain('Inter');
      expect(geometry.fontWeight).toBe('700');
      await expect(page.locator('.camya-brand img')).toHaveAttribute('src', '/wp-content/uploads/2026/10/logoblanco_nvo.svg');
      await expect(page.locator('.camya-hero-image')).toHaveAttribute('src', '/home-assets/hero-montanas.webp');
      const logos = page.locator('.camya-recognition-capsule img');
      await expect(logos).toHaveCount(3);
      expect(await logos.evaluateAll(images => images.map(i => i.getAttribute('src')))).toEqual(
        Array(3).fill('/wp-content/uploads/2026/10/logos-white_3.png')
      );
      expect(await logos.evaluateAll(images => images.map(i => i.alt))).toEqual([
        'Chambers — Ranked in Latin America', 'The Legal 500', "Who's Who Legal — WWL",
      ]);
      const marks = await page.locator('.camya-mark').evaluateAll(elements => elements.map(e => e.getBoundingClientRect().x));
      expect(marks[0]).toBeLessThan(marks[1]);
      expect(marks[1]).toBeLessThan(marks[2]);
      await expect(page.locator('.camya-recognition-capsule svg,.camya-recognition-capsule canvas')).toHaveCount(0);
      await expect(page.locator('footer#footer')).toHaveCount(1);

      if (width < 1180) {
        const toggle = page.locator('.camya-menu-toggle');
        await expect(page.locator('#home-navigation')).toBeHidden();
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('#home-navigation')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(toggle).toBeFocused();
        await toggle.click();
        await page.locator('#home-navigation a').last().click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      } else {
        await page.locator('.camya-consult').click();
      }
      await expect(page).toHaveURL(new URL(copy.contact, baseURL).href);
      await expect(page.locator(copy.anchor)).toBeInViewport();
      await expect(page.locator('.local-contact-form')).toBeVisible();

      await page.goto(copy.route);
      await page.locator('.camya-language').click();
      await expect(page).toHaveURL(new URL(copy.language, baseURL).href);
    }
    expect(errors).toEqual([]);
  });
}
