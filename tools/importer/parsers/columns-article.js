/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-article
 * Base block: columns
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-08-05
 *
 * Structure (2-column columns variant, single content row):
 *   Cell 1: image (adventure-spots)
 *   Cell 2: breadcrumb (Home / Case studies), h2 heading, byline (By Taylor Brooks; June 12, 2024 • 4 min read)
 */
export default function parse(element, { document }) {
  const columns = element.querySelectorAll(':scope > div');
  const imageColumn = columns[0] || element;
  const contentColumn = columns[1] || element;

  // --- Cell 1: image ---
  const image = imageColumn.querySelector('img');

  // --- Cell 2: breadcrumb + heading + byline ---
  const contentCell = [];
  const breadcrumb = contentColumn.querySelector('.breadcrumbs');
  if (breadcrumb) contentCell.push(breadcrumb);
  const heading = contentColumn.querySelector('h1, h2, [class*="h2-heading"], [class*="heading"]');
  if (heading) contentCell.push(heading);
  // Byline blocks: the flex-horizontal rows containing author + date/read-time
  const bylineRows = Array.from(contentColumn.querySelectorAll('.flex-horizontal'));
  bylineRows.forEach((row) => contentCell.push(row));

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
