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

    // Members Only: the two teasers after the "Members Only" heading should sit
    // as a compact 2-up row. Start a section before the first of them and tag it
    // 'members' so CSS lays the two columns-article blocks side-by-side.
    const membersHeading = [...main.querySelectorAll('h2')].find((h) => /members only/i.test(h.textContent));
    if (membersHeading) {
      // The teaser parser emits columns-article as a block TABLE whose first row
      // is the block name "Columns Article" (the .columns-article class is added
      // later by the serializer). Match those tables in document order.
      const firstRowText = (t) => (t.querySelector('tr') ? t.querySelector('tr').textContent.replace(/\s+/g, ' ').trim().toLowerCase() : '');
      const all = [...main.querySelectorAll('h2, table')];
      const headingIdx = all.indexOf(membersHeading);
      const membersBlocks = all.filter((el, i) => i > headingIdx && el.tagName === 'TABLE' && firstRowText(el).startsWith('columns'));
      if (membersBlocks.length >= 2) {
        const first = membersBlocks[0];
        first.parentNode.insertBefore(document.createElement('hr'), first);
        const last = membersBlocks[membersBlocks.length - 1];
        const smd = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: [['Style', 'members']],
        });
        if (last.nextSibling) last.parentNode.insertBefore(smd, last.nextSibling);
        else last.parentNode.appendChild(smd);
      }
    }

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // Final scrub: remove demdex tracking anchors injected late by martech.
    main.querySelectorAll('a[href*="demdex"], a[href*="dest5.html"]').forEach((a) => (a.closest('p') || a).remove());

    // Publish the WKND magazine hub at its real path.
    const path = '/us/en/magazine';

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
