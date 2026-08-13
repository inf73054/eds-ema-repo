import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // tools: replace the bare search icon-link with a real search box (input +
  // magnifier) that navigates to the search page, matching wknd.site.
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const searchLink = navTools.querySelector('a');
    const searchPath = (searchLink && searchLink.getAttribute('href')) || '/us/en/search';
    navTools.innerHTML = '';
    const form = document.createElement('form');
    form.className = 'nav-search';
    form.setAttribute('role', 'search');
    form.setAttribute('action', searchPath);
    form.innerHTML = `
      <span class="nav-search-icon" aria-hidden="true"></span>
      <input type="search" name="q" placeholder="SEARCH" aria-label="Search">`;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = form.querySelector('input').value.trim();
      const url = q ? `${searchPath}?q=${encodeURIComponent(q)}` : searchPath;
      window.location.assign(url);
    });
    navTools.append(form);
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  // top utility bar (dark): Sign In + language selector, matching wknd.site.
  // The language menu is grouped by country, mirroring the source locales.
  // Flag SVGs live in /icons/flags/<code>.svg (committed assets — emoji flags
  // don't render on Windows, so real images are used instead).
  const flag = (code) => `<span class="nav-lang-flag" style="background-image:url('/icons/flags/${code}.svg')" aria-hidden="true"></span>`;
  const LANGUAGES = [
    { country: 'United States', flag: 'us', items: [{ label: 'en-US', href: '/us/en' }, { label: 'es-US', href: '/us/es' }] },
    { country: 'Canada', flag: 'ca', items: [{ label: 'en-CA', href: '/ca/en' }, { label: 'fr-CA', href: '/ca/fr' }] },
    { country: 'Switzerland', flag: 'ch', items: [{ label: 'de-CH', href: '/ch/de' }, { label: 'fr-CH', href: '/ch/fr' }, { label: 'it-CH', href: '/ch/it' }] },
    { country: 'Germany', flag: 'de', items: [{ label: 'de-DE', href: '/de/de' }] },
    { country: 'France', flag: 'fr', items: [{ label: 'fr-FR', href: '/fr/fr' }] },
    { country: 'Spain', flag: 'es', items: [{ label: 'es-ES', href: '/es/es' }] },
    { country: 'Italy', flag: 'it', items: [{ label: 'it-IT', href: '/it/it' }] },
  ];

  const menuMarkup = LANGUAGES.map((group) => `
    <li class="nav-lang-group">
      <span class="nav-lang-country">${flag(group.flag)}${group.country}</span>
      <ul>${group.items.map((it) => `<li><a href="${it.href}">${it.label}</a></li>`).join('')}</ul>
    </li>`).join('');

  const topBar = document.createElement('div');
  topBar.className = 'nav-utility';
  topBar.innerHTML = `
    <div class="nav-utility-inner">
      <a class="nav-signin" href="#sign-in">Sign In</a>
      <div class="nav-lang">
        <button type="button" class="nav-lang-toggle" aria-haspopup="true" aria-expanded="false">
          ${flag('us')}
          <span class="nav-lang-label">EN-US</span>
          <span class="nav-lang-caret" aria-hidden="true"></span>
        </button>
        <ul class="nav-lang-menu" hidden>${menuMarkup}</ul>
      </div>
    </div>`;

  const langToggle = topBar.querySelector('.nav-lang-toggle');
  const langMenu = topBar.querySelector('.nav-lang-menu');
  const setLangOpen = (open) => {
    langToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    langMenu.hidden = !open;
  };
  langToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setLangOpen(langToggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('click', (e) => {
    if (!topBar.querySelector('.nav-lang').contains(e.target)) setLangOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') setLangOpen(false);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(topBar);
  navWrapper.append(nav);
  block.append(navWrapper);
}
