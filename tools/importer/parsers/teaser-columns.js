/* eslint-disable */
/* global WebImporter */
/**
 * Parser: AEM Core Component teaser (.cmp-teaser) -> columns-article block.
 * Source: https://wknd.site/us/en/magazine.html (featured + members-only teasers)
 *
 * A teaser has a .cmp-teaser__content (pretitle/eyebrow, title h2, description,
 * action-container CTA) and a .cmp-teaser__image. Output a 2-cell columns block:
 *   [ image cell | text cell (eyebrow + heading + description + CTA link) ].
 */
export default function parse(element, { document }) {
  const content = element.querySelector('.cmp-teaser__content') || element;
  const img = element.querySelector('img');

  const body = [];

  const pretitle = content.querySelector('.cmp-teaser__pretitle');
  if (pretitle && pretitle.textContent.trim()) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = pretitle.textContent.trim();
    p.appendChild(strong);
    body.push(p);
  }

  const title = content.querySelector('.cmp-teaser__title, h1, h2, h3');
  if (title) {
    const h = document.createElement('h2');
    h.textContent = title.textContent.trim();
    body.push(h);
  }

  const desc = content.querySelector('.cmp-teaser__description');
  if (desc && desc.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    body.push(p);
  }

  // CTA (may be absent for locked members-only teasers)
  const cta = content.querySelector('.cmp-teaser__action-link, a');
  if (cta && cta.getAttribute('href')) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', cta.getAttribute('href'));
    a.textContent = cta.textContent.trim() || 'Read More';
    p.appendChild(a);
    body.push(p);
  }

  if (!img && body.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[img || '', body]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
