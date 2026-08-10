import { createOptimizedPicture } from '../../scripts/aem.js';

const SEARCH_ICON = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

/**
 * Fetch and cache the query index.
 * @param {string} source query-index.json path
 */
async function fetchIndex(source) {
  const res = await fetch(source);
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

function filterData(term, data) {
  const t = term.trim().toLowerCase();
  if (!t) return [];
  const tokens = t.split(/\s+/);
  return data.filter((row) => {
    const hay = `${row.title || ''} ${row.description || ''} ${row.path || ''}`.toLowerCase();
    return tokens.every((tok) => hay.includes(tok));
  });
}

function renderResults(resultsEl, results, term) {
  resultsEl.textContent = '';
  if (!term.trim()) return;
  if (results.length === 0) {
    const p = document.createElement('p');
    p.className = 'search-no-results';
    p.textContent = `No results for "${term}".`;
    resultsEl.append(p);
    return;
  }
  const ul = document.createElement('ul');
  ul.className = 'search-results-list';
  results.slice(0, 20).forEach((row) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = row.path;
    const h3 = document.createElement('h3');
    h3.textContent = row.title || row.path;
    a.append(h3);
    if (row.description) {
      const p = document.createElement('p');
      p.textContent = row.description;
      a.append(p);
    }
    li.append(a);
    ul.append(li);
  });
  resultsEl.append(ul);
}

/**
 * loads and decorates the search block
 * @param {Element} block
 */
export default async function decorate(block) {
  // config: first cell may hold the query-index source path
  const cfg = block.querySelector(':scope > div > div');
  const source = (cfg && cfg.textContent.trim()) || '/query-index.json';
  block.textContent = '';

  const form = document.createElement('div');
  form.className = 'search-box';
  form.innerHTML = `
    <span class="search-icon">${SEARCH_ICON}</span>
    <input type="search" class="search-input" placeholder="Search" aria-label="Search" />
  `;
  const results = document.createElement('div');
  results.className = 'search-results';

  block.append(form, results);

  const input = form.querySelector('.search-input');
  let data = null;

  const run = async () => {
    if (!data) data = await fetchIndex(source);
    renderResults(results, filterData(input.value, data), input.value);
  };

  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(run, 200);
  });

  // support ?q= deep-link
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    input.value = q;
    run();
  }

  // decorate any images that later appear in results (defensive)
  block.querySelectorAll('img').forEach((img) => {
    img.closest('picture')?.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]));
  });
}
