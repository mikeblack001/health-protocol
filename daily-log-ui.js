// Daily Log loader aligned with the current Airtable schema.
(function () {
  'use strict';

  const FIELDS = {
    date: 'fldSk3hNQJTDKOyfT',
    weight: 'fldKTZ5ML0fnZV3oz',
    sleep: 'fldy1hM7kymJKN52E',
    deep: 'fld5PGt9ZdFgBzMAM',
    hrv: 'fldIt4TweBKT7LiAV',
    rhr: 'fldXDw3aTnOLHk6lh',
    steps: 'fldUyaoAJXry9xqzb',
    wakeups: 'fldjFJ8FystoDkLVX',
    water: 'fldDvpkWlQK2Kw5wB',
    scoops: 'fldpYwPH8EsxC0yCq',
    activeCalories: 'fld012Y04LIB08dkB',
    bodyFat: 'fld8cAib9mOsXEwpp'
  };

  const escapeHtml = value => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function value(record, field, decimals) {
    const raw = record.fields[field];
    if (raw === null || raw === undefined || raw === '') return '';
    return decimals === undefined ? raw : Number(raw).toFixed(decimals);
  }

  function hideRetiredInputs() {
    ['log-energy', 'log-cortisol', 'log-mood'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.value = '';
        input.disabled = true;
      }
      const field = input?.closest('.form-field');
      if (field) field.hidden = true;
    });
  }

  window.renderLogHistory = function (records, days) {
    const history = document.getElementById('log-history');
    if (!history) return;
    let rows = records || [];
    if (days > 0) {
      const cutoff = new Date();
      cutoff.setHours(0, 0, 0, 0);
      cutoff.setDate(cutoff.getDate() - days);
      rows = rows.filter(record => new Date(`${record.fields[FIELDS.date]}T12:00:00`) >= cutoff);
    }
    if (!rows.length) {
      history.innerHTML = '<div class="data-view-empty">No records in this range.</div>';
      return;
    }
    const columns = [
      ['Date', FIELDS.date], ['Weight', FIELDS.weight, 1], ['Body fat', FIELDS.bodyFat, 1],
      ['Sleep', FIELDS.sleep, 1], ['Deep', FIELDS.deep, 0], ['HRV', FIELDS.hrv, 0],
      ['RHR', FIELDS.rhr, 0], ['Steps', FIELDS.steps], ['Water', FIELDS.water, 1],
      ['Scoops', FIELDS.scoops, 1], ['Active cal', FIELDS.activeCalories, 0], ['Wakeups', FIELDS.wakeups, 0]
    ];
    history.innerHTML = `<div class="table-wrap"><table class="data-table daily-log-history-table">
      <thead><tr>${columns.map(column => `<th>${escapeHtml(column[0])}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(record => `<tr>${columns.map(column => `<td>${escapeHtml(value(record, column[1], column[2]))}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`;
  };

  window.loadLog = async function () {
    const history = document.getElementById('log-history');
    if (!history) return;
    history.innerHTML = '<div class="dashboard-insight-loading">Loading daily history…</div>';
    try {
      const records = [];
      let offset = '';
      do {
        const params = new URLSearchParams();
        params.set('returnFieldsByFieldId', 'true');
        params.set('pageSize', '100');
        params.set('sort[0][field]', FIELDS.date);
        params.set('sort[0][direction]', 'desc');
        Object.values(FIELDS).forEach(field => params.append('fields[]', field));
        if (offset) params.set('offset', offset);
        const response = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLES.dailyLog}?${params}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error?.message || `Airtable returned ${response.status}`);
        records.push(...(result.records || []));
        offset = result.offset || '';
      } while (offset);
      logAllRecords = records;
      renderLogDash(records);
      renderLogHistory(records, logDays);
      const today = new Date().toISOString().split('T')[0];
      const dateInput = document.getElementById('log-entry-date');
      if (dateInput) dateInput.value = today;
      prefillLogDate(today);
    } catch (error) {
      history.innerHTML = `<div class="data-view-empty">Daily history could not load. ${escapeHtml(error.message)}</div>`;
      console.error('[daily log]', error);
    }
  };

  document.addEventListener('DOMContentLoaded', hideRetiredInputs);
})();
