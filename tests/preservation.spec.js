const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const originals=JSON.parse(fs.readFileSync('archive/clone-html.json','utf8'));

test('every original paragraph, heading and practice item remains in its public route',async({page,request})=>{
  await page.goto('/');
  for (const [route,original] of Object.entries(originals)) {
    const response=await request.get(route);
    const current=await response.text();
    const missing=await page.evaluate(({original,current})=>{
      const parser=new DOMParser();
      const old=parser.parseFromString(original,'text/html').querySelector('#content');
      const now=parser.parseFromString(current,'text/html');
      // Account for the requested office address and directory updates.
      const norm=t=>t.replace('directorios especializados “The Legal 500”', 'directorios especializados “Chambers and Partners”, “The Legal 500”').replace('Calle Bosque de Radiatas #44, Oficina 101', 'Calle Bosque de Radiatas 32, Oficina 301').replace(/\s+/g,' ').trim();
      old?.querySelectorAll('script,style,noscript,.local-contact-form').forEach(t=>t.remove());
      now.querySelectorAll('script,style').forEach(t=>t.remove());
      const text=norm(now.body.textContent);
      return [...(old?.querySelectorAll('p,h1,h2,h3,h4,li')||[])].map(t=>norm(t.textContent)).filter(t=>t.length>15&&!text.includes(t));
    },{original,current});
    expect(missing,route).toEqual([]);
  }
});

for (const width of [390,768,1440]) {
  test(`all preserved pages fit at ${width}px`,async({page})=>{
    test.setTimeout(120000);
    await page.setViewportSize({width,height:900});
    for (const route of Object.keys(originals)) {
      await page.goto(route,{waitUntil:'load'});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBeTruthy();
    }
  });
}
