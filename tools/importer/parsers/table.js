/* eslint-disable */
/* global WebImporter */
/**
 * Parser for block: table
 * Source: https://wknd-trendsetters.site/blog/ace-pro-court-polo
 *
 * Converts a native <table> (Spec / Detail data table) into the EDS Table
 * block. WebImporter.Blocks.createBlock puts the block name in the first row;
 * each subsequent row is one table row, with one cell per column. The source
 * table's first row (Spec | Detail headers) becomes the first data row.
 */
export default function parse(element, { document }) {
  // element is the <table> (or a wrapper containing it)
  const table = element.matches && element.matches('table')
    ? element
    : element.querySelector('table');
  if (!table) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const rows = [...table.querySelectorAll('tr')];
  if (rows.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // one block row per table row; one cell per <th>/<td>, markup preserved
  const cells = rows.map((tr) => [...tr.children].map((cell) => {
    const div = document.createElement('div');
    div.innerHTML = cell.innerHTML;
    return div;
  }));

  const block = WebImporter.Blocks.createBlock(document, { name: 'table', cells });
  element.replaceWith(block);
}
