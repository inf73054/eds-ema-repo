/* eslint-disable */
/* global WebImporter */
/**
 * Parser for block: tabs (Tabs convention — 2-column rows: label | content)
 * Source: wknd.site adventure detail pages (.cmp-tabs).
 *
 * Block name in row 1, then one row per tab: [ tab label | tab content ].
 * The repeated content-fragment title (h3.cmp-contentfragment__title) is dropped.
 */
export default function parse(element, { document }) {
  const labels = [...element.querySelectorAll('.cmp-tabs__tab')].map((t) => t.textContent.trim());
  const panels = [...element.querySelectorAll('.cmp-tabs__tabpanel')];
  if (panels.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = panels.map((panel, i) => {
    const label = labels[i] || `Tab ${i + 1}`;
    const body = panel.querySelector('.cmp-contentfragment__element-value, article, .cmp-container') || panel;

    const content = document.createElement('div');
    [...body.children].forEach((child) => {
      if (child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title')) return;
      content.appendChild(child.cloneNode(true));
    });
    if (!content.children.length) {
      [...panel.children].forEach((child) => {
        if (child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title')) return;
        content.appendChild(child.cloneNode(true));
      });
    }

    const labelDiv = document.createElement('div');
    labelDiv.textContent = label;

    return [labelDiv, content];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs', cells });
  element.replaceWith(block);
}
