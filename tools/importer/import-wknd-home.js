/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselParser from './parsers/carousel.js';
import teaserColumnsParser from './parsers/teaser-columns.js';
import cardsMagazineParser from './parsers/cards-magazine.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';

const parsers = {
  carousel: carouselParser,
  'teaser-columns': teaserColumnsParser,
  'cards-magazine': cardsMagazineParser,
};

// PAGE TEMPLATE CONFIGURATION — WKND homepage -> mapped onto the /index slot.
const PAGE_TEMPLATE = {
  name: 'wknd-home',
  description: 'WKND homepage: hero carousel (3 slides), featured article teaser, Recent Articles grid (4), a single adventure teaser, Next Adventures grid (4).',
  urls: [
    'https://wknd.site/us/en.html',
  ],
  // ORDER MATTERS: carousel first (it detaches the 3 teasers nested in its slides),
  // then the 2 standalone teasers -> columns-article, then the 2 lists -> cards-magazine.
  blocks: [
    { name: 'carousel', instances: ['.cmp-carousel--hero'] },
    { name: 'teaser-columns', instances: ['.cmp-teaser'] },
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

    // Discover blocks in template order and parse immediately, so the carousel
    // parser runs (and detaches its nested teasers) before teaser discovery uses
    // the live list. Re-query per block group to reflect DOM mutations.
    PAGE_TEMPLATE.blocks.forEach((blockDef) => {
      const parser = parsers[blockDef.name];
      blockDef.instances.forEach((selector) => {
        [...document.querySelectorAll(selector)].forEach((element) => {
          if (!element.parentNode) return; // already detached by an earlier parser
          if (!parser) return;
          try {
            parser(element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${blockDef.name} (${selector}):`, e);
          }
        });
      });
    });

    const reportBlocks = ['carousel', 'teaser-columns', 'cards-magazine'];

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // Final scrub: remove the Adobe demdex ID-syncing tracking link that martech
    // injects late (survives the transformer hooks).
    main.querySelectorAll('a[href*="demdex"], a[href*="dest5.html"]').forEach((a) => (a.closest('p') || a).remove());

    // Homepage lives at /us/en (the source home path).
    const path = '/us/en';

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: reportBlocks,
      },
    }];
  },
};
