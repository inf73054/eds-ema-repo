/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND adventure detail pages.
 *   - removes global chrome (header/footer/search) + the dynamic "Share this
 *     Adventure" widget + breadcrumb nav
 *   - flattens the Overview / Itinerary / What to Bring tab panels into default
 *     content: each panel's tab label becomes an <h2>, followed by the panel's
 *     real content (dropping the repeated content-fragment title h3).
 * Runs in beforeTransform so the trip-details <dl> and flattened content are in
 * place before block discovery/parsing.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.header',
      '.footer',
      'search',
      '[class*="languagenavigation"]',
      '[class*="sign-in"]',
      'nav[aria-label="Breadcrumb"]',
      '.cmp-breadcrumb',
      // hidden mobile navigation menu appended at end of <body> (Home/Magazine/…)
      '#mobileNav',
      'a[href="#mobileNav"]',
      '.cmp-navigation',
      'nav.navigation',
    ]);

    // Remove carousel navigation controls (Previous / Next buttons + slide tabs)
    // that otherwise leak in as the text "Previous Next". Keep the slide image.
    element.querySelectorAll('.cmp-carousel__actions, .cmp-carousel__action, .cmp-carousel__indicators, [class*="carousel__action"]').forEach((el) => el.remove());
    element.querySelectorAll('.cmp-carousel button, [class*="carousel"] button').forEach((btn) => btn.remove());

    // Remove the dynamic "Share this Adventure" widget (heading + share buttons).
    element.querySelectorAll('h5, [class*="sharing"], [data-cmp-is="sharing"]').forEach((el) => {
      if (/share this/i.test(el.textContent || '')) {
        const next = el.nextElementSibling;
        el.remove();
        if (next && next.querySelector && next.querySelector('a[href*="pinterest"], a[href*="facebook"], a[href*="twitter"]')) {
          next.remove();
        }
      }
    });

    // Remove the repeated content-fragment title (h3.cmp-contentfragment__title
    // duplicates the page H1 inside every tab panel).
    element.querySelectorAll('h3.cmp-contentfragment__title, .cmp-contentfragment__title').forEach((el) => el.remove());

    // NOTE: the tabs (.cmp-tabs) are intentionally left intact so the tabs parser
    // converts them into a real interactive Tabs block. The trip-details <dl> and
    // the tabs are laid out side-by-side by the adventure detail import script
    // (sidebar + tabs) and CSS — they are NOT flattened into plain text.
  }

  if (hookName === TransformHook.afterTransform) {
    WebImporter.DOMUtils.remove(element, ['header', 'footer', 'search']);

    // Rewrite internal wknd.site source paths to our migrated EDS paths.
    element.querySelectorAll('a[href]').forEach((a) => {
      let href = (a.getAttribute('href') || '').replace(/^https?:\/\/wknd\.site/i, '');
      if (!href.startsWith('/us/en')) return;
      let p = href.replace(/\.html$/, '');
      p = (p === '/us/en') ? '/' : p.replace(/^\/us\/en/, '');
      if (p === '') p = '/';
      a.setAttribute('href', p);
    });
  }
}
