/* eslint-disable */
/* global WebImporter */
/**
 * Parser for block: carousel (hero slideshow) — Carousel convention: 2-column rows.
 * Source: https://wknd.site/us/en.html (.cmp-carousel--hero, 3 slides)
 *
 * Block name in row 1, then one row per slide:
 *   [ image cell (image only) | text cell (title heading + description + CTA) ].
 */
export default function parse(element, { document }) {
  const slides = [...element.querySelectorAll('.cmp-carousel__item')];
  if (slides.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = slides.map((slide) => {
    const img = slide.querySelector('img');
    const content = slide.querySelector('.cmp-teaser__content') || slide;

    const body = [];
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
    const cta = content.querySelector('.cmp-teaser__action-link, a');
    if (cta && cta.getAttribute('href')) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', cta.getAttribute('href'));
      a.textContent = cta.textContent.trim() || 'View Trips';
      p.appendChild(a);
      body.push(p);
    }

    return [img || '', body];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
