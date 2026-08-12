import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Hero (collage) block.
 * Content model: two cells — a text cell (heading + subheading + CTA buttons)
 * and an image cell containing 2+ pictures rendered as a vertical collage.
 * @param {Element} block
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];

  // The image cell is the one that contains pictures.
  const imageCell = cells.find((cell) => cell.querySelector('picture'));
  const textCell = cells.find((cell) => cell !== imageCell);

  if (textCell) {
    textCell.classList.add('hero-collage-content');
  }

  if (imageCell) {
    imageCell.classList.add('hero-collage-images');
    imageCell.querySelectorAll('picture > img').forEach((img) => {
      img.closest('picture').replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
      );
    });
  }
}
