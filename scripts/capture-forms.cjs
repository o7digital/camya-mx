// Capture the original browser-rendered public forms without server tokens.
const {chromium}=require('@playwright/test');
const fs=require('node:fs');
(async()=>{
  const browser=await chromium.launch();
  const forms={};
  for (const route of ['/','/en/home/']) {
    const page=await browser.newPage();
    await page.goto('http://www.camya.mx'+route,{waitUntil:'networkidle',timeout:45000});
    for (const container of await page.locator('.nf-form-cont').all()) {
      const record=await container.evaluate(element=>{
        const copy=element.cloneNode(true);
        copy.querySelectorAll('script,input[name*="nonce"],input[name="nf-field-hp"]').forEach(e=>e.remove());
        const form=copy.querySelector('form');
        if (!form) throw Error('Original form did not render');
        form.classList.add('local-contact-form');
        form.removeAttribute('action');form.removeAttribute('method');
        return {id:copy.id,html:copy.outerHTML};
      });
      forms[record.id]=record.html;
    }
    await page.close();
  }
  fs.writeFileSync('archive/rendered-forms.json',JSON.stringify(forms,null,2)+'\n');
  console.log('Captured original forms:',Object.keys(forms));
  await browser.close();
})();
