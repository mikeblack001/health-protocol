// Shared, credential-free improvements for data-heavy views.
(function () {
  'use strict';

  const DENSITY_KEY = 'hp_data_density_v1';
  const VIEWS = [
    { view: 'peptides', content: 'peptides-content', noun: 'compounds', search: 'Search compounds, doses, or purposes…' },
    { view: 'supplements', content: 'supps-content', noun: 'supplements', search: 'Search supplements, brands, or purposes…' },
    { view: 'vendors', content: 'vendors-content', noun: 'vendors', search: 'Search vendors or peptides carried…', kind: 'vendors', exportable: true },
    { view: 'pricing', content: 'pricing-content', noun: 'compounds', search: 'Search compounds or vendors…', kind: 'groups' },
    { view: 'purchases', content: 'purchases-content', noun: 'purchases', sortable: true },
    { view: 'changes', content: 'changes-content', noun: 'changes', sortable: true, exportable: true },
    { view: 'suppchanges', content: 'suppchanges-content', noun: 'changes', sortable: true, exportable: true },
    { view: 'suppvendors', content: 'suppvendors-content', noun: 'supplements', search: 'Search vendors or supplements…', sortable: true, exportable: true },
    { view: 'log', content: 'log-history', noun: 'days', search: 'Search dates, mood, or metrics…', sortable: true, exportable: true },
    { view: 'bodycomp', content: 'bc-history', noun: 'records', search: 'Search dates or measurements…', sortable: true, exportable: true },
    { view: 'drinks', content: 'drinks-content', noun: 'items', search: 'Search drinks, timing, or ingredients…', kind: 'cards' },
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

  window.exportDataViewCsv = function (viewId) {
    const config = VIEWS.find(item => item.view === viewId);
    const container = config && document.getElementById(config.content);
    if (!container) return;
    const quote = value => `"${String(value ?? '').replace(/↕|↑|↓/g, '').trim().replace(/"/g, '""')}"`;
    const output = [];
    [...container.querySelectorAll('table')].forEach((table, tableIndex) => {
      const headers = [...table.querySelectorAll('thead th')].map(header => header.textContent);
      const rows = [...table.querySelectorAll('tbody > tr')].filter(row => !row.hidden && getComputedStyle(row).display !== 'none' && !row.id.startsWith('vendor-expand-'));
      if (!headers.length || !rows.length) return;
      if (output.length) output.push('');
      const section = table.closest('.table-wrap')?.querySelector('.timing-header')?.textContent?.trim();
      if (section) output.push(quote(section));
      output.push(headers.map(quote).join(','));
      rows.forEach(row => output.push([...row.cells].map(cell => quote(cell.textContent)).join(',')));
    });
    if (!output.length) return;
    const blob = new Blob([output.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${viewId}-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
      ${config.exportable ? `<button class="data-export-button" type="button" onclick="exportDataViewCsv('${config.view}')">Export CSV</button>` : ''}
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

  function injectionRows() {
    return [...document.querySelectorAll('#injfull-body tr')];
  }

  function applyInjectionHistoryFilter() {
    const rows = injectionRows();
    if (!rows.length) return;
    const search = (document.getElementById('injfull-search')?.value || '').trim().toLowerCase();
    const range = Number(document.getElementById('injfull-range')?.value || 30);
    const dates = rows.map(row => Date.parse(`${row.cells[0]?.textContent.trim()}T12:00:00`)).filter(Number.isFinite);
    const latest = dates.length ? Math.max(...dates) : 0;
    const cutoff = range && latest ? latest - ((range - 1) * 86400000) : 0;
    let visible = 0;
    rows.forEach(row => {
      const date = Date.parse(`${row.cells[0]?.textContent.trim()}T12:00:00`);
      const inRange = !range || (Number.isFinite(date) && date >= cutoff);
      const matches = !search || row.textContent.toLowerCase().includes(search);
      row.hidden = !(inRange && matches);
      if (!row.hidden && row.style.display !== 'none') visible += 1;
    });
    const count = document.getElementById('injfull-count');
    if (count) count.textContent = `${visible} shown`;
  }

  window.exportInjectionHistoryCsv = function () {
    const table = document.querySelector('#injlog-full table');
    if (!table) return;
    const quote = value => `"${String(value ?? '').replace(/↕|↑|↓/g, '').trim().replace(/"/g, '""')}"`;
    const headers = [...table.querySelectorAll('thead th')].map(header => quote(header.textContent));
    const rows = injectionRows().filter(row => !row.hidden && row.style.display !== 'none');
    if (!rows.length) return;
    const output = [headers.join(','), ...rows.map(row => [...row.cells].map(cell => quote(cell.textContent)).join(','))];
    const blob = new Blob([output.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `injection-history-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  function enhanceInjectionLog() {
    const summary = document.getElementById('injlog-summary');
    const full = document.getElementById('injlog-full');
    if (!summary || !full) return;
    const enhanceTables = () => {
      summary.classList.add('injlog-table-scroll');
      const summaryTable = summary.querySelector('table');
      if (summaryTable) {
        summaryTable.classList.add('data-table');
        installTableSorting(summary);
      }
      const table = full.querySelector('table');
      const filterRow = document.getElementById('injfull-compound')?.parentElement;
      if (!table || !filterRow) return;
      full.classList.add('injlog-table-scroll');
      table.classList.add('data-table');
      installTableSorting(full);
      if (!document.getElementById('injfull-search')) {
        const tools = document.createElement('div');
        tools.className = 'injlog-history-tools';
        tools.innerHTML = `<label class="data-view-search"><span aria-hidden="true">⌕</span><span class="sr-only">Search injection history</span><input id="injfull-search" type="search" placeholder="Search history…" autocomplete="off"></label>
          <label class="injlog-range-label"><span>Range</span><select id="injfull-range"><option value="30">Latest 30 days</option><option value="90">Latest 90 days</option><option value="0">All loaded</option></select></label>
          <button class="data-export-button" type="button" onclick="exportInjectionHistoryCsv()">Export CSV</button>
          <button class="data-density-toggle" type="button" onclick="toggleDataDensity()" aria-pressed="false">Compact rows</button>`;
        filterRow.insertAdjacentElement('afterend', tools);
        tools.querySelector('#injfull-search').addEventListener('input', applyInjectionHistoryFilter);
        tools.querySelector('#injfull-range').addEventListener('change', applyInjectionHistoryFilter);
        updateDensityButtons();
      }
      if (filterRow.dataset.historyEnhanced !== 'true') {
        filterRow.dataset.historyEnhanced = 'true';
        filterRow.querySelector('#injfull-compound')?.addEventListener('change', () => {
          injectionRows().forEach(row => { row.hidden = false; });
          applyInjectionHistoryFilter();
        });
        filterRow.querySelector('#injfull-hideskip')?.addEventListener('change', () => {
          injectionRows().forEach(row => { row.hidden = false; });
          applyInjectionHistoryFilter();
        });
      }
      applyInjectionHistoryFilter();
    };
    let enhancing = false;
    const observer = new MutationObserver(() => {
      if (enhancing) return;
      enhancing = true;
      observer.disconnect();
      enhanceTables();
      observer.observe(summary, { childList: true, subtree: true });
      observer.observe(full, { childList: true, subtree: true });
      enhancing = false;
    });
    observer.observe(summary, { childList: true, subtree: true });
    observer.observe(full, { childList: true, subtree: true });
    enhanceTables();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.dataset.dataDensity = localStorage.getItem(DENSITY_KEY) === 'compact' ? 'compact' : 'comfortable';
    VIEWS.forEach(installView);
    enhanceInjectionLog();
    updateDensityButtons();
  });
})();
