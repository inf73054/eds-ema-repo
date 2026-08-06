/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: tabs-testimonial
 * Base block: tabs
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-08-05
 *
 * Structure (tabs variant, 2 columns):
 *   One row per tab. Each row:
 *     Cell 1: tab label (avatar image + name + role) — from the tab-menu button
 *     Cell 2: tab panel (person image + name + role + quote) — from the tab-pane
 *   Source has tab-panes (image+quote) and tab-menu buttons (avatar+name+role),
 *   correlated by index (0..n).
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tab-pane'));
  const menuButtons = Array.from(element.querySelectorAll('.tab-menu-link, .tab-menu button'));

  const count = Math.max(panes.length, menuButtons.length);

  const cells = [];
  for (let i = 0; i < count; i += 1) {
    const pane = panes[i];
    const menu = menuButtons[i];

    // --- Cell 1: tab label (avatar + name + role) ---
    const labelCell = [];
    if (menu) {
      const avatar = menu.querySelector('.avatar img, img');
      if (avatar) labelCell.push(avatar);
      // Name + role text lines inside the button.
      const textLines = Array.from(menu.querySelectorAll('.paragraph-sm, div > div'));
      // Fallback: capture the two text divs (name, role) directly.
      const nameEl = menu.querySelector('strong');
      if (nameEl) {
        const p = document.createElement('p');
        p.append(nameEl.cloneNode(true));
        labelCell.push(p);
      }
      // Role line: last text line that is not the name.
      const roleLine = textLines.find((el) => el.querySelector('strong') === null && el.textContent.trim());
      if (roleLine) {
        const p = document.createElement('p');
        p.textContent = roleLine.textContent.trim();
        labelCell.push(p);
      }
    }

    // --- Cell 2: panel (person image + name + role + quote) ---
    const panelCell = [];
    if (pane) {
      const img = pane.querySelector('img');
      if (img) panelCell.push(img);
      // Name (bold) + role are the two divs above the quote.
      const nameEl = pane.querySelector('.paragraph-xl strong, strong');
      if (nameEl) {
        const p = document.createElement('p');
        p.append(nameEl.cloneNode(true));
        panelCell.push(p);
      }
      // Role: the div sibling right after the name wrapper.
      const nameWrapper = pane.querySelector('.paragraph-xl');
      if (nameWrapper && nameWrapper.nextElementSibling) {
        const p = document.createElement('p');
        p.textContent = nameWrapper.nextElementSibling.textContent.trim();
        if (p.textContent) panelCell.push(p);
      }
      // Quote paragraph.
      const quote = pane.querySelector('p.paragraph-xl, p');
      if (quote) panelCell.push(quote);
    }

    cells.push([labelCell, panelCell]);
  }

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
