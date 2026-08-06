/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-article
 * Base block: cards
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-08-05
 *
 * Structure (cards variant, 2 columns):
 *   One row per article card. Each row:
 *     Cell 1: card image
 *     Cell 2: body (category tag text, date text, title heading, and card link)
 */
export default function parse(element, { document }) {
  // Each article card is an <a> link wrapping the card content.
  const cards = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link, :scope > a'));

  const cells = [];
  cards.forEach((card) => {
    const img = card.querySelector('img');

    const bodyCell = [];
    // Meta row: category tag + date
    const tag = card.querySelector('.tag');
    if (tag) bodyCell.push(tag);
    const date = card.querySelector('.article-card-meta .paragraph-sm, .paragraph-sm');
    if (date) bodyCell.push(date);
    // Title heading
    const title = card.querySelector('h1, h2, h3, h4, [class*="heading"]');
    if (title) bodyCell.push(title);
    // Preserve the card's link as an explicit CTA at the bottom of the cell.
    const href = card.getAttribute('href');
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = title ? title.textContent : href;
      bodyCell.push(link);
    }

    cells.push([img || '', bodyCell]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
