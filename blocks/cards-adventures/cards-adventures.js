import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Cards (adventures) variant — image + title + description grid with a
 * category filter bar (All / Climbing / Cycling / Skiing / Surfing / Travel).
 *
 * Content model: same as cards-magazine, but each card's LAST cell holds a
 * comma-separated category list (hidden). The block builds a filter tablist
 * from the categories present and toggles card visibility client-side.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  const categories = new Set();

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children];

    // last cell = category metadata (comma-separated); pull it out
    let cats = [];
    if (cells.length > 1) {
      const catText = cells[cells.length - 1].textContent.trim();
      // treat the last cell as categories only if it has no image and is short-ish
      if (catText && !cells[cells.length - 1].querySelector('picture, img')) {
        cats = catText.split(',').map((c) => c.trim()).filter(Boolean);
      }
    }
    if (cats.length) {
      li.dataset.categories = cats.join('|').toLowerCase();
      cats.forEach((c) => categories.add(c));
      cells[cells.length - 1].remove();
    }

    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-adventures-card-image';
      else div.className = 'cards-adventures-card-body';
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  // build the filter bar
  const filters = document.createElement('div');
  filters.className = 'cards-adventures-filters';
  filters.setAttribute('role', 'tablist');
  const cats = ['All', ...[...categories].sort()];
  cats.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cards-adventures-filter';
    btn.textContent = cat;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.addEventListener('click', () => {
      filters.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', 'false'));
      btn.setAttribute('aria-selected', 'true');
      const key = cat.toLowerCase();
      ul.querySelectorAll(':scope > li').forEach((li) => {
        const show = cat === 'All' || (li.dataset.categories || '').split('|').includes(key);
        li.hidden = !show;
      });
    });
    filters.append(btn);
  });

  block.textContent = '';
  if (categories.size) block.append(filters);
  block.append(ul);
}
