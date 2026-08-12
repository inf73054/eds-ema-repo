/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCollageParser from './parsers/hero-collage.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-collage': heroCollageParser,
  'columns-article': columnsArticleParser,
  'cards-article': cardsArticleParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'blog',
  description: 'Blog index: hero (heading + CTAs + image), featured article (image + tag/date/heading/desc/CTA), Latest Articles cards grid (6 cards), and a lime accent CTA banner.',
  urls: [
    'https://wknd-trendsetters.site/blog',
  ],
  blocks: [
    { name: 'hero-collage', instances: ['#main-content > header.section.secondary-section > div.container > div.grid-layout'] },
    { name: 'columns-article', instances: ['#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout'] },
    { name: 'cards-article', instances: ['#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.grid-gap-md'] },
    { name: 'section-accent', instances: ['#main-content > section.section.accent-section'], section: 'accent' },
  ],
  sections: [
    { id: 's1', name: 'Hero', selector: '#main-content > header.section.secondary-section', style: 'grey', blocks: ['hero-collage'], defaultContent: [] },
    { id: 's2', name: 'Featured article', selector: '#main-content > section.section:nth-of-type(1)', style: 'light', blocks: ['columns-article'], defaultContent: [] },
    { id: 's3', name: 'Latest Articles', selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'grey', blocks: ['cards-article'], defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(2) h2', '#main-content > section.section.secondary-section:nth-of-type(2) p.paragraph-lg'] },
    { id: 's4', name: 'Accent CTA', selector: '#main-content > section.section.accent-section', style: 'accent', blocks: [], defaultContent: ['#main-content > section.section.accent-section h2', '#main-content > section.section.accent-section p'] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, sections after
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

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
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
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
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

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
