const english = document.documentElement.lang.startsWith('en');
const menuButton = document.querySelector('#menu');
const nav = document.querySelector('#navigation');
const languageButton = document.querySelector('#language');
languageButton.addEventListener('click', () => { window.location.href = languageButton.dataset.url; });
function setMenu(open) {
  nav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', english ? (open ? 'Close menu' : 'Open menu') : (open ? 'Cerrar menú' : 'Abrir menú'));
}
menuButton.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuButton.focus(); }
});
nav.querySelectorAll('a').forEach(link => {
  if (link.getAttribute('href').split('#')[0] === location.pathname && !link.hash) {
    link.classList.add('active'); link.setAttribute('aria-current', 'page');
  }
});
document.querySelectorAll('.content-tabs').forEach(group => {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  function select(tab, focus) {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = tabs[(index+1)%tabs.length];
      if (event.key === 'ArrowLeft') target = tabs[(index+tabs.length-1)%tabs.length];
      if (event.key === 'Home') target = tabs[0];
      if (event.key === 'End') target = tabs.at(-1);
      if (target) { event.preventDefault(); select(target,true); }
    });
  });
});
const profiles={omar:{name:'Omar Cuéllar Gamboa',es:'Litigio civil y mercantil, reestructuras, concursos mercantiles y arbitraje.',en:'Civil and commercial litigation, restructuring, insolvency proceedings and arbitration.'},roberto:{name:'Roberto P. Serra Montes de Oca',es:'Derecho procesal constitucional, juicio de amparo y controversias constitucionales.',en:'Constitutional litigation, amparo proceedings and constitutional controversies.'},rafael:{name:'Rafael Benítez Fábregas',es:'Litigio civil, mercantil y familiar; derecho inmobiliario y corporativo; contratos y protección de datos.',en:'Civil, commercial and family litigation; real estate and corporate law; contracts and data protection.'},ilian:{name:'Ilian Munguía García',es:'Litigio administrativo y constitucional, derecho energético, ambiental y contrataciones públicas.',en:'Administrative and constitutional litigation, energy and environmental law, and public procurement.'},jose:{name:'José Luis Roldán Ortega',es:'Litigio civil, mercantil y constitucional.',en:'Civil, commercial and constitutional litigation.'}};
const dialog = document.querySelector('#profile-dialog');
if (dialog) {
  let trigger;
  document.querySelectorAll('[data-person]').forEach(button => button.addEventListener('click', () => {
    trigger = button;
    const key = button.dataset.person, p = profiles[key];
    document.querySelector('#dialog-content').innerHTML = `<img class="dialog-photo" src="/assets/${key}.webp" alt="${p.name}"><p class="dialog-specialty">${english?'PARTNER · PRACTICE AREAS':'SOCIO · ÁREAS DE PRÁCTICA'}</p><h2 id="dialog-title">${p.name}</h2><p>${p[english?'en':'es']}</p><a class="dialog-profile-link" href="${button.dataset.profileUrl}">${english?'Read the full profile':'Ver perfil completo'}</a><br><a href="#contacto" class="button" id="dialog-contact">${english?'Contact the firm':'Contactar a la firma'}</a>`;
    dialog.setAttribute('aria-labelledby','dialog-title');
    dialog.showModal();
    document.querySelector('#dialog-contact').addEventListener('click', () => dialog.close());
  }));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => trigger?.focus({preventScroll:true}));
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) dialog.close();
    }
  });
}
document.querySelectorAll('#contact-form, .page-contact-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const labels = {name:english?'Name':'Nombre',company:english?'Company':'Empresa',position:english?'Position':'Cargo',email:'Email',message:english?'Message':'Mensaje'};
    const body = [...data].map(([key,value]) => `${labels[key] || form.elements.namedItem(key)?.placeholder || key}: ${value}`).join('\n');
    const subject = english ? 'Inquiry from the CAMYA website' : 'Consulta desde el sitio CAMYA';
    window.location.href = 'mailto:info@camya.mx?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
});
