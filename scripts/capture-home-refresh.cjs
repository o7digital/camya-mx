const {chromium} = require('@playwright/test');
const fs = require('node:fs');

(async () => {
  const origin = process.env.TEST_URL || 'http://127.0.0.1:8000';
  const folder = 'verification/home-refresh';
  fs.mkdirSync(folder, {recursive: true});
  const browser = await chromium.launch();
  const records = [];
  for (const width of [375, 390, 430, 768, 1440]) {
    for (const [route, language] of [['/', 'es'], ['/en/home/', 'en']]) {
      const page = await browser.newPage({viewport: {width, height: 1000}});
      const errors = [], failedResponses = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => {
        if (response.status() >= 400) failedResponses.push({url: response.url(), status: response.status()});
      });
      await page.goto(origin + route);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          scrollTo({top: y, behavior: 'instant'});
          await new Promise(resolve => setTimeout(resolve, 30));
        }
        scrollTo({top: 0, behavior: 'instant'});
        await document.fonts.ready;
        await Promise.race([
          Promise.all([...document.images].filter(i => i.complete && i.naturalWidth).map(i => i.decode().catch(() => {}))),
          new Promise(resolve => setTimeout(resolve, 1500)),
        ]);
      });
      await page.waitForTimeout(350);
      const file = `${language}-${width}.png`;
      await page.screenshot({path: `${folder}/${file}`, fullPage: true, animations: 'disabled'});
      await page.screenshot({path: `${folder}/${language}-${width}-top.png`, animations: 'disabled'});
      records.push({route, language, width, file, errors, failedResponses, ...await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        missingImages: [...document.images].filter(i => i.checkVisibility() && (!i.complete || !i.naturalWidth)).map(i => i.src),
        footerCount: document.querySelectorAll('footer#footer').length,
      }))});
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync(`${folder}/captures.json`, JSON.stringify(records, null, 2) + '\n');
  const links = records.map(r => `<article><h2>${r.language.toUpperCase()} · ${r.width}px</h2><a href="${r.file}"><img src="${r.language}-${r.width}-top.png" alt="Accueil ${r.language} à ${r.width}px" loading="lazy"></a><p><a href="${r.file}">Page complète</a></p></article>`).join('');
  fs.writeFileSync(`${folder}/index.html`, `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CAMYA — accueil ES/EN</title><style>body{font:16px system-ui;margin:32px;background:#f4f5f8;color:#12284c}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}article{background:white;padding:20px;border-radius:12px}img{display:block;width:100%;height:auto}a{color:#be1848}h2{font-size:18px}</style><h1>Accueil CAMYA — prévisualisation</h1><p>Captures aux cinq largeurs demandées. Cliquer pour ouvrir la page complète.</p><main>${links}</main></html>`);
  console.log(`${records.length} captures saved; issues:`, records.filter(r => r.errors.length || r.failedResponses.length || r.overflow || r.missingImages.length || r.footerCount !== 1));
})().catch(error => {console.error(error); process.exitCode = 1;});
