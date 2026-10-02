const { chromium } = require('@playwright/test');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch();
  fs.mkdirSync('verification/clone', { recursive: true });
  const report = [];
  for (const width of [390, 768, 1440]) {
    for (const [name, route] of [['home','/'], ['firm','/la-firma/'], ['practice','/areas-de-practica/'], ['team','/equipo/'], ['english','/en/home/']].filter(([name])=>!process.env.ONLY_HOME || ['home','english'].includes(name))) {
      for (const [kind, origin] of [['original', 'http://www.camya.mx'], ['clone', 'http://127.0.0.1:8000']]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        const errors = [], requests = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('requestfailed', r => requests.push({url:r.url(),error:r.failure()?.errorText}));
        try {
          await page.goto(origin + route, { waitUntil: 'load', timeout: 45000 });
          await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 650) { scrollTo(0,y); await new Promise(r=>setTimeout(r,60)); } scrollTo(0,0); });
          await page.waitForTimeout(700);
          await page.screenshot({ path: `verification/clone/${name}-${width}-${kind}.png`, fullPage: true });
          report.push({name,width,kind,errors,requests,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),images:await page.evaluate(()=>[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src))});
        } catch(e) { report.push({name,width,kind,error:e.message}); }
        await page.close();
        console.log(name,width,kind);
      }
    }
  }
  const old = process.env.ONLY_HOME ? JSON.parse(fs.readFileSync('verification/clone/browser-report.json')).filter(x=>!['home','english'].includes(x.name)) : [];
  fs.writeFileSync('verification/clone/browser-report.json',JSON.stringify([...old,...report],null,2));
  await browser.close();
})();
