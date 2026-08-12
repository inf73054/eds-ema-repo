/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 *
 * Removes non-authorable global chrome and strips source-theme (Astro) framework
 * artifacts so the import contains only page-level authorable content.
 *
 * ALL selectors verified against migration-work/cleaned.html:
 *   - <a class="skip-link">Skip to main content</a>      -> non-authorable
 *   - <div class="navbar"> ... </div>                    -> global header (nav, mega-menu, subscribe)
 *   - <footer class="footer inverse-footer"> ... </footer>-> global footer
 *   - data-astro-cid-* attributes on <body> and FAQ <svg> -> Astro build artifacts
 *   - <div class="container"> inside every section        -> theme layout wrapper (no meaning)
 *   - utility-* / grid-layout* / grid-gap* classes         -> theme styling helpers (no meaning)
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove non-authorable global chrome early so it cannot interfere with block matching.
    // (No cookie banners / modals / overlays exist in this source DOM.)
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'footer.footer',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Safety net: remove any global chrome still present after block parsing.
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'footer.footer',
    ]);

    // Strip Astro framework attributes (data-astro-cid-*), found on <body> and FAQ <svg> icons.
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-astro-cid')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    // Unwrap site-specific layout wrappers: <div class="container"> carries no authorable meaning.
    // Run in afterTransform so block parsers (which key off "div.container > div.grid-layout")
    // have already extracted their cells before the wrapper is removed.
    element.querySelectorAll('div.container').forEach((container) => {
      const parent = container.parentNode;
      if (!parent) return;
      while (container.firstChild) {
        parent.insertBefore(container.firstChild, container);
      }
      container.remove();
    });

    // Remove non-meaningful helper classes (theme styling only): utility-*, grid-layout*, grid-gap*.
    // Section-defining classes (section, secondary-section, inverse-section) are preserved so the
    // section transformer and #main-content selectors keep working.
    element.querySelectorAll('[class]').forEach((el) => {
      const kept = [...el.classList].filter((c) => (
        !c.startsWith('utility-')
        && !c.startsWith('grid-layout')
        && !c.startsWith('grid-gap')
      ));
      if (kept.length) {
        el.setAttribute('class', kept.join(' '));
      } else {
        el.removeAttribute('class');
      }
    });
  }
}
