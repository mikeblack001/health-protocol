// Shared, credential-free improvements for data-heavy views.
(function () {
  'use strict';

  const DENSITY_KEY = 'hp_data_density_v1';
  const VIEWS = [
    { view: 'peptides', content: 'peptides-content', noun: 'compounds', search: 'Search compounds, doses, or purposes…' },
    { view: 'supplements', content: 'supps-content', noun: 'supplements', search: 'Search supplements, brands, or purposes…' },
    { view: 'vendors', content: 'vendors-content', noun: 'vendors', search: 'Search vendors or peptides carried…', kind: 'vendors' },
    { view: 'pricing', content: 'pricing-content', noun: 'compounds', search: 'Search compounds or vendors…', kind: 'groups' },
    { view: 'purchases', content: 'purchases-content', noun: 'purchases' },
    { view: 'changes', content: 'changes-content', noun: 'changes' },
    { view: 'suppchanges', content: 'suppchanges-content', noun: 'changes' },
    { view: 'suppvendors', content: 'suppvendors-content', noun: 'supplements', search: 'Search vendors or supplements…' }
  ];

  function primaryRows(container, kind) {
    if (kind === 'groups') return [...container.querySelectorAll('.pricing-group')];
    if (kind === 'vendors') return [...container.querySelectorAll('tbody > tr')].filter(row => !row.id.startsWith('vendor-expand-'));
    return [...container.querySelectorAll('tbody > tr')];
  }

  function updateTableGroups(container) {
    container.querySelectorAll('.table-wrap').forEach(wrap => {
      const rows = [...wrap.querySelectorAll('tbody > tr')].filter(row => !row.id.startsWith('vendor-expand-'));
      wrap.classList.toggle('data-filter-empty', Boolean(rows.length) && rows.every(row => row.hidden));
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
