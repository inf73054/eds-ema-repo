/* eslint-disable */
/* global WebImporter */
/**
 * Parser for block: cards-team (Cards convention: 2-column rows)
 * Source: https://wknd.site/us/en/about-us.html
 *
 * Input: a .cards-team-grid wrapper (created by wknd-cleanup transformer) holding
 * one <section> per contributor/guide. Each card section contains a portrait
 * <img>, an <h3> name, an <h5> role, and social icon links.
 *
 * Output: block name in row 1, then one row per card:
 *   [ image cell | text cell (name heading + role + social links) ].
 */
export default function parse(element, { document }) {
  const cards = [...element.querySelectorAll(':scope > section')];
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = cards.map((card) => {
    // Cell 1 (mandatory): portrait image
    const img = card.querySelector('img');

    // Cell 2 (mandatory): name (heading) + role + social links
    const body = [];
    const name = card.querySelector('h3');
    if (name) body.push(name);
    const role = card.querySelector('h5');
    if (role) body.push(role);
    const socials = [...card.querySelectorAll('a')];
    if (socials.length) {
      const p = document.createElement('p');
      socials.forEach((a) => p.appendChild(a));
      body.push(p);
    }

    return [img || '', body];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-team', cells });
  element.replaceWith(block);
}
