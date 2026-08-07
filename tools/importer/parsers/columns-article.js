/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-article
 * Base block: columns
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-08-05
 *
 * Structure (2-column columns variant, single content row):
 *   Cell 1: image
 *   Cell 2: all content-column elements in document order. This covers both
 *     - about-us: breadcrumb (Home / Case studies), h2 heading, byline rows
 *     - blog:     tag/date row, h2 heading, description paragraph, CTA button-group
 */
export default function parse(element, { document }) {
  const columns = element.querySelectorAll(':scope > div');
  const imageColumn = columns[0] || element;
  const contentColumn = columns[1] || element;

  // --- Cell 1: image ---
  const image = imageColumn.querySelector('img');

  // --- Cell 2: preserve every content-column child in order ---
  // Generic: keeps breadcrumb/byline (about-us) AND tag/description/CTA (blog).
  const contentCell = Array.from(contentColumn.children);

  // Empty-block guard
  if (!image && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([image || '', contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
