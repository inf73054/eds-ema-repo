/* eslint-disable */
/* global WebImporter */
/**
 * Parser for block: accordion-faq (2-column rows: question | answer)
 * Handles both source structures:
 *   - trendsetters: <details class="faq-item"> with summary + .faq-answer
 *   - classic WKND: AEM Core Component .cmp-accordion with .cmp-accordion__item
 *     (title in .cmp-accordion__title/header, answer in .cmp-accordion__panel)
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- classic WKND AEM Core Component accordion ---
  const cmpItems = Array.from(element.querySelectorAll('.cmp-accordion__item'));
  if (cmpItems.length) {
    cmpItems.forEach((item) => {
      const titleEl = item.querySelector('.cmp-accordion__title, .cmp-accordion__header button, .cmp-accordion__header');
      const panel = item.querySelector('.cmp-accordion__panel');
      if (!titleEl && !panel) return;

      const questionEl = document.createElement('p');
      questionEl.textContent = titleEl ? titleEl.textContent.trim() : '';

      const answer = document.createElement('div');
      if (panel) {
        [...panel.childNodes].forEach((n) => answer.appendChild(n.cloneNode(true)));
        if (!answer.textContent.trim()) answer.textContent = panel.textContent.trim();
      }
      cells.push([questionEl, answer]);
    });
  } else {
    // --- trendsetters <details> accordion ---
    const items = Array.from(element.querySelectorAll(':scope > details.faq-item, :scope > details, .faq-item'));
    items.forEach((item) => {
      const summary = item.querySelector('summary .faq-question span, .faq-question span, summary span, summary');
      const answer = item.querySelector('.faq-answer, .faq-answer p');
      if (!summary && !answer) return;

      const questionEl = document.createElement('p');
      questionEl.textContent = summary ? summary.textContent.trim() : '';
      cells.push([questionEl, answer || '']);
    });
  }

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
