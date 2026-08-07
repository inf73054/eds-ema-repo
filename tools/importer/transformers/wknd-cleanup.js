/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: classic WKND (wknd.site) site-wide cleanup + card grouping.
 *
 * The classic WKND site uses AEM Core Components markup. This transformer:
 *   - removes non-authorable global chrome (header banner, footer, search, sign-in, language nav)
 *   - groups the flat grid of contributor/guide card <section>s into wrapper divs
 *     (.cards-team-grid) so the cards-team parser can convert each group into one block.
 *
 * Card grouping: each card is a <section> that contains an <img> + an <h3> (name).
 * Consecutive card sections are bucketed by the <h2> group heading that precedes them
 * (e.g. "Our Contributors" -> 4 cards, "WKND Guides" -> 3 cards).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

function isCardSection(el) {
  return el.tagName === 'SECTION' && el.querySelector('img') && el.querySelector('h3');
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // NOTE: do NOT remove .xf-content-height / .experiencefragment — on the classic
    // WKND site the contributor/guide cards are authored as experience fragments,
    // so removing those wrappers would delete the card content itself.
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.header',
      '.footer',
      'search',
      '[class*="languagenavigation"]',
      '[class*="sign-in"]',
    ]);

    // Group consecutive contributor/guide card <section>s into .cards-team-grid
    // wrappers. Done in beforeTransform so the wrappers exist when block
    // discovery (findBlocksOnPage) runs, ahead of parsing.
    const cardSections = [...element.querySelectorAll('section')].filter(isCardSection);
    if (cardSections.length) {
      let currentGroup = null;
      cardSections.forEach((section) => {
        const prev = section.previousElementSibling;
        // Start a new group when the preceding sibling is NOT another card section
        // (i.e. a heading/intro precedes this run of cards).
        if (!currentGroup || (prev && !isCardSection(prev) && !prev.classList.contains('cards-team-grid'))) {
          currentGroup = document.createElement('div');
          currentGroup.className = 'cards-team-grid';
          section.parentNode.insertBefore(currentGroup, section);
        }
        currentGroup.appendChild(section);
      });
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Safety net.
    WebImporter.DOMUtils.remove(element, ['header', 'footer', 'search']);

    // Rewrite internal wknd.site source paths to our migrated EDS paths so
    // card/teaser/nav links resolve within this project instead of jumping to
    // the live source site.
    rewriteInternalLinks(element);
  }
}

/**
 * Map classic-WKND source paths (/us/en...) to our migrated slots.
 *   /us/en.html                         -> /
 *   /us/en/magazine.html                -> /magazine
 *   /us/en/magazine/<slug>.html         -> /magazine/<slug>
 *   /us/en/adventures.html              -> /adventures
 *   /us/en/adventures/<slug>.html       -> /adventures/<slug>
 *   /us/en/faqs.html                    -> /faqs
 *   /us/en/about-us.html                -> /about-us
 */
function rewriteInternalLinks(element) {
  element.querySelectorAll('a[href]').forEach((a) => {
    let href = a.getAttribute('href') || '';
    // normalize absolute wknd.site URLs to path-only
    href = href.replace(/^https?:\/\/wknd\.site/i, '');
    if (!href.startsWith('/us/en')) return;
    let p = href.replace(/\.html$/, '');
    if (p === '/us/en') p = '/';
    else p = p.replace(/^\/us\/en/, '');
    if (p === '') p = '/';
    a.setAttribute('href', p);
  });
}
