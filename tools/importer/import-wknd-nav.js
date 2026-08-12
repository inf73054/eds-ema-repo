/* eslint-disable */
/* global WebImporter */

/**
 * Import script for the global nav document (/nav) from the WKND header.
 *
 * The EDS header block (blocks/header/header.js) expects the nav fragment to
 * have three top-level sections in order: brand, sections, tools.
 *   1. brand   — logo/home link
 *   2. sections— the primary nav <ul> (Magazine, Adventures, FAQs, About Us)
 *   3. tools   — utility area (search)
 * Sections are emitted as <hr>-separated blocks so the importer renders them as
 * separate top-level <div>s in nav.plain.html.
 */

const PRIMARY = [
  { text: 'Magazine', href: '/us/en/magazine' },
  { text: 'Adventures', href: '/us/en/adventures' },
  { text: 'FAQs', href: '/us/en/faqs' },
  { text: 'About Us', href: '/us/en/about-us' },
];

export default {
  transform: (payload) => {
    const { document } = payload;

    const main = document.createElement('main');

    // --- Section 1: brand ---
    const brand = document.createElement('div');
    const brandP = document.createElement('p');
    const brandLink = document.createElement('a');
    brandLink.setAttribute('href', '/us/en');
    brandLink.textContent = 'WKND';
    brandP.appendChild(brandLink);
    brand.appendChild(brandP);
    main.appendChild(brand);
    main.appendChild(document.createElement('hr'));

    // --- Section 2: sections (primary nav) ---
    const sections = document.createElement('div');
    const ul = document.createElement('ul');
    PRIMARY.forEach((item) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.setAttribute('href', item.href);
      a.textContent = item.text;
      li.appendChild(a);
      ul.appendChild(li);
    });
    sections.appendChild(ul);
    main.appendChild(sections);
    main.appendChild(document.createElement('hr'));

    // --- Section 3: tools (search) — icon links to the /search page ---
    const tools = document.createElement('div');
    const toolsP = document.createElement('p');
    const searchLink = document.createElement('a');
    searchLink.setAttribute('href', '/us/en/search');
    searchLink.setAttribute('aria-label', 'Search');
    searchLink.textContent = ':search:';
    toolsP.appendChild(searchLink);
    tools.appendChild(toolsP);
    main.appendChild(tools);

    return [{
      element: main,
      path: '/nav',
      report: { title: 'Nav', template: 'wknd-nav' },
    }];
  },
};
