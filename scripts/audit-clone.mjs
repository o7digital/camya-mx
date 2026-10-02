import {chromium} from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';

const inventory=JSON.parse(fs.readFileSync('archive/pages.json','utf8'));
const destination='verification/clone-complete';
fs.mkdirSync(destination,{recursive:true});
const browser=await chromium.launch();
const results=[];
const normal=t=>t.replace(/\s+/g,' ').trim();

async function capture(page,origin,route,file) {
  const errors=[], failures=[];
  const onError=e=>errors.push(e.message), onResponse=r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()});};
  page.on('pageerror',onError);page.on('response',onResponse);
  try {
    const response=await page.goto(origin+route,{waitUntil:'load',timeout:45000});
    if (!response?.ok()) throw Error('Original page response: '+response?.status());
    await page.evaluate(async()=>{
      for(let y=0;y<document.body.scrollHeight;y+=650){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,40));}
      scrollTo({top:0,behavior:'instant'});
      await document.fonts.ready;
    });
    await page.waitForFunction(()=>[...document.images].filter(i=>i.checkVisibility()).every(i=>i.complete),{},{timeout:10000}).catch(()=>{});
    await page.evaluate(async()=>{await Promise.all([...document.images].filter(i=>i.checkVisibility()&&i.complete&&i.naturalWidth).map(i=>i.decode().catch(()=>{})));});
    await page.waitForTimeout(1200);
    await page.screenshot({path:file,fullPage:true,animations:'disabled'});
    const state=await page.evaluate(()=>({
      title:document.title,
      text:(document.querySelector('#content')||document.body).innerText,
      footerCount:document.querySelectorAll('footer#footer').length,
      bottomCount:document.querySelectorAll('#footer-bottom').length,
      overflow:document.documentElement.scrollWidth>innerWidth,
      missingImages:[...document.images].filter(i=>i.checkVisibility()&&(!i.complete||!i.naturalWidth)).map(i=>i.src),
      headings:[...document.querySelectorAll('h1,h2,h3,h4')].filter(e=>e.checkVisibility()).map(e=>e.innerText),
      paragraphs:[...document.querySelectorAll('#content p,#content li')].filter(e=>e.checkVisibility()).map(e=>e.innerText),
    }));
    return {status:response.status(),errors,failures,...state};
  } catch(e) {return {error:e.message,errors,failures};}
  finally {page.off('pageerror',onError);page.off('response',onResponse);}
}

function diff(aFile,bFile,output) {
  const a=PNG.sync.read(fs.readFileSync(aFile)),b=PNG.sync.read(fs.readFileSync(bFile));
  const width=Math.max(a.width,b.width),height=Math.max(a.height,b.height);
  const canvas=png=>{const out=new PNG({width,height});out.data.fill(255);PNG.bitblt(png,out,0,0,png.width,png.height,0,0);return out;};
  const aa=canvas(a),bb=canvas(b),difference=new PNG({width,height});
  const pixels=pixelmatch(aa.data,bb.data,difference.data,width,height,{threshold:.12,includeAA:false});
  if(pixels)fs.writeFileSync(output,PNG.sync.write(difference));
  else if(fs.existsSync(output))fs.unlinkSync(output);
  return {originalSize:[a.width,a.height],cloneSize:[b.width,b.height],differentPixels:pixels,differenceRatio:pixels/(width*height),exactPixelsMatch:a.width===b.width&&a.height===b.height&&a.data.equals(b.data)};
}

const routes=Object.keys(inventory).filter(r=>!process.env.AUDIT_ROUTES||process.env.AUDIT_ROUTES.split(',').includes(r));
const old=fs.existsSync(destination+'/report.json')?JSON.parse(fs.readFileSync(destination+'/report.json')):[];
const widths=process.env.AUDIT_WIDTHS?process.env.AUDIT_WIDTHS.split(',').map(Number):[390,1440];
await Promise.all(widths.map(async width=>{
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const original=await ctx.newPage(),clone=await ctx.newPage();
  await original.route('**/div.show/**',r=>r.abort());
  for(const [index,route] of routes.entries()){
    const slug=route==='/'?'home':route.replace(/^\//,'').replaceAll('/','__').replace(/__$/,'');
    const folder=path.join(destination,`${width}`,slug);fs.mkdirSync(folder,{recursive:true});
    const a=path.join(folder,'original.png'),b=path.join(folder,'clone.png');
    const source=await capture(original,'http://www.camya.mx',route,a);
    const copy=await capture(clone,process.env.TEST_URL||'http://127.0.0.1:8000',route,b);
    const result={route,width,folder,source,clone:copy};
    if(!source.error&&!copy.error){
      Object.assign(result,diff(a,b,path.join(folder,'difference.png')));
      result.textMatches=normal(source.text)===normal(copy.text);
      result.missingParagraphs=source.paragraphs.filter(t=>!normal(copy.text).includes(normal(t)));
    }
    results.push(result);
    fs.writeFileSync(destination+'/report.json',JSON.stringify([...old.filter(x=>!routes.includes(x.route)||!widths.includes(x.width)),...results],null,2));
    console.log(`${width} ${index+1}/${routes.length} ${route} ${result.source.error||((result.differenceRatio*100).toFixed(3)+'%')} text:${result.textMatches}`);
  }
  await ctx.close();
}));
await browser.close();
console.log('Full visual audit saved in '+destination);
