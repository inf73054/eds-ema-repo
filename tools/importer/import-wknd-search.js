/* eslint-disable */
/* global WebImporter */

/**
 * Import script for the /search page: an H1 + a Search block that queries
 * /query-index.json. The block is built with WebImporter.Blocks.createBlock so
 * it survives as a proper block table (block name row + config cell).
 */
export default {
  transform: (payload) => {
    const { document } = payload;
    const main = document.createElement('main');

    const h1 = document.createElement('h1');
    h1.textContent = 'Search';
    main.appendChild(h1);

    // Search block: one config cell holding the query-index source path.
    const source = document.createElement('div');
    source.textContent = '/query-index.json';
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'search',
      cells: [[source]],
    });
    main.appendChild(block);

    return [{
      element: main,
      path: '/search',
      report: { title: 'Search', template: 'wknd-search' },
    }];
  },
};
