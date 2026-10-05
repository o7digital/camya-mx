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
      // Account for the requested address, directory and social responsibility updates.
      const norm=t=>t.replace('Actualmente se encuentra registrada y reconocida por el directorio especializado “The Legal 500”.', 'Actualmente se encuentra reconocida por los directorios especializados “Chambers and Partners”, “The Legal 500” y “Who´s Who Legal”.').replace('Contact form', 'Contact us').replace("CAMYA is a Law Firm formed by specialists in different areas of Law with a long and successfully professional trajectories within prestigious and leading Firms in Mexico, as well as in transnational companies and in the public sector, which has allowed them to participate in matters with a high level of depth and diligence, as well as sponsor highly complex and considerable amounts litigation cases.", "CAMYA is a law firm made up of specialists in various branches of law with a successful professional trajectory of over 20 years in leading firms in Mexico. Currently, it is recognized by specialized directories such as ‘Chambers and Partners’, ‘The Legal 500’ and ‘Who’s Who Legal’.").replace("with the only purpose of contributing to have a fair society, which is guided under moral values and doing always the right thing for itself and the others, reflecting in this way the type of Firm that we conform and the kind of individuals that we are.", "through a close strategic alliance with Fundación Midas, A.C., whose Advisory Council includes our partner Omar Cuéllar G. as an active member.").replace("SOCIAL RESPONSABILITY", "SOCIAL RESPONSIBILITY").replace("specialized directories such as ‘The Legal 500’", "specialized directories such as ‘Chambers and Partners’, ‘The Legal 500’").replace('con el único propósito de contribuir a tener una sociedad justa, guiada por valores morales y siempre haciendo lo correcto tanto para sí mismos como para los demás. De esta manera, reflejamos el tipo de firma que conformamos y el tipo de individuos que somos.', 'CON UNA ALIANZA ESTRATÉGICA Y MUY ESTRECHA CON FUNDACIÓN MIDAS, A.C., A EN LA QUE NUESTRO SOCIO OMAR CUÉLLAR G. ES MIEMBRO ACTIVO DEL CONSEJO CONSULTIVO.').replace('directorios especializados “The Legal 500”', 'directorios especializados “Chambers and Partners”, “The Legal 500”').replace('Calle Bosque de Radiatas #44, Oficina 101', 'Calle Bosque de Radiatas 32, Oficina 301').replace(/\s+/g,' ').trim();
      old?.querySelectorAll('script,style,noscript,.local-contact-form').forEach(t=>t.remove());
      now.querySelectorAll('script,style').forEach(t=>t.remove());
      const text=norm(now.body.textContent);
      return [...(old?.querySelectorAll('p,h1,h2,h3,h4,li')||[])].map(t=>norm(t.textContent)).filter(t=>t.length>15&&!text.includes(t));
    },{original: route.includes('/omar-cuellar-gamboa') ? original.replace('más de 20 años de experiencia', 'más de 25 años de experiencia').replace('more than 20 years of experience', 'more than 25 years of experience') : original,current});
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
