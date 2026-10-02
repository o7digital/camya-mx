"""Apply the supplied design to every preserved public route.
Content is taken from the verified clone, never regenerated or summarized.
"""
import copy, json, re, shutil
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
REF = ROOT / 'reference-new-design'
PAGES = json.loads((ROOT / 'archive/pages.json').read_text())
EN = json.loads((REF / 'translations.json').read_text())['en']
TEMPLATE = (REF / 'dist/index.html').read_text()

def parse(html):
    return BeautifulSoup(html, 'html.parser', on_duplicate_attribute='ignore')

def semantic(html):
    soup = parse(html)
    for tag in soup.select('script, style, noscript, iframe, [id^="nf-form-"], .vcex-spacing, .wpex-post-edit, .post-edit, .post-edit-link'):
        tag.decompose()
    # Existing profile accordions become native keyboard-accessible details.
    for panel in soup.select('.vc_tta-accordion .vc_tta-panel'):
        heading, body = panel.select_one('.vc_tta-panel-title'), panel.select_one('.vc_tta-panel-body')
        if not heading or not body: continue
        details = soup.new_tag('details', attrs={'class': 'content-detail', 'id': panel.get('id', '')})
        if 'vc_active' in panel.get('class', []): details['open'] = ''
        summary = soup.new_tag('summary')
        summary.string = heading.get_text(' ', strip=True)
        details.append(summary)
        body['class'] = ['detail-body']
        details.append(body.extract())
        panel.replace_with(details)
    # Retain tab titles, groups and every profile in the team pages.
    for group in soup.select('.vc_tta-tabs'):
        tabs = group.select('.vc_tta-tabs-list a')
        panels = group.select('.vc_tta-panel')
        if not tabs: continue
        wrapper = soup.new_tag('div', attrs={'class': 'content-tabs'})
        controls = soup.new_tag('div', attrs={'class': 'tab-controls', 'role': 'tablist'})
        for index, tab in enumerate(tabs):
            ident = tab['href'].lstrip('#')
            button = soup.new_tag('button', attrs={'type': 'button', 'role': 'tab', 'id': 'tab-' + ident, 'aria-controls': ident, 'aria-selected': 'true' if index == 0 else 'false', 'tabindex': '0' if index == 0 else '-1'})
            button.string = tab.get_text(' ', strip=True)
            controls.append(button)
        wrapper.append(controls)
        for index, panel in enumerate(panels):
            body = panel.select_one('.vc_tta-panel-body')
            pane = soup.new_tag('div', attrs={'class': 'tab-pane', 'id': panel['id'], 'role': 'tabpanel', 'aria-labelledby': 'tab-' + panel['id']})
            if index: pane['hidden'] = ''
            if body:
                # Profile links and their pictures are retained without WP column nesting.
                cards = soup.new_tag('div', attrs={'class': 'directory-grid'})
                seen = set()
                for row in body.select('.vc_row'):
                    profile = row.select_one('a[href*="/staff-member/"]')
                    picture = row.select_one('img')
                    if profile and picture and profile['href'] not in seen:
                        seen.add(profile['href'])
                        card = soup.new_tag('a', attrs={'class': 'directory-person', 'href': profile['href']})
                        card.append(copy.copy(picture))
                        label = soup.new_tag('strong');label.string = profile.get_text(' ', strip=True)
                        card.append(label);cards.append(card)
                if seen: pane.append(cards)
                else: pane.append(copy.copy(body))
            wrapper.append(pane)
        group.replace_with(wrapper)
    for tag in list(soup.find_all(True)):
        classes = tag.get('class', [])
        preserved = [c for c in classes if c in {'content-detail','detail-body','content-tabs','tab-controls','tab-pane','directory-grid','directory-person'}]
        for attr in list(tag.attrs):
            if attr in {'style', 'class', 'width', 'height', 'sizes'} or attr.startswith('data-'):
                del tag[attr]
        if preserved: tag['class'] = preserved
        if tag.name == 'img':
            tag['loading'] = 'lazy'
            if not tag.get('alt'): tag['alt'] = ''
        if tag.name == 'a' and tag.get('href', '').startswith('www.camya.mx'):
            tag['href'] = '/'
        if tag.name == 'i' and not tag.get_text(strip=True): tag.decompose()
    # Discard empty decorative wrappers, preserving every nonempty text node and image.
    for tag in reversed(soup.find_all(['div','span','figure'])):
        if not tag.get_text(strip=True) and not tag.find(['img','input','textarea','a']):
            tag.decompose()
    return str(soup)

def shell(english, route, counterpart):
    soup = parse(TEMPLATE)
    if english:
        for tag in soup.select('[data-i18n]'):
            if tag['data-i18n'] in EN:
                tag.clear();tag.append(parse(EN[tag['data-i18n']]))
    soup.html['lang'] = 'en-US' if english else 'es-MX'
    for tag in soup.select('[data-i18n]'): del tag['data-i18n']
    for tag in soup.select('[src], [href]'):
        for attr in ['src', 'href']:
            value = tag.get(attr, '')
            if value.startswith(('assets/','styles.css','app.js')): tag[attr] = '/' + value
    home = '/en/home/' if english else '/'
    routes = {'#inicio': home, '#servicios': '/en/pratic-areas/' if english else '/areas-de-practica/', '#nosotros': '/en/the-firm/' if english else '/la-firma/', '#equipo': '/en/team/' if english else '/equipo/', '#contacto': home + '#contacto', '#sectores': home + '#sectores'}
    for a in soup.select('a[href]'):
        if a['href'] in routes: a['href'] = routes[a['href']]
    nav = soup.select_one('#navigation')
    for a in nav.select('a'): a.attrs.pop('class', None)
    news = soup.new_tag('a', attrs={'href': '/en/news/' if english else '/noticias/'})
    news.string = 'News' if english else 'Noticias'
    nav.insert(4, news)
    nav['aria-label'] = 'Main navigation' if english else 'Navegación principal'
    button = soup.select_one('#language')
    button['data-url'] = counterpart
    button.clear();button.append(parse('EN <span>/ ES</span>' if english else 'ES <span>/ EN</span>'))
    button['aria-label'] = 'Cambiar a español' if english else 'Switch to English'
    soup.select_one('#menu')['aria-label'] = 'Open menu' if english else 'Abrir menú'
    soup.select_one('.brand')['aria-label'] = 'CAMYA Abogados, home' if english else 'CAMYA Abogados, inicio'
    soup.select_one('.dialog-close')['aria-label'] = 'Close' if english else 'Cerrar'
    for button in soup.select('[data-legal]'):
        href = ('/en/notice-of-privacy/' if english else '/aviso-de-privacidad/') if button['data-legal']=='privacy' else ('/en/terms-and-conditions/' if english else '/terminos-y-condiciones/')
        link = soup.new_tag('a', attrs={'class': 'text-button', 'href': href})
        link.string = button.get_text();button.replace_with(link)
    link = soup.new_tag('link', attrs={'rel': 'stylesheet', 'href': '/pages.css'});soup.head.append(link)
    soup.select_one('script[src="/app.js"]')['src'] = '/site.js'
    # Keep links to the complete original profile from each supplied summary dialog.
    for person in soup.select('[data-person]'):
        route_es = {'omar':'omar-cuellar-gamboa','roberto':'roberto-p-serra-montes-de-oca','rafael':'rafael-benitez-fabregas','ilian':'ilian-munguia-garcia','jose':'jose-luis-roldan-ortega'}[person['data-person']]
        person['data-profile-url'] = '/en/staff-member/' + route_es + '-en/' if english else '/staff-member/' + route_es + '/'
    return soup

def main():
    shutil.copytree(REF/'dist/assets',DIST/'assets',dirs_exist_ok=True)
    shutil.copy2(REF/'dist/styles.css',DIST/'styles.css')
    # Sanitize content once, before overwriting any clone pages.
    originals = json.loads((ROOT/'archive/clone-html.json').read_text())
    contents = {}
    for route, html in originals.items():
        old = parse(html)
        contents[route] = semantic(str(old.select_one('#content') or old.select_one('main')))
    (ROOT/'archive/content-preserved.json').write_text(json.dumps(contents,ensure_ascii=False,indent=2))
    for route, record in PAGES.items():
        english = record['lang'].startswith('en') or route.startswith('/en/')
        pair = record['language_links'].get('es-MX' if english else 'en-US', '/' if english else '/en/home/')
        if pair not in PAGES: pair = '/' if english else '/en/home/'
        soup = shell(english, route, pair)
        old = parse(originals[route])
        title = old.select_one('.page-header-title') or old.select_one('h1')
        title = title.get_text(' ',strip=True) if title else re.sub(r'\s*[–|\-]\s*CAMYA.*', '', record['title'],flags=re.I)
        homepage = route in {'/','/en/','/en/home/'}
        if not homepage:
            contact_form = copy.copy(soup.select_one('#contact-form')) if route in {'/contacto/','/en/contact/'} else None
            main = soup.select_one('main');main.clear()
            hero = soup.new_tag('section',attrs={'class':'page-hero'})
            container = soup.new_tag('div',attrs={'class':'container'})
            eyebrow = soup.new_tag('p',attrs={'class':'eyebrow light'});eyebrow.string='CAMYA ABOGADOS'
            heading = soup.new_tag('h1');heading.string=title
            container.append(eyebrow);container.append(heading);hero.append(container);main.append(hero)
            section = soup.new_tag('section',attrs={'class':'section'})
            body = soup.new_tag('div',attrs={'class':'container rich-content'});body.append(parse(contents[route]))
            section.append(body);main.append(section)
            if contact_form:
                contact_form.attrs = {'class':'page-contact-form'}
                label = soup.new_tag('label');span = soup.new_tag('span');span.string = 'Position' if english else 'Cargo';label.append(span)
                label.append(soup.new_tag('input',attrs={'name':'position','autocomplete':'organization-title'}))
                contact_form.select_one('.form-row').insert_after(label)
                body.append(contact_form)
            soup.select_one('#profile-dialog').decompose()
        else:
            # Original homepage copy remains public and intact, without displacing the supplied hero.
            details = soup.new_tag('details',attrs={'class':'homepage-copy'})
            summary = soup.new_tag('summary');summary.string='More about CAMYA' if english else 'Más sobre CAMYA'
            details.append(summary)
            content = soup.new_tag('div',attrs={'class':'rich-content'});content.append(parse(contents[route]));details.append(content)
            soup.select_one('.firm-copy').append(details)
            # Keep the original job-title field alongside the supplied name/company fields.
            label = soup.new_tag('label');span=soup.new_tag('span');span.string='Position' if english else 'Cargo';label.append(span)
            label.append(soup.new_tag('input',attrs={'name':'position','autocomplete':'organization-title'}))
            soup.select_one('#contact-form .form-row').insert_after(label)
            team_link = soup.new_tag('a',attrs={'class':'button outline dark-outline','href':'/en/team/' if english else '/equipo/'})
            team_link.string='Meet the entire team' if english else 'Conoce a todo el equipo'
            soup.select_one('.team-grid').insert_after(team_link)
            # Forms on the clone use these exact original fields; retain them if present.
        for form in old.select('.local-contact-form'):
            if not homepage:
                form.attrs={'class':'page-contact-form'}
                for span in form.select('.screen-reader-text'): span.attrs={}
                for button in form.select('button'):button['class']='button'
                soup.select_one('.rich-content').append(copy.copy(form))
        # The legal footer copy and contact details of the public site are retained.
        old_footer = old.select_one('#footer')
        if old_footer:
            extra = soup.new_tag('div',attrs={'class':'container original-footer rich-content'})
            extra.append(parse(semantic(str(old_footer))))
            for img in extra.select('img'):img.decompose()
            soup.select_one('.footer-bottom').insert_before(extra)
        soup.title.string = record['title'] if not homepage else ('CAMYA Abogados | Strategic legal advice for businesses' if english else 'CAMYA Abogados | Asesoría legal estratégica para empresas')
        target = DIST/route.lstrip('/')/'index.html';target.write_text(str(soup))
    print(f'Redesigned {len(PAGES)} routes; original text preserved in archive/content-preserved.json')

if __name__ == '__main__': main()
