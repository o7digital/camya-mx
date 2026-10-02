// Interactions owned by CAMYA. No WordPress, jQuery or plugin runtime is needed.
import './home-menu';

const body = document.body;
body.classList.remove('wpex-no-js');
body.classList.add('wpex-js', 'wpex-docready', 'wpex-window-loaded');

// Preserve the approved full-width sections, accounting for real scrollbars.
const stretchRows = () => {
  const width = window.innerWidth - document.documentElement.clientWidth;
  document.querySelectorAll<HTMLElement>('.wpex-vc-full-width-row').forEach(row => {
    row.style.setProperty('--scrollbar-width', `${width}px`);
  });
};
stretchRows();
window.addEventListener('resize', stretchRows, { passive: true });

// Internal-page mobile navigation, using the established drawer styling.
const toggles = [...document.querySelectorAll<HTMLElement>('.mobile-menu-toggle')];
const navigation = document.querySelector('#site-navigation');
if (navigation && toggles.length) {
  const drawer = document.createElement('div');
  drawer.id = 'sidr-main';
  drawer.className = 'sidr sidr-right wpex-surface-dark wpex-mobile-menu';
  drawer.setAttribute('aria-label', 'Mobile menu');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('role', 'dialog');
  drawer.tabIndex = -1;
  drawer.hidden = true;
  const closer = document.createElement('div');
  closer.className = 'sidr-class-wpex-close';
  const closeButton = document.createElement('a');
  closeButton.href = '#';
  closeButton.setAttribute('role', 'button');
  closeButton.setAttribute('aria-label', 'Close mobile menu');
  const closeIcon = document.createElement('span');
  closeIcon.className = 'sidr-class-wpex-close__icon';
  closeIcon.setAttribute('aria-hidden', 'true');
  closeIcon.textContent = '×';
  const closeLabel = document.createElement('span');
  closeLabel.className = 'screen-reader-text';
  closeLabel.textContent = 'Close mobile menu';
  closeButton.append(closeIcon, closeLabel);
  closer.append(closeButton);
  const inner = document.createElement('div');
  inner.className = 'sidr-inner';
  const menu = navigation.querySelector('ul')!.cloneNode(true) as HTMLElement;
  menu.querySelector('.search-toggle-li')?.remove();
  [menu, ...menu.querySelectorAll<HTMLElement>('*')].forEach(node => {
    if (node.id) node.id = `sidr-id-${node.id}`;
    node.className = [...node.classList].map(name => `sidr-class-${name}`).join(' ');
  });
  menu.classList.add('wpex-list-none', 'wpex-m-0', 'wpex-p-0', 'sidr-mobile-nav-menu');
  menu.querySelectorAll('li').forEach(item => {
    item.classList.add('sidr-mobile-nav-menu__item');
    const link = item.querySelector('a')!;
    link.classList.add('sidr-mobile-nav-menu__link', 'wpex-block', 'wpex-relative');
    link.querySelector('span')?.classList.add('sidr-mobile-nav-menu__link-inner', 'wpex-inline-block');
    const wrap = document.createElement('span');
    wrap.className = 'sidr-mobile-nav-menu__link-wrap wpex-block wpex-relative';
    link.replaceWith(wrap);
    wrap.append(link);
  });
  inner.append(menu);
  const search = document.querySelector('#mobile-menu-search form')?.cloneNode(true) as HTMLElement | undefined;
  if (search) {
    [search, ...search.querySelectorAll<HTMLElement>('*')].forEach(node => {
      if (node.id) node.id = `sidr-id-${node.id}`;
      node.className = [...node.classList].map(name => `sidr-class-${name}`).join(' ');
    });
    inner.append(search);
  }
  drawer.append(closer, inner);
  body.append(drawer);
  const overlay = document.querySelector<HTMLElement>('.wpex-sidr-overlay');
  let lastFocus: HTMLElement | null = null;
  const close = (restore = true) => {
    drawer.hidden = true;
    drawer.classList.remove('is-open');
    overlay?.classList.add('wpex-hidden');
    body.classList.remove('camya-drawer-open');
    toggles.forEach(toggle => toggle.setAttribute('aria-expanded', 'false'));
    if (restore) lastFocus?.focus();
  };
  const open = (trigger: HTMLElement) => {
    lastFocus = trigger;
    drawer.hidden = false;
    drawer.classList.add('is-open');
    overlay?.classList.remove('wpex-hidden');
    body.classList.add('camya-drawer-open');
    toggles.forEach(toggle => toggle.setAttribute('aria-expanded', 'true'));
    closeButton.focus();
  };
  toggles.forEach(toggle => {
    toggle.setAttribute('aria-controls', drawer.id);
    toggle.addEventListener('click', event => {
      event.preventDefault();
      drawer.hidden ? open(toggle) : close();
    });
  });
  closeButton.addEventListener('click', event => { event.preventDefault(); close(); });
  overlay?.addEventListener('click', () => close());
  drawer.addEventListener('click', event => {
    if ((event.target as Element).closest('a')) close(false);
  });
  drawer.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key !== 'Tab') return;
    const items = [...drawer.querySelectorAll<HTMLElement>('button, a[href], input:not([type="hidden"])')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', event => {
    if (event.matches) close(false);
  });
}

// Shared team tabs and biography accordions retain their existing IDs and links.
document.querySelectorAll<HTMLElement>('.vc_tta').forEach(group => {
  const tabs = group.classList.contains('vc_tta-tabs');
  const panels = [...group.querySelectorAll<HTMLElement>('.vc_tta-panel')];
  const controls = [...group.querySelectorAll<HTMLAnchorElement>('.vc_tta-panel-title a, .vc_tta-tab > a')];
  const sync = () => {
    controls.forEach(control => {
      const id = control.getAttribute('href')?.slice(1);
      const panel = panels.find(panel => panel.id === id);
      if (!panel) return;
      control.setAttribute('aria-controls', panel.id);
      control.setAttribute('aria-expanded', String(panel.classList.contains('vc_active')));
      if (control.closest('.vc_tta-tab')) {
        control.setAttribute('role', 'tab');
        control.setAttribute('aria-selected', String(panel.classList.contains('vc_active')));
        control.closest('.vc_tta-tab')?.classList.toggle('vc_active', panel.classList.contains('vc_active'));
      }
    });
  };
  controls.forEach(control => {
    control.addEventListener('click', event => {
      event.preventDefault();
      const panel = panels.find(panel => `#${panel.id}` === control.getAttribute('href'));
      if (!panel) return;
      const activate = tabs || !panel.classList.contains('vc_active');
      panels.forEach(other => other.classList.toggle('vc_active', other === panel && activate));
      sync();
    });
    control.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); control.click(); }
      if (!tabs || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabControls = controls.filter(control => control.closest('.vc_tta-tab'));
      const index = tabControls.indexOf(control);
      if (index < 0) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabControls.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabControls.length) % tabControls.length;
      tabControls[next].focus();
      tabControls[next].click();
    });
  });
  if (tabs) group.querySelector('.vc_tta-tabs-list')?.setAttribute('role', 'tablist');
  sync();
});

// Parallax backgrounds reproduce the approved section geometry without skrollr.
const backgrounds = [...document.querySelectorAll<HTMLElement>('[data-vc-parallax-image]')].map(section => {
  const layer = document.createElement('div');
  layer.className = 'vc_parallax-inner';
  const factor = Number(section.dataset.vcParallax) || 1.5;
  layer.style.height = `${factor * 100}%`;
  layer.style.backgroundImage = `url("${section.dataset.vcParallaxImage}")`;
  section.append(layer);
  return { section, layer, factor };
});
const updateBackgrounds = () => {
  backgrounds.forEach(({ section, layer, factor }) => {
    const rect = section.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height * factor)));
    layer.style.top = `${-(factor - 1) * 100 * (1 - progress)}%`;
  });
};
updateBackgrounds();

// Sticky internal-page header and back-to-top affordance.
const header = document.querySelector<HTMLElement>('#site-header:not(.camya-header)');
const backToTop = document.querySelector<HTMLElement>('#site-scroll-top');
let ticking = false;
const updateScroll = () => {
  header?.classList.toggle('camya-header-sticky', scrollY > 180);
  header?.classList.toggle('dyn-styles', scrollY <= 180);
  backToTop?.classList.toggle('camya-scroll-visible', scrollY > 100);
  updateBackgrounds();
  ticking = false;
};
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
}, { passive: true });
window.addEventListener('resize', updateScroll, { passive: true });
updateScroll();
backToTop?.addEventListener('click', event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});

// The desktop search toggle retains the original native GET form.
document.querySelectorAll<HTMLElement>('.site-search-toggle').forEach(toggle => {
  const search = document.querySelector<HTMLElement>('#searchform-dropdown');
  toggle.addEventListener('click', event => {
    event.preventDefault();
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    search?.classList.toggle('camya-search-open', open);
    if (open) search?.querySelector<HTMLInputElement>('input')?.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true' && search) {
      toggle.setAttribute('aria-expanded', 'false');
      search.classList.remove('camya-search-open');
      toggle.focus();
    }
  });
});

// Social-share controls use the actual page URL, with no plugin dependency.
document.querySelectorAll<HTMLAnchorElement>('.wpex-social-share__link').forEach(link => {
  const url = encodeURIComponent(location.href);
  const title = encodeURIComponent(document.title);
  if (link.classList.contains('wpex-twitter')) link.href = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
  else if (link.classList.contains('wpex-facebook')) link.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  else if (link.classList.contains('wpex-linkedin')) link.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  else if (link.classList.contains('wpex-email')) link.href = `mailto:?subject=${title}&body=${url}`;
  if (!link.href.startsWith('mailto:')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
});
