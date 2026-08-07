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
    ]);

    // Remove the dynamic "Share this Adventure" widget (heading + share buttons).
    element.querySelectorAll('h5, [class*="sharing"], [data-cmp-is="sharing"]').forEach((el) => {
      if (/share this/i.test(el.textContent || '')) {
        // remove the share heading and its following sibling widget if present
        const next = el.nextElementSibling;
        el.remove();
        if (next && next.querySelector && next.querySelector('a[href*="pinterest"], a[href*="facebook"], a[href*="twitter"]')) {
          next.remove();
        }
      }
    });

    // Flatten adventure tabs (Overview / Itinerary / What to Bring) into default content.
    element.querySelectorAll('.cmp-tabs').forEach((tabs) => {
      const labels = [...tabs.querySelectorAll('.cmp-tabs__tab')].map((t) => t.textContent.trim());
      const panels = [...tabs.querySelectorAll('.cmp-tabs__tabpanel')];
      const frag = document.createElement('div');

      panels.forEach((panel, i) => {
        const label = labels[i] || '';
        if (label) {
          const h = document.createElement('h2');
          h.textContent = label;
          frag.appendChild(h);
        }
        // panel body: drop the repeated content-fragment title h3, keep the rest
        const body = panel.querySelector('.cmp-contentfragment__element-value, article, .cmp-container') || panel;
        [...body.children].forEach((child) => {
          if (child.tagName === 'H3' && labels.every((l) => l !== child.textContent.trim())) {
            // this is the repeated CF page-title h3 — skip it
            return;
          }
          frag.appendChild(child.cloneNode(true));
        });
      });

      tabs.replaceWith(frag);
    });
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
