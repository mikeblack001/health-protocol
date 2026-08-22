// Credential-free lab draw summaries and comparisons.
(function () {
  'use strict';

  const CURRENT_DRAW_DATE = '2026-08-21';
  const html = value => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  function displayDate(value) {
    const date = new Date(value + 'T12:00:00');
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function numeric(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function selectedDrawDate(mode, dates) {
    if (mode === 'draw') return document.getElementById('labs-draw-select')?.value || dates[0];
    return dates[0];
  }

  function comparisonRows(current, previous) {
    if (!previous.length) return [];
    const previousByMarker = new Map(previous.map(row => [row.Biomarker, row]));
    return current.map(row => {
      const before = previousByMarker.get(row.Biomarker);
      const currentValue = numeric(row.Value);
      const previousValue = numeric(before?.Value);
      if (currentValue === null || previousValue === null) return null;
      const delta = currentValue - previousValue;
      const percentage = previousValue === 0 ? null : (delta / Math.abs(previousValue)) * 100;
      return { marker: row.Biomarker, current: currentValue, previous: previousValue, delta, percentage, units: row.Units || before?.Units || '' };
    }).filter(Boolean).sort((a, b) => Math.abs(b.percentage ?? b.delta) - Math.abs(a.percentage ?? a.delta));
  }

  function renderLabInsights(mode) {
    const content = document.getElementById('labs-content');
    if (!content || labsView === 'plan') return;
    content.querySelector('.lab-draw-insights')?.remove();
    const filtered = getFilteredLabsData();
    const dates = [...new Set(filtered.map(row => row.Date).filter(Boolean))].sort().reverse();
    if (!dates.length) return;
    const selected = selectedDrawDate(mode, dates);
    const selectedIndex = dates.indexOf(selected);
    const current = filtered.filter(row => row.Date === selected);
    const olderDates = selectedIndex >= 0 ? dates.slice(selectedIndex + 1) : [];
    const previousDate = olderDates.find(date => comparisonRows(current, filtered.filter(row => row.Date === date)).length) || olderDates[0] || null;
    const previous = previousDate ? filtered.filter(row => row.Date === previousDate) : [];
    const flagged = current.filter(row => row.Status === 'Out of Range');
    const allComparisons = comparisonRows(current, previous);
    const comparisons = allComparisons.slice(0, 8);
    const source = getLabsSource() || 'All sources';
    const pending = dates[0] < CURRENT_DRAW_DATE;

    const insight = document.createElement('section');
    insight.className = 'lab-draw-insights';
    insight.innerHTML = `<div class="lab-insight-heading">
        <div><span>${mode === 'draw' ? 'Selected draw' : 'Latest stored draw'}</span><h2>${html(displayDate(selected))}</h2></div>
        <div class="lab-insight-actions"><span>${html(source)}</span><button type="button" onclick="exportLabDrawCsv('${html(selected)}')">Export CSV</button></div>
      </div>
      ${pending && selected === dates[0] ? `<div class="lab-result-pending"><span aria-hidden="true"></span><div><strong>August 21 results are still pending</strong><small>This summary will move to the new draw automatically after results are added.</small></div></div>` : ''}
      <div class="lab-insight-stats">
        <div><strong>${current.length}</strong><span>results</span></div>
        <div class="${flagged.length ? 'attention' : ''}"><strong>${flagged.length}</strong><span>out of range</span></div>
        <div><strong>${previousDate ? allComparisons.length : 0}</strong><span>comparable markers</span></div>
      </div>
      ${flagged.length ? `<div class="lab-flagged-summary"><strong>Flagged in this draw</strong><div>${flagged.map(row => `<span><b>${html(row.Biomarker)}</b> ${html(row.Value)} ${html(row.Units || '')}</span>`).join('')}</div></div>` : '<p class="lab-no-flags">No results in this draw are marked out of range.</p>'}
      ${previousDate && comparisons.length ? `<details class="lab-comparison">
        <summary><span><strong>Compare with ${html(displayDate(previousDate))}</strong><small>Largest numeric changes first</small></span><span class="lab-comparison-action">Show comparison</span></summary>
        <div class="lab-comparison-grid">${comparisons.map(item => `<div>
          <span>${html(item.marker)}</span>
          <strong>${html(item.previous)} <i aria-hidden="true">→</i> ${html(item.current)} <small>${html(item.units)}</small></strong>
          <em class="${item.delta > 0 ? 'up' : item.delta < 0 ? 'down' : ''}">${item.delta > 0 ? '↑' : item.delta < 0 ? '↓' : '–'} ${item.percentage === null ? html(Math.abs(item.delta).toFixed(2)) : `${html(Math.abs(item.percentage).toFixed(1))}%`}</em>
        </div>`).join('')}</div>
      </details>` : ''}`;
    content.insertAdjacentElement('afterbegin', insight);
  }

  window.exportLabDrawCsv = function (date) {
    const rows = getFilteredLabsData().filter(row => row.Date === date);
    const fields = ['Biomarker', 'Value', 'Units', 'Status', 'Lab Type', 'Source', 'Date'];
    const quote = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [fields.map(quote).join(','), ...rows.map(row => fields.map(field => quote(row[field])).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lab-results-${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const baseTrend = renderLabsTrend;
  renderLabsTrend = function () {
    baseTrend();
    renderLabInsights('trend');
  };

  renderLabsDraw = function () {
    const content = document.getElementById('labs-content');
    const filtered = getFilteredLabsData();
    if (!filtered.length) {
      content.innerHTML = '<p style="color:var(--muted);padding:16px">No lab results for this source.</p>';
      return;
    }
    const dates = [...new Set(filtered.map(row => row.Date).filter(Boolean))].sort().reverse();
    const selector = document.getElementById('labs-draw-select');
    const requested = dates.includes(selector.value) ? selector.value : dates[0];
    selector.innerHTML = dates.map(date => `<option value="${html(date)}">${html(date)}</option>`).join('');
    selector.value = requested;
    const records = filtered.filter(row => row.Date === requested);
    const byType = {};
    records.forEach(row => {
      const type = row['Lab Type'] || 'Other';
      (byType[type] ||= []).push(row);
    });
    const flagged = records.filter(row => row.Status === 'Out of Range');
    let output = flagged.length ? `<div class="lab-draw-flag-bar">⚠ <strong>${flagged.length} out of range:</strong> ${flagged.map(row => html(row.Biomarker)).join(', ')}</div>` : '';
    Object.keys(byType).sort().forEach(type => {
      output += `<div class="table-wrap lab-draw-table"><div class="timing-header">${html(type)}</div>
        <table class="data-table"><thead><tr><th>Biomarker</th><th>Value</th><th>Units</th><th>Status</th></tr></thead><tbody>
        ${byType[type].sort((a, b) => String(a.Biomarker || '').localeCompare(String(b.Biomarker || ''))).map(row => {
          const out = row.Status === 'Out of Range';
          return `<tr><td><strong>${html(row.Biomarker || '')}</strong></td><td class="lab-draw-value ${out ? 'out' : ''}">${html(row.Value ?? '')}</td><td>${html(row.Units || '')}</td><td><span class="lab-draw-status ${out ? 'out' : ''}">${out ? 'Out of Range' : 'In Range'}</span></td></tr>`;
        }).join('')}</tbody></table></div>`;
    });
    content.innerHTML = output || '<p style="color:var(--muted);padding:16px">No data for this draw.</p>';
    renderLabInsights('draw');
  };
})();
