/* eslint-disable */
/* global WebImporter */
/**
 * Parser: adventure trip-details -> table block.
 * Source: wknd.site adventure detail pages (dl.cmp-contentfragment__elements).
 *
 * Each .cmp-contentfragment__element holds a dt (label) + dd (value), e.g.
 * Activity / Adventure Type / Trip Length / Group Size / Difficulty / Price.
 * Output a Table block: header row "Trip Details", then one row per [key | value].
 */
export default function parse(element, { document }) {
  const items = [...element.querySelectorAll('.cmp-contentfragment__element')];
  const rows = [];
  items.forEach((item) => {
    const key = item.querySelector('.cmp-contentfragment__element-title, dt');
    const val = item.querySelector('.cmp-contentfragment__element-value, dd');
    if (!key && !val) return;
    const kDiv = document.createElement('div');
    kDiv.textContent = key ? key.textContent.trim() : '';
    const vDiv = document.createElement('div');
    vDiv.textContent = val ? val.textContent.trim() : '';
    rows.push([kDiv, vDiv]);
  });

  if (rows.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Prepend a header row so the Table block renders a "Trip Details" caption row.
  const head = document.createElement('div');
  head.textContent = 'Trip Details';
  const cells = [[head, ''], ...rows];

  const block = WebImporter.Blocks.createBlock(document, { name: 'table', cells });
  element.replaceWith(block);
}
