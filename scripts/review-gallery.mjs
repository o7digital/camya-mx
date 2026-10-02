import fs from 'node:fs';
import {chromium} from '@playwright/test';
const root='verification/clone-complete';
const report=JSON.parse(fs.readFileSync(root+'/report.json','utf8'));
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const css='body{margin:0;padding:20px;font:15px Arial;background:#eee;color:#222}h1{font-size:22px}section{padding:10px;background:white;margin-bottom:16px}h2{font-size:16px;margin:0 0 8px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}.pair img{display:block;width:100%;height:300px;object-fit:contain;background:#fafafa}.pair strong{display:block;margin:6px 0}.top img{object-fit:cover;object-position:top}a{color:#155391}';
const section=row=>`<section><h2>${escape(row.route)} — ${row.width}px · Différence ${((row.differenceRatio||0)*100).toFixed(4)}%</h2><div class="pair"><div><strong>Original</strong><a href="${row.folder.replace(root+'/','')}/original.png"><img src="${row.folder.replace(root+'/','')}/original.png"></a></div><div><strong>Clone</strong><a href="${row.folder.replace(root+'/','')}/clone.png"><img src="${row.folder.replace(root+'/','')}/clone.png"></a></div></div></section>`;
fs.writeFileSync(root+'/index.html',`<!doctype html><meta charset="utf-8"><title>CAMYA — comparaisons de toutes les pages</title><style>${css}</style><h1>Comparaisons de toutes les pages : original et clone</h1><p>Cliquer sur une capture pour l'examiner en taille réelle.</p>${report.sort((a,b)=>a.width-b.width||a.route.localeCompare(b.route)).map(section).join('')}`);
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1600,height:1500}});
fs.mkdirSync(root+'/sheets',{recursive:true});
for(const width of [390,1440]){
  const rows=report.filter(x=>x.width===width).sort((a,b)=>a.route.localeCompare(b.route));
  for(let i=0;i<rows.length;i+=4){
    const html=`<!doctype html><meta charset="utf-8"><style>${css}</style><h1>CAMYA — Original / Clone · ${width}px · Pages ${i+1}–${Math.min(i+4,rows.length)}</h1>${rows.slice(i,i+4).map(section).join('')}`;
    const file=root+`/sheet-${width}-${i}.html`;fs.writeFileSync(file,html);
    await page.goto('file://'+process.cwd()+'/'+file);
    await page.screenshot({path:root+`/sheets/${width}-${String(i).padStart(2,'0')}.png`,fullPage:true});
    fs.unlinkSync(file);
  }
}
await browser.close();
console.log('Review gallery and paired visual sheets generated.');
