/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section handling.
 *
 * Adds section breaks (<hr>) and Section Metadata blocks based on the template's
 * sections[] definition in tools/importer/page-templates.json.
 *
 * Runs in afterTransform only (block parsers run between the hooks; section
 * structure must be applied after cells are extracted). Section selectors and
 * style values come from payload.template.sections. The companion cleanup
 * transformer preserves .section / .secondary-section / .inverse-section classes
 * and the #main-content id, so these selectors resolve regardless of run order.
 *
 * Style mapping (per template): secondary-section => "grey", inverse-section => "dark",
 * plain white sections => "light".
 *
 * Expected for about-us (7 sections, all styled):
 *   - Section Metadata blocks: 7 (one per styled section)
 *   - Section breaks <hr>: 6 (one before every non-first section)
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!Array.isArray(sections) || sections.length < 2) return;

    const document = element.ownerDocument;

    // Process in reverse so DOM insertions never shift not-yet-processed selectors.
    [...sections].reverse().forEach((section, revIndex) => {
      const index = sections.length - 1 - revIndex;
      if (!section || !section.selector) return;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) return;

      // Append a Section Metadata block as the last child of the section when styled.
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(metaBlock);
      }

      // Insert a section break before every non-first section.
      if (index > 0) {
        sectionEl.before(document.createElement('hr'));
      }
    });
  }
}
