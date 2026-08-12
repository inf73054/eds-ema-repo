/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-gallery
 * Base block: cards
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-08-05
 *
 * Structure (cards variant, image-only tiles):
 *   One row per image tile. Each row has a single image cell.
 */
export default function parse(element, { document }) {
  // Each direct child div is an image tile.
  const tiles = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  tiles.forEach((tile) => {
    const img = tile.querySelector('img');
    if (img) cells.push([img]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
