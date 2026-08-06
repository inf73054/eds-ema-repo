/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-collage
 * Base block: hero
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-08-05
 *
 * Structure (2-cell hero variant):
 *   Cell 1 (text): h1 heading + subheading paragraph + CTA links (See case, All stories)
 *   Cell 2 (collage): the 3 collage images
 */
export default function parse(element, { document }) {
  // The two top-level columns of the grid: text column and image column.
  const columns = element.querySelectorAll(':scope > div');
  const textColumn = columns[0] || element;
  const imageColumn = columns[1] || element;

  // --- Cell 1: text content ---
  const heading = textColumn.querySelector('h1, h2, [class*="h1-heading"], [class*="heading"]');
  const subheading = textColumn.querySelector('p, [class*="subheading"]');
  const ctaLinks = Array.from(textColumn.querySelectorAll('.button-group a, a.button'));

  const textCell = [];
  if (heading) textCell.push(heading);
  if (subheading) textCell.push(subheading);
  ctaLinks.forEach((a) => textCell.push(a));

  // --- Cell 2: collage images ---
  const images = Array.from(imageColumn.querySelectorAll('img'));

  // Empty-block guard
  if (!heading && !subheading && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([textCell, images]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-collage', cells });
  element.replaceWith(block);
}
