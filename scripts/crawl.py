"""Capture the public site, preserving routes and localizing its resources.
Run with requests and beautifulsoup4 installed. Never accesses WP administration.
"""
import concurrent.futures, json, re, time
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src' / 'legacy'
ASSETS = ROOT / 'public'
ARCHIVE = ROOT / 'archive'
BASE = 'http://www.camya.mx'
RAW = Path('/tmp/camya-live-originals')
FORMS = json.loads((ARCHIVE / 'rendered-forms.json').read_text())
HOSTS = {'www.camya.mx', 'camya.mx'}
URL_RE = re.compile(r'https?://(?:www\.)?camya\.mx[^\s<>"\x27)\\]*')
failures, pages, assets, technical = [], {}, {}, []

def get(url):
    for attempt in range(3):
        try:
            r = requests.get(url, timeout=35)
            r.raise_for_status()
            return r
        except requests.RequestException as e:
            if attempt == 2:
                failures.append({'url': url, 'error': str(e)})
                return None
            time.sleep(.5)

def local(url):
    p = urlsplit(url.replace('\\/', '/'))
    return unquote(p.path or '/') + (('#' + p.fragment) if p.fragment else '')

def discover_assets(text, base):
    found = set(URL_RE.findall(text.replace('\\/', '/').replace('&amp;', '&')))
    for match in re.findall(r'url\(\s*["\x27]?([^\s)"\x27]+)', text):
        if not match.startswith('data:'):
            found.add(urljoin(base, match))
    for match in re.findall(r'@import\s+["\x27]([^"\x27]+)', text):
        found.add(urljoin(base, match))
    return {BASE + urlsplit(u).path for u in found
            if urlsplit(u).hostname in HOSTS and
            urlsplit(u).path.startswith(('/wp-content/', '/wp-includes/'))}

def rewrite(text):
    text = URL_RE.sub(lambda m: local(m.group()), text)
    return re.sub(r'https?:\\/\\/(?:www\.)?camya\.mx', '', text)

def safe_page(html, url):
    soup = BeautifulSoup(html, 'html.parser', on_duplicate_attribute='ignore')
    english = '/en/' in url
    # Public styling is kept. Server-backed plugins and unrelated hidden embeds are removed.
    for tag in soup.select('iframe, link[rel="canonical"], link[rel="https://api.w.org/"], link[rel="alternate"][type], link[rel="EditURI"]'):
        tag.decompose()
    for tag in soup.select('script'):
        src, text = tag.get('src', ''), tag.get_text()
        if any(s in src for s in ('contact-form-7', 'ninja-forms', 'popup-builder')) or any(s in text for s in ('nfFrontEnd', 'nfi18n', 'wpcf7', 'ajaxNonce')):
            tag.decompose()
    # Use the original rendered field DOM and CSS, with no server submission backend.
    for wrap in soup.select('[id^="nf-form-"][id$="-cont"]'):
        if wrap.get('id') in FORMS:
            wrap.replace_with(BeautifulSoup(FORMS[wrap['id']], 'html.parser'))
            for script in soup.find_all('script', string=re.compile('form.fields=')):
                script.decompose()
            continue
        script = soup.find('script', string=re.compile('form.fields='))
        if script:
            match = re.search(r'form.fields=(\[.*?\]);nfForms', script.get_text(), re.S)
            if match:
                fields = json.loads(match.group(1))
                form = soup.new_tag('form', attrs={'class': 'local-contact-form'})
                for field in fields:
                    if field['type'] == 'submit':
                        continue
                    label = soup.new_tag('label')
                    label_text = soup.new_tag('span', attrs={'class': 'screen-reader-text'})
                    label_text.string = field['label']
                    label.append(label_text)
                    name = field.get('key', str(field['id']))
                    attrs = {'name': name, 'required': ''} if str(field.get('required')) == '1' else {'name': name}
                    if field['type'] == 'textarea':
                        attrs['rows'] = '5'
                        input_tag = soup.new_tag('textarea', attrs=attrs)
                    else:
                        attrs['type'] = 'email' if field['type'] == 'email' else 'text'
                        input_tag = soup.new_tag('input', attrs=attrs)
                    input_tag['placeholder'] = field.get('placeholder') or field['label']
                    label.append(input_tag)
                    form.append(label)
                button = soup.new_tag('button', attrs={'type': 'submit', 'class': 'theme-button'})
                button.string = next((f['label'] for f in fields if f['type']=='submit'), 'Submit' if english else 'Enviar')
                form.append(button)
                wrap.clear()
                wrap.append(form)
                script.decompose()
    for tag in soup.select('noscript.ninja-forms-noscript-message, script[type="text/template"]'):
        tag.decompose()
    for tag in soup.select('input[name*="nonce"], input[name^="_wpcf7"]'):
        tag.decompose()
    # Keep a single original footer; never append an additional footer component.
    footers = soup.select('footer#footer')
    for footer in footers[1:]:
        footer.decompose()
    for tag in soup.select('meta[name="robots"]'):
        tag.decompose()
    if soup.head:
        soup.head.append(soup.new_tag('meta', attrs={'name': 'robots', 'content': 'noindex,nofollow'}))
        soup.head.append(soup.new_tag('link', attrs={'rel': 'stylesheet', 'href': '/clone-support.css'}))
    if soup.body:
        soup.body.append(soup.new_tag('script', attrs={'src': '/clone-support.js', 'defer': ''}))
    return rewrite(str(soup))

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    ARCHIVE.mkdir(exist_ok=True)
    RAW.mkdir(exist_ok=True)
    sitemap = get(BASE + '/wp-sitemap.xml')
    queue = {BASE + '/', BASE + '/en/'}
    for child in re.findall(r'<loc>(.*?)</loc>', sitemap.text):
        r = get(child)
        if not r: continue
        urls = re.findall(r'<loc>(.*?)</loc>', r.text)
        if 'popupbuilder' in child:
            technical.extend(urls)
        else:
            queue.update(urls)
    seen, pending_assets = set(), set()
    while queue:
        batch = sorted(queue - seen)
        queue.clear()
        if not batch: break
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            results = list(pool.map(get, batch))
        for url, r in zip(batch, results):
            seen.add(url)
            if r is None: continue
            html = r.content.decode('utf-8', errors='replace')
            import hashlib
            (RAW / (hashlib.sha256(url.encode()).hexdigest() + '.html')).write_text(html)
            soup = BeautifulSoup(html, 'html.parser', on_duplicate_attribute='ignore')
            path = unquote(urlsplit(url).path)
            if path != '/' and not path.endswith('/'):
                path += '/'
            target = OUT / path.lstrip('/') / 'index.html'
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(safe_page(html, url))
            pending_assets.update(discover_assets(html, url))
            for tag in soup.select('[src], [srcset], link[href]'):
                for attr in ('src', 'href', 'srcset'):
                    value = tag.get(attr, '')
                    pending_assets.update(discover_assets(value, url))
            content = soup.select_one('#content') or soup.select_one('main') or soup.body
            pages[path] = {'url': url, 'path': path, 'title': soup.title.get_text() if soup.title else '',
                           'lang': soup.html.get('lang', '') if soup.html else '',
                           'content_html': rewrite(str(content)), 'text': content.get_text(' ', strip=True),
                           'language_links': {a.get('lang', a.get('hreflang', '')): local(a['href']) for a in soup.select('a[hreflang]')},
                           'status': r.status_code}
            for a in soup.select('a[href]'):
                u = urlsplit(urljoin(url, a['href']))
                p = unquote(u.path)
                if u.hostname in HOSTS and not u.query and not p.startswith(('/wp-', '/feed', '/comments', '/popupbuilder/')) and not re.search(r'\.[a-zA-Z0-9]{2,5}$', p) and not p.endswith('/feed/'):
                    queue.add(BASE + (p or '/'))
        print(f'Pages: {len(pages)}, remaining: {len(queue - seen)}', flush=True)
    downloaded = set()
    while pending_assets - downloaded:
        batch = sorted(pending_assets - downloaded)
        with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
            results = list(pool.map(get, batch))
        for url, r in zip(batch, results):
            downloaded.add(url)
            if r is None: continue
            path = unquote(urlsplit(url).path)
            target = ASSETS / path.lstrip('/')
            target.parent.mkdir(parents=True, exist_ok=True)
            if path.endswith(('.css', '.js', '.svg')):
                text = r.content.decode('utf-8', errors='replace')
                pending_assets.update(discover_assets(text, url))
                # Preserve relative CSS URLs; the original asset directory structure is retained.
                target.write_text(rewrite(text))
            else:
                target.write_bytes(r.content)
            assets[path] = {'url': url, 'bytes': len(r.content)}
        print(f'Assets: {len(assets)}, remaining: {len(pending_assets - downloaded)}', flush=True)
    (ARCHIVE / 'pages.json').write_text(json.dumps(pages, ensure_ascii=False, indent=2))
    (ARCHIVE / 'crawl-report.json').write_text(json.dumps({'pages': len(pages), 'assets': len(assets), 'failures': failures, 'technical_popup_urls': technical, 'assets_inventory': assets}, ensure_ascii=False, indent=2))
    (ARCHIVE / 'clone-html.json').write_text(json.dumps({route:(OUT/route.lstrip('/')/'index.html').read_text() for route in pages}, ensure_ascii=False, indent=2))
    print(f'Finished: {len(pages)} pages, {len(assets)} assets, {len(failures)} failed downloads')

if __name__ == '__main__': main()
