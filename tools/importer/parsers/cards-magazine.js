/* eslint-disable */
/* global WebImporter */
/**
 * Parser for block: cards-magazine (Cards convention: 2-column rows)
 * Source: https://wknd.site/us/en/magazine.html
 *
 * Input: a <ul class="cmp-image-list"> where each <li> holds an <article> with
 * a linked thumbnail image, a linked title, and a description.
 *
 * Output: block name in row 1, then one row per article card:
 *   [ image cell | text cell (linked title heading + description) ].
 */
export default function parse(element, { document }) {
  const items = [...element.querySelectorAll(':scope > li')];
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = items.map((li) => {
    const article = li.querySelector('article') || li;
    const img = article.querySelector('img');

    const links = [...article.querySelectorAll('a')];
    const textLink = links.find((a) => a.textContent.trim()) || links[0];
    const href = textLink ? textLink.getAttribute('href') : null;
    const titleText = textLink ? textLink.textContent.trim() : '';

    let desc = '';
    const descEl = [...article.children].find((c) => c.tagName !== 'A' && c.textContent.trim());
    if (descEl) desc = descEl.textContent.trim();

    const body = [];
    if (titleText) {
      const h3 = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = titleText;
        h3.appendChild(a);
      } else {
        h3.textContent = titleText;
      }
      body.push(h3);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      body.push(p);
    }

    return [img || '', body];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-magazine', cells });
  element.replaceWith(block);
}
