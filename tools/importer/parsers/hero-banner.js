/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-banner
 * Base block: hero
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-08-05
 *
 * Structure (2-cell hero variant):
 *   Cell 1 (background image): the networking-event cover image
 *   Cell 2 (text): h2 heading + subheading paragraph + single CTA "See more"
 */
export default function parse(element, { document }) {
  // Background image (cover-image / overlay image)
  const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');

  // Text content lives inside the card body overlay
  const heading = element.querySelector('h1, h2, [class*="h1-heading"], [class*="heading"]');
  const subheading = element.querySelector('p, [class*="subheading"]');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  const textCell = [];
  if (heading) textCell.push(heading);
  if (subheading) textCell.push(subheading);
  ctaLinks.forEach((a) => textCell.push(a));

  // Empty-block guard
  if (!bgImage && !heading && !subheading) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([bgImage || '', textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
