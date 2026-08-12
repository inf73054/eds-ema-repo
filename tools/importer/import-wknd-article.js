/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';

// PAGE TEMPLATE CONFIGURATION
// WKND magazine article -> mapped onto the /blog-ace-pro-court-polo slot.
// The article is entirely default content (headings, paragraphs, blockquote,
// inline images, author bio, related list) — no blocks required.
const PAGE_TEMPLATE = {
  name: 'wknd-article',
  description: 'WKND magazine article: breadcrumb, H1 + byline, long-form rich-text body with subheadings/blockquote/inline images, author bio, and a related-articles list. All default content.',
  urls: [
    'https://wknd.site/us/en/magazine/arctic-surfing.html',
  ],
  blocks: [],
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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);
    // no blocks on this page — entirely default content
    executeTransformers('afterTransform', main, payload);

    // Tag the article body with an 'article' section style so the narrow
    // reading column + byline/avatar treatment apply only to article pages.
    const smd = WebImporter.Blocks.createBlock(document, {
      name: 'Section Metadata',
      cells: [['Style', 'article']],
    });
    main.appendChild(smd);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // Final scrub: remove demdex tracking anchors injected late by martech.
    main.querySelectorAll('a[href*="demdex"], a[href*="dest5.html"]').forEach((a) => (a.closest('p') || a).remove());

    // Publish each article at its real path: /us/en/magazine/<slug> -> /magazine/<slug>
    const pathname = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '');
    const slug = pathname.split('/').pop();
    const path = `/us/en/magazine/${slug}`;

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: [],
      },
    }];
  },
};
