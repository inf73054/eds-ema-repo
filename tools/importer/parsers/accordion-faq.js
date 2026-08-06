/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: accordion-faq
 * Base block: accordion
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-08-05
 *
 * Structure (accordion variant, 2 columns):
 *   One row per Q&A item. Each row:
 *     Cell 1: question text (from the summary span)
 *     Cell 2: answer paragraph
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, :scope > details, .faq-item'));

  const cells = [];
  items.forEach((item) => {
    // Question: prefer the inner span text, fall back to the summary itself.
    const summary = item.querySelector('summary .faq-question span, .faq-question span, summary span, summary');
    const answer = item.querySelector('.faq-answer, .faq-answer p');

    if (!summary && !answer) return;

    const questionText = summary ? summary.textContent.trim() : '';
    const questionEl = document.createElement('p');
    questionEl.textContent = questionText;

    cells.push([questionEl, answer || '']);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
