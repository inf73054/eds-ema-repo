import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Hero (banner) block.
 * Content model: an image cell (full-bleed background) and a text cell
 * (heading + subheading + single CTA) that overlays the image.
 * @param {Element} block
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];

  const imageCell = cells.find((cell) => cell.querySelector('picture'));
  const textCell = cells.find((cell) => cell !== imageCell);

  if (imageCell) {
    imageCell.classList.add('hero-banner-bg');
    imageCell.querySelectorAll('picture > img').forEach((img) => {
      img.closest('picture').replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: '1600' }]),
      );
    });
  }

  if (textCell) {
    textCell.classList.add('hero-banner-content');
  }
}
