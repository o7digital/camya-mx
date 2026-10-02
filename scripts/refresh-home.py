"""Apply the approved homepage brief to the validated clone, keeping its content."""
import json
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
ORIGINALS = json.loads((ROOT / 'archive/clone-html.json').read_text())

COPY = {
    'es': {
        'home': '/', 'practice': '/areas-de-practica/', 'firm': '/la-firma/',
        'team': '/equipo/', 'contact': '/#contacto', 'anchor': 'contacto',
        'labels': ['Inicio', 'Servicios', 'Nosotros', 'Sectores', 'Equipo', 'Contacto'],
        'consult': 'Consulta', 'lang': 'EN', 'language_url': '/en/home/',
        'language_label': 'Versión en inglés', 'hreflang': 'en-US',
        'menu': 'Abrir menú', 'navigation': 'Navegación principal',
        'title': 'Asesoría Legal que sí entiende tu negocio',
        'subtitle': 'Más de 10 años protegiendo a empresas, acompañando su crecimiento con asesoría estratégica y confiable',
        'recognition': 'RECONOCIDOS POR',
    },
    'en': {
        'home': '/en/home/', 'practice': '/en/pratic-areas/', 'firm': '/en/the-firm/',
        'team': '/en/team/', 'contact': '/en/home/#contactus', 'anchor': 'contactus',
        'labels': ['Home', 'Services', 'About Us', 'Sectors', 'Our Team', 'Contact'],
        'consult': 'Consultation', 'lang': 'ES', 'language_url': '/',
        'language_label': 'Spanish version', 'hreflang': 'es-MX',
        'menu': 'Open menu', 'navigation': 'Main navigation',
        'title': 'Legal advice that truly understands your business',
        'subtitle': 'More than 10 years protecting businesses, supporting their growth with strategic and reliable legal advice',
        'recognition': 'RECOGNIZED BY',
    },
}

def fragment(markup):
    return BeautifulSoup(markup, 'html.parser')

for route in ['/', '/en/', '/en/home/']:
    soup = BeautifulSoup(ORIGINALS[route], 'html.parser')
    language = 'en' if route.startswith('/en/') else 'es'
    c = COPY[language]
    soup.body['class'] = [x for x in soup.body.get('class', []) if x != 'has-overlay-header'] + ['camya-home-refresh']
    soup.head.append(soup.new_tag('link', rel='stylesheet', href='/home.css'))
    soup.head.append(soup.new_tag('link', attrs={'rel': 'preload', 'href': '/home-assets/hero-montanas.webp', 'as': 'image'}))
    soup.head.append(soup.new_tag('link', attrs={'rel': 'preload', 'href': '/home-assets/InterVariable.woff2', 'as': 'font', 'type': 'font/woff2', 'crossorigin': ''}))
    soup.body.append(soup.new_tag('script', src='/home.js', defer=''))

    destinations = [c['home'], c['practice'], c['firm'], c['practice'] + '#content', c['team'], c['contact']]
    links = ''.join(f'<a href="{href}"' + (' aria-current="page"' if index == 0 else '') + f'>{label}</a>'
                    for index, (label, href) in enumerate(zip(c['labels'], destinations)))
    header = fragment(f'''
    <header id="site-header" class="camya-header">
      <div class="camya-header-inner">
        <a class="camya-brand" href="{c['home']}" aria-label="CAMYA Abogados — {c['labels'][0]}">
          <img src="/wp-content/uploads/2026/10/logoblanco_nvo.svg" width="205" height="50" alt="CAMYA Abogados"/>
        </a>
        <nav id="home-navigation" class="camya-navigation" aria-label="{c['navigation']}">{links}</nav>
        <div class="camya-header-actions">
          <a class="camya-language" href="{c['language_url']}" hreflang="{c['hreflang']}" lang="{c['hreflang']}" aria-label="{c['language_label']}">{c['lang']}</a>
          <a class="camya-button camya-consult" href="{c['contact']}">{c['consult']}</a>
          <button class="camya-menu-toggle" type="button" aria-controls="home-navigation" aria-expanded="false" aria-label="{c['menu']}"><span></span><span></span><span></span></button>
        </div>
      </div>
    </header>''').header
    soup.select_one('#site-header').replace_with(header)

    # Keep the original contact details and social links in the existing footer,
    # so the homepage starts with the single navigation band in the reference.
    top_bar = soup.select_one('#top-bar-wrap')
    if top_bar:
        soup.select_one('footer#footer').insert(0, top_bar.extract())

    hero = fragment(f'''
    <section class="camya-hero" aria-labelledby="home-title">
      <img class="camya-hero-image" src="/home-assets/hero-montanas.webp" alt="" width="2043" height="770" fetchpriority="high"/>
      <div class="camya-hero-overlay"></div>
      <div class="camya-home-container camya-hero-content">
        <h1 id="home-title">{c['title']}</h1>
        <p class="camya-hero-description">{c['subtitle']}</p>
      </div>
    </section>''').section
    recognition = fragment(f'''
    <section class="camya-recognition" aria-labelledby="recognition-title">
      <div class="camya-home-container">
        <h2 id="recognition-title">{c['recognition']}</h2>
        <div class="camya-recognition-capsule">
          <span class="camya-mark camya-mark-chambers"><img src="/home-assets/chambers.jpeg" alt="Chambers and Partners" width="1600" height="430"/></span>
          <span class="camya-mark camya-mark-wwl"><img src="/home-assets/wwl.jpeg" alt="WWL — Who's Who Legal (actualmente Lexology)" width="1584" height="520"/></span>
          <span class="camya-mark camya-mark-legal500"><img src="/home-assets/legal500.jpeg" alt="Legal 500" width="1600" height="524"/></span>
        </div>
      </div>
    </section>''').section
    main = soup.select_one('#main')
    main.insert(0, recognition)
    main.insert(0, hero)

    # Move the existing hero copy below the new recognition block, without rewriting it.
    old_hero = soup.select_one('.wpb-content-wrapper > .vc_row')
    intro = soup.new_tag('section', attrs={'class': 'camya-original-intro'})
    for original in old_hero.select('.wpb_text_column'):
        intro.append(original.extract())
    old_hero.replace_with(intro)
    contact = soup.select_one(f'[data-ls_id="#{c["anchor"]}"]')
    if contact:
        contact['id'] = c['anchor']
    target = ROOT / 'src' / 'legacy' / route.lstrip('/') / 'index.html'
    target.write_text(str(soup))
    print('Refreshed', route)
