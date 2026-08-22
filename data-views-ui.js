// Shared, credential-free improvements for data-heavy views.
(function () {
  'use strict';

  const DENSITY_KEY = 'hp_data_density_v1';
  const VIEWS = [
    { view: 'peptides', content: 'peptides-content', noun: 'compounds', search: 'Search compounds, doses, or purposes…' },
    { view: 'supplements', content: 'supps-content', noun: 'supplements', search: 'Search supplements, brands, or purposes…' },
    { view: 'vendors', content: 'vendors-content', noun: 'vendors', search: 'Search vendors or peptides carried…', kind: 'vendors' },
    { view: 'pricing', content: 'pricing-content', noun: 'compounds', search: 'Search compounds or vendors…', kind: 'groups' },
    { view: 'purchases', content: 'purchases-content', noun: 'purchases', sortable: true },
    { view: 'changes', content: 'changes-content', noun: 'changes', sortable: true },
    { view: 'suppchanges', content: 'suppchanges-content', noun: 'changes', sortable: true },
    { view: 'suppvendors', content: 'suppvendors-content', noun: 'supplements', search: 'Search vendors or supplements…', sortable: true },
    { view: 'goals', content: 'goals-content', noun: 'goals', search: 'Search goals, targets, or notes…', kind: 'cards' },
    { view: 'profile', content: 'profile-content', noun: 'fields', search: 'Search health context or values…', kind: 'cards' }
  ];

  function primaryRows(container, kind) {
    if (kind === 'groups') return [...container.querySelectorAll('.pricing-group')];
    if (kind === 'cards') return [...container.querySelectorAll('.card')];
    if (kind === 'vendors') return [...container.querySelectorAll('tbody > tr')].filter(row => !row.id.startsWith('vendor-expand-'));
    return [...container.querySelectorAll('tbody > tr')];
  }

  function updateTableGroups(container) {
    container.querySelectorAll('.table-wrap').forEach(wrap => {
      const rows = [...wrap.querySelectorAll('tbody > tr')].filter(row => !row.id.startsWith('vendor-expand-'));
      wrap.classList.toggle('data-filter-empty', Boolean(rows.length) && rows.every(row => row.hidden));
    });
  }

  function updateCardGroups(container) {
    container.querySelectorAll('div[style*="grid-template-columns"]').forEach(grid => {
      const cards = [...grid.querySelectorAll(':scope > .card')];
      if (!cards.length) return;
      const empty = cards.every(card => card.hidden);
      grid.hidden = empty;
      const heading = grid.previousElementSibling;
      if (heading) heading.hidden = empty;
    });
  }

  function sortValue(text) {
    const value = text.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return { type: 'number', value: Date.parse(value) || 0 };
    const numeric = Number(value.replace(/[$,%\s]/g, '').replace(/,/g, ''));
    if (value && Number.isFinite(numeric)) return { type: 'number', value: numeric };
    return { type: 'text', value: value.toLowerCase() };
  }

  function installTableSorting(container) {
    container.querySelectorAll('table').forEach(table => {
      if (table.dataset.sortEnhanced === 'true') return;
      const headers = [...table.querySelectorAll('thead th')];
      const body = table.tBodies[0];
      if (!headers.length || !body || headers.some(header => header.colSpan > 1)) return;
      table.dataset.sortEnhanced = 'true';
      headers.forEach((header, column) => {
        if (header.querySelector('button') || header.hasAttribute('onclick')) return;
        const label = header.textContent.trim();
        if (!label) return;
        header.innerHTML = `<button type="button" class="data-sort-button"><span>${header.innerHTML}</span><span class="data-sort-indicator" aria-hidden="true">↕</span></button>`;
        header.querySelector('button').addEventListener('click', () => {
          const ascending = header.getAttribute('aria-sort') !== 'ascending';
          headers.forEach(item => {
            item.removeAttribute('aria-sort');
            const indicator = item.querySelector('.data-sort-indicator');
            if (indicator) indicator.textContent = '↕';
          });
          header.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
          header.querySelector('.data-sort-indicator').textContent = ascending ? '↑' : '↓';
          const rows = [...body.rows];
          rows.sort((a, b) => {
            const aText = a.cells[column]?.textContent.trim() || '';
            const bText = b.cells[column]?.textContent.trim() || '';
            if (!aText && bText) return 1;
            if (aText && !bText) return -1;
            const av = sortValue(aText);
            const bv = sortValue(bText);
            const result = av.type === 'number' && bv.type === 'number'
              ? av.value - bv.value
              : String(av.value).localeCompare(String(bv.value), undefined, { numeric: true, sensitivity: 'base' });
            return ascending ? result : -result;
          });
          rows.forEach(row => body.appendChild(row));
        });
      });
    });
  }

  function applyDataViewFilter(config) {
    const container = document.getElementById(config.content);
    if (!container) return;
    const input = document.getElementById('data-search-' + config.view);
    const needle = (input?.value || '').trim().toLowerCase();
    const units = primaryRows(container, config.kind);
    let visible = 0;

    units.forEach(unit => {
      let searchable = unit.textContent;
      let pairedDetail = null;
      if (config.kind === 'vendors') {
        pairedDetail = unit.nextElementSibling?.id.startsWith('vendor-expand-') ? unit.nextElementSibling : null;
        searchable += ' ' + (pairedDetail?.textContent || '');
      }
      const matches = !needle || searchable.toLowerCase().includes(needle);
      unit.hidden = !matches;
      if (pairedDetail) {
        if (!matches) pairedDetail.hidden = true;
        else pairedDetail.hidden = false;
      }
      if (matches) visible += 1;
    });

    updateTableGroups(container);
    if (config.kind === 'cards') updateCardGroups(container);
    if (config.sortable) installTableSorting(container);
    const count = document.getElementById('data-count-' + config.view);
    if (count) count.textContent = `${visible} ${visible === 1 ? config.noun.replace(/s$/, '') : config.noun}`;
    const empty = document.getElementById('data-empty-' + config.view);
    if (empty) empty.hidden = visible > 0 || !needle;
  }

  function updateDensityButtons() {
    const compact = document.documentElement.dataset.dataDensity === 'compact';
    document.querySelectorAll('.data-density-toggle').forEach(button => {
      button.textContent = compact ? 'Comfortable rows' : 'Compact rows';
      button.setAttribute('aria-pressed', String(compact));
    });
  }

  window.toggleDataDensity = function () {
    const compact = document.documentElement.dataset.dataDensity !== 'compact';
    document.documentElement.dataset.dataDensity = compact ? 'compact' : 'comfortable';
    localStorage.setItem(DENSITY_KEY, compact ? 'compact' : 'comfortable');
    updateDensityButtons();
  };

  function installView(config) {
    const view = document.getElementById('view-' + config.view);
    const content = document.getElementById(config.content);
    if (!view || !content || view.dataset.enhanced === 'true') return;
    view.dataset.enhanced = 'true';
    view.classList.add('data-enhanced');
    view.querySelector('.section-header')?.classList.add('data-view-header');
    view.querySelector('.filter-bar')?.classList.add('data-view-toolbar');

    const utility = document.createElement('div');
    utility.className = 'data-view-utility';
    utility.innerHTML = `
      ${config.search ? `<label class="data-view-search"><span aria-hidden="true">⌕</span><span class="sr-only">${config.search}</span><input id="data-search-${config.view}" type="search" placeholder="${config.search}" autocomplete="off"></label>` : '<span class="data-view-utility-spacer"></span>'}
      <span class="data-view-count" id="data-count-${config.view}">—</span>
      <button class="data-density-toggle" type="button" onclick="toggleDataDensity()" aria-pressed="false">Compact rows</button>`;
    content.insertAdjacentElement('beforebegin', utility);

    const empty = document.createElement('p');
    empty.className = 'data-view-empty';
    empty.id = 'data-empty-' + config.view;
    empty.hidden = true;
    empty.textContent = 'No matching records.';
    content.insertAdjacentElement('beforebegin', empty);

    utility.querySelector('input')?.addEventListener('input', () => applyDataViewFilter(config));
    new MutationObserver(() => applyDataViewFilter(config)).observe(content, { childList: true, subtree: true });
    applyDataViewFilter(config);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.dataset.dataDensity = localStorage.getItem(DENSITY_KEY) === 'compact' ? 'compact' : 'comfortable';
    VIEWS.forEach(installView);
    updateDensityButtons();
  });
})();
