/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import teaserColumnsParser from './parsers/teaser-columns.js';
import cardsMagazineParser from './parsers/cards-magazine.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';

const parsers = {
  'teaser-columns': teaserColumnsParser,
  'cards-magazine': cardsMagazineParser,
};

// PAGE TEMPLATE CONFIGURATION — WKND Magazine hub -> mapped onto the /blog slot.
const PAGE_TEMPLATE = {
  name: 'wknd-magazine',
  description: 'WKND Magazine hub: H1, featured article teaser (columns-article), All Articles grid (cards-magazine, 5 cards), Members Only heading + 2 locked teasers (columns-article).',
  urls: [
    'https://wknd.site/us/en/magazine.html',
  ],
  blocks: [
    // teasers (featured + members-only) -> columns-article
    { name: 'teaser-columns', instances: ['.cmp-teaser'] },
    // article listing -> cards-magazine
    { name: 'cards-magazine', instances: ['ul.cmp-image-list'] },
  ],
  sections: [],
};

const transformers = [cleanupTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    if (blockDef.name.startsWith('section-')) return;
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // Publish the WKND magazine hub at its real path.
    const path = '/magazine';

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
