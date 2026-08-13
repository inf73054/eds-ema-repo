import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Cards (team) variant — contributor/guide cards: portrait image + name + role
 * + social links.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-team-card-image';
      else div.className = 'cards-team-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  // Social links render as icon-only buttons (matches wknd.site). Detect the
  // platform from the href/text, tag the link, and expose the label to screen
  // readers via aria-label while hiding the visible text.
  const platforms = ['facebook', 'twitter', 'instagram'];
  ul.querySelectorAll('.cards-team-card-body p a').forEach((a) => {
    const hint = `${a.getAttribute('href') || ''} ${a.textContent || ''}`.toLowerCase();
    const platform = platforms.find((p) => hint.includes(p) || hint.includes(p.slice(0, 5)));
    if (platform) {
      a.classList.add('cards-team-social', `cards-team-social-${platform}`);
      if (!a.getAttribute('aria-label')) a.setAttribute('aria-label', platform);
    }
  });

  block.textContent = '';
  block.append(ul);
}
