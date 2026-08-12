/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCollageParser from './parsers/hero-collage.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-collage': heroCollageParser,
  'columns-article': columnsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-banner': heroBannerParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'about-us',
  description: 'Editorial landing page: image-led hero, featured case-study intro, image gallery, tabbed testimonials, article cards row, FAQ accordion, and dark closing CTA banner. Alternating light/white/dark section backgrounds.',
  urls: [
    'https://wknd-trendsetters.site/about-us',
  ],
  blocks: [
    { name: 'hero-collage', instances: ['#main-content > header.section.secondary-section > div.container > div.grid-layout'] },
    { name: 'columns-article', instances: ['#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout'] },
    { name: 'cards-gallery', instances: ['#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.grid-gap-sm'] },
    { name: 'tabs-testimonial', instances: ['#main-content > section.section:nth-of-type(3) div.tabs-wrapper'] },
    { name: 'cards-article', instances: ['#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.grid-layout.grid-gap-md'] },
    { name: 'accordion-faq', instances: ['#main-content > section.section:nth-of-type(5) div.faq-list'] },
    { name: 'hero-banner', instances: ['#main-content > section.section.inverse-section > div.container > div.grid-layout'] },
    { name: 'section-inverse', instances: ['#main-content > section.section.inverse-section'], section: 'dark' },
  ],
  sections: [
    { id: 's1', name: 'Hero', selector: '#main-content > header.section.secondary-section', style: 'grey', blocks: ['hero-collage'], defaultContent: [] },
    { id: 's2', name: 'Case study intro', selector: '#main-content > section.section:nth-of-type(1)', style: 'light', blocks: ['columns-article'], defaultContent: [] },
    { id: 's3', name: 'Style in every snapshot', selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'grey', blocks: ['cards-gallery'], defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(2) h2.h2-heading', '#main-content > section.section.secondary-section:nth-of-type(2) p.paragraph-lg'] },
    { id: 's4', name: 'Testimonials', selector: '#main-content > section.section:nth-of-type(3)', style: 'light', blocks: ['tabs-testimonial'], defaultContent: [] },
    { id: 's5', name: 'Latest articles', selector: '#main-content > section.section.secondary-section:nth-of-type(4)', style: 'grey', blocks: ['cards-article'], defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(4) h2.h2-heading', '#main-content > section.section.secondary-section:nth-of-type(4) p.paragraph-lg'] },
    { id: 's6', name: 'FAQ', selector: '#main-content > section.section:nth-of-type(5)', style: 'light', blocks: ['accordion-faq'], defaultContent: ['#main-content > section.section:nth-of-type(5) h2', '#main-content > section.section:nth-of-type(5) p'] },
    { id: 's7', name: 'Closing CTA', selector: '#main-content > section.section.inverse-section', style: 'dark', blocks: ['hero-banner'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, sections after (sections acts on afterTransform)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    // Skip section-style mappings — handled by the section transformer, not parsers
    if (blockDef.name.startsWith('section-')) return;
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
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

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by an earlier parser
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

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path
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
