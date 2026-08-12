/* eslint-disable */
/* global WebImporter */
/**
 * Parser for block: cards-adventures (Cards convention + trailing category cell)
 * Source: https://wknd.site/us/en/adventures.html (the "All" tab card list).
 *
 * Follows the Cards 2-column model (image | text) and appends a THIRD cell per
 * row holding the card's category tags. The cards-adventures block JS reads and
 * removes that trailing cell to build a client-side category filter, so the
 * rendered card keeps the standard image + text structure.
 *
 * Output: block name row, then one row per card:
 *   [ image | body (title heading + description) | categories (comma-separated) ].
 */

// Category membership derived from the source's per-category tabs ("All" implicit).
const CATEGORIES = {
  'Climbing New Zealand': ['Climbing'],
  'Colorado Rock Climbing': ['Climbing'],
  'Whistler Mountain Biking': ['Cycling'],
  'Cycling Tuscany': ['Cycling', 'Travel'],
  'West Coast Cycling': ['Cycling'],
  'Downhill Skiing Wyoming': ['Skiing'],
  'Ski Touring Mont Blanc': ['Skiing'],
  'Tahoe Skiing': ['Skiing'],
  'Bali Surf Camp': ['Surfing'],
  'Surf Camp in Costa Rica': ['Surfing'],
  'Beervana in Portland': ['Travel'],
  'Gastronomic Marais Tour': ['Travel'],
  'Napa Wine Tasting': ['Travel'],
  'Riverside Camping': ['Travel'],
  'Yosemite Backpacking': ['Travel'],
};

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

    const catDiv = document.createElement('div');
    catDiv.textContent = (CATEGORIES[titleText] || []).join(', ');

    return [img || '', body, catDiv];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-adventures', cells });
  element.replaceWith(block);
}
