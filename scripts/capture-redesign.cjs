const { chromium } = require('@playwright/test');
const fs = require('node:fs');
(async()=>{
  const browser=await chromium.launch();
  fs.mkdirSync('verification/redesign',{recursive:true});
  for (const width of [390,768,1440]) {
    const page=await browser.newPage({viewport:{width,height:900}});
    for (const [name,route] of [['home','/'],['firm','/la-firma/'],['team','/equipo/'],['profile','/staff-member/omar-cuellar-gamboa/'],['news','/noticias/'],['english','/en/home/']]) {
      await page.goto((process.env.TEST_URL||'http://127.0.0.1:8000')+route);
      await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=650){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,50));}scrollTo({top:0,behavior:'instant'});});
      await page.waitForTimeout(200);
      await page.screenshot({path:`verification/redesign/${name}-${width}.png`,fullPage:true});
      console.log(name,width);
    }
    await page.close();
  }
  await browser.close();
})();
