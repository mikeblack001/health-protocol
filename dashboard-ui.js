// Credential-free current-health dashboard enhancements.
(function () {
  'use strict';

  const CACHE_KEY = 'hp_dashboard_insights_v2';
  const CACHE_TTL = 10 * 60 * 1000;
  const CURRENT_DRAW_DATE = '2026-08-21';
  const INJECTION_TABLE = 'tblBvEaLkGGipnOFc';
  const DAILY_FIELDS = {
    date: 'fldSk3hNQJTDKOyfT', weight: 'fldKTZ5ML0fnZV3oz', sleep: 'fldy1hM7kymJKN52E',
    deep: 'fld5PGt9ZdFgBzMAM', hrv: 'fldIt4TweBKT7LiAV', rhr: 'fldXDw3aTnOLHk6lh', steps: 'fldUyaoAJXry9xqzb'
  };
  let loading = false;

  const escapeHtml = value => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  function readCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      return cached && Date.now() - cached.savedAt < CACHE_TTL ? cached : null;
    } catch (_) { return null; }
  }

  function writeCache(payload) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), ...payload })); } catch (_) {}
  }

  function recordFields(records) {
    return (records || []).map(record => record.fields || record);
  }

  async function fetchRecentTable(tableId, sortField, pageSize, fields, returnIds) {
    const params = new URLSearchParams();
    params.set('pageSize', String(pageSize));
    params.set('sort[0][field]', sortField);
    params.set('sort[0][direction]', 'desc');
    if (returnIds) params.set('returnFieldsByFieldId', 'true');
    (fields || []).forEach(field => params.append('fields[]', field));
    const response = await fetch(`https://api.airtable.com/v0/${BASE}/${tableId}?${params}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!response.ok) throw new Error(`Airtable returned ${response.status}`);
    return (await response.json()).records || [];
  }

  function fieldText(value) {
    if (Array.isArray(value)) return value.map(fieldText).join(', ');
    if (value && typeof value === 'object') return value.name || value.value || '';
    return String(value ?? '');
  }

  function renderProtocolSnapshot() {
    const target = document.getElementById('dash-protocol-snapshot');
    if (!target || typeof data === 'undefined') return;
    const activePeptides = data.peptides.filter(record => getField(record, 'Status') === 'Active');
    const morning = activePeptides.filter(record => !getField(record, 'Timing').toLowerCase().includes('night'));
    const night = activePeptides.filter(record => getField(record, 'Timing').toLowerCase().includes('night'));
    const activeSupplements = data.supplements.filter(record => getField(record, 'SuppStatus') === 'Active');
    target.innerHTML = `<div class="dashboard-metric-row">
      <div><strong>${morning.length}</strong><span>morning compounds</span></div>
      <div><strong>${night.length}</strong><span>night compounds</span></div>
      <div><strong>${activeSupplements.length}</strong><span>active supplements</span></div>
    </div>
    <p class="dashboard-card-note">Open the full protocol only when you need dose and timing details.</p>`;
  }

  function renderLabs(records) {
    const target = document.getElementById('dash-lab-status');
    if (!target) return;
    const rows = recordFields(records).filter(row => row.Date);
    const dates = [...new Set(rows.map(row => row.Date))].sort().reverse();
    if (!dates.length) {
      target.innerHTML = '<p class="dashboard-empty">No lab results are stored yet.</p>';
      return;
    }
    const latestDate = dates[0];
    const latest = rows.filter(row => row.Date === latestDate);
    const outOfRange = latest.filter(row => row.Status === 'Out of Range');
    const currentDrawReceived = latestDate >= CURRENT_DRAW_DATE;
    const statusClass = currentDrawReceived ? 'complete' : 'pending';
    const statusTitle = currentDrawReceived ? 'August 21 results received' : 'August 21 results pending';
    target.innerHTML = `<div class="dashboard-status-line ${statusClass}">
      <span class="dashboard-status-dot" aria-hidden="true"></span>
      <div><strong>${statusTitle}</strong><span>${currentDrawReceived ? `${latest.length} results in the latest draw` : 'The dashboard will update automatically when results are added.'}</span></div>
    </div>
    <div class="dashboard-lab-summary">
      <div><span>Latest stored draw</span><strong>${escapeHtml(formatDashboardDate(latestDate))}</strong></div>
      <div><span>Out of range</span><strong class="${outOfRange.length ? 'attention' : ''}">${outOfRange.length}</strong></div>
    </div>
    ${outOfRange.length ? `<p class="dashboard-card-note">Latest flags: ${outOfRange.slice(0, 4).map(row => escapeHtml(row.Biomarker)).join(', ')}${outOfRange.length > 4 ? ` +${outOfRange.length - 4}` : ''}</p>` : ''}`;
  }

  function formatDashboardDate(value) {
    const date = new Date(value + 'T12:00:00');
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function renderGoals(records) {
    const target = document.getElementById('dash-health-focus');
    if (!target) return;
    const priority = { High: 0, Medium: 1, Low: 2 };
    const inactive = /complete|completed|resolved|closed/i;
    const activeGoals = recordFields(records)
      .filter(goal => goal.Goal && !inactive.test(goal.CurrentStatus || ''))
      .sort((a, b) => (priority[a.Priority] ?? 9) - (priority[b.Priority] ?? 9) || String(a.Goal).localeCompare(String(b.Goal)));
    const featured = [];
    [/soreness|pain|joint|elbow|shoulder|neck/i, /trt|hematocrit|erythrocytosis|bloodwork/i].forEach(pattern => {
      const match = activeGoals.find(goal => pattern.test(goal.Goal));
      if (match && !featured.includes(match)) featured.push(match);
    });
    activeGoals.forEach(goal => { if (featured.length < 4 && !featured.includes(goal)) featured.push(goal); });
    const goals = featured.slice(0, 4);
    if (!goals.length) {
      target.innerHTML = '<p class="dashboard-empty">No active health priorities.</p>';
      return;
    }
    target.innerHTML = `<div class="dashboard-focus-list">${goals.map(goal => `<button onclick="navDrop('goals','nav-personal')">
      <span class="dashboard-focus-priority ${String(goal.Priority || '').toLowerCase()}">${escapeHtml(goal.Priority || 'Active')}</span>
      <span><strong>${escapeHtml(goal.Goal)}</strong><small>${escapeHtml(goal.CurrentStatus || goal.TargetMetric || 'Active')}</small></span>
    </button>`).join('')}</div>`;
  }

  function groupsFor(plan) {
    const value = plan['Plan Group'];
    return Array.isArray(value) ? value : value ? [value] : [];
  }

  function renderMonitoring(records) {
    const target = document.getElementById('dash-monitoring-queue');
    if (!target) return;
    const plans = recordFields(records);
    const getNow = plans.filter(plan => groupsFor(plan).includes('Get Now'));
    const routine = plans.filter(plan => groupsFor(plan).some(group => /^Routine/.test(group)));
    target.innerHTML = `<div class="dashboard-queue-count"><strong>${getNow.length}</strong><span>tests in Get Now</span></div>
      ${getNow.length ? `<div class="dashboard-test-chips">${getNow.slice(0, 5).map(plan => `<span>${escapeHtml(plan.Test || 'Unnamed test')}</span>`).join('')}${getNow.length > 5 ? `<span>+${getNow.length - 5} more</span>` : ''}</div>` : '<p class="dashboard-empty">Nothing is currently marked Get Now.</p>'}
      <p class="dashboard-card-note">${routine.length} active routine-monitoring tests remain in the plan.</p>`;
  }

  function averageForDays(records, field, days) {
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - (days - 1));
    const values = records.filter(record => {
      const date = new Date(`${record.fields[DAILY_FIELDS.date]}T12:00:00`);
      return !Number.isNaN(date.getTime()) && date >= cutoff;
    }).map(record => Number(record.fields[field])).filter(Number.isFinite);
    return values.length ? values.reduce((total, value) => total + value, 0) / values.length : null;
  }

  function formatMetric(value, decimals, thousands) {
    if (value === null || value === undefined || !Number.isFinite(Number(value))) return '—';
    const number = Number(value);
    return thousands ? Math.round(number).toLocaleString() : number.toFixed(decimals);
  }

  function renderDailySnapshot(records) {
    const target = document.getElementById('dash-daily-snapshot');
    if (!target) return;
    if (!records?.length) {
      target.innerHTML = '<p class="dashboard-empty">No daily health entries are available.</p>';
      return;
    }
    const metrics = [
      { key: 'weight', label: 'Weight', unit: 'lb', decimals: 1 },
      { key: 'sleep', label: 'Sleep', unit: 'hr', decimals: 1 },
      { key: 'deep', label: 'Deep sleep', unit: 'min', decimals: 0 },
      { key: 'hrv', label: 'HRV', unit: 'ms', decimals: 0 },
      { key: 'rhr', label: 'Resting HR', unit: 'bpm', decimals: 0 },
      { key: 'steps', label: 'Steps', unit: '', decimals: 0, thousands: true }
    ];
    const newest = records.find(record => metrics.some(metric => Number.isFinite(Number(record.fields[DAILY_FIELDS[metric.key]])))) || records[0];
    const newestDate = newest.fields[DAILY_FIELDS.date];
    const age = newestDate ? Math.max(0, Math.floor((Date.now() - new Date(`${newestDate}T12:00:00`).getTime()) / 86400000)) : null;
    const freshness = age === 0 ? 'Today' : age === 1 ? 'Yesterday' : age !== null ? `${age} days ago` : 'Date unavailable';
    target.innerHTML = `<div class="dashboard-daily-freshness"><span class="${age !== null && age > 3 ? 'stale' : ''}">${escapeHtml(freshness)}</span><small>Latest logged ${escapeHtml(formatDashboardDate(newestDate))}</small></div>
      <div class="dashboard-daily-metrics">${metrics.map(metric => {
        const field = DAILY_FIELDS[metric.key];
        const latestRecord = records.find(record => Number.isFinite(Number(record.fields[field])));
        const latest = latestRecord ? Number(latestRecord.fields[field]) : null;
        const average7 = averageForDays(records, field, 7);
        const average30 = averageForDays(records, field, 30);
        return `<div><span>${escapeHtml(metric.label)}</span><strong>${formatMetric(latest, metric.decimals, metric.thousands)} <small>${escapeHtml(metric.unit)}</small></strong><em>7d ${formatMetric(average7, metric.decimals, metric.thousands)} · 30d ${formatMetric(average30, metric.decimals, metric.thousands)}</em></div>`;
      }).join('')}</div>`;
  }

  function normalizeActivities(injections, changes, supplementChanges) {
    const injectionActivity = [];
    const protocolActivity = [];
    const supplementActivity = [];
    recordFields(injections).forEach(row => {
      const compound = fieldText(row.Compound);
      const site = fieldText(row.Site).toUpperCase();
      if (!row.Date || !compound || /week note/i.test(compound) || site === 'S') return;
      injectionActivity.push({ date: row.Date, type: 'Injection', title: `${compound} injection`, detail: [fieldText(row.Dose), fieldText(row.Timing)].filter(Boolean).join(' · '), view: 'injlog', nav: 'nav-pep' });
    });
    recordFields(changes).forEach(row => {
      if (!row['Change Date']) return;
      const compound = fieldText(row.Compound) || 'Protocol';
      const changeType = fieldText(row['Change Type']) || 'Change';
      protocolActivity.push({ date: row['Change Date'], type: 'Protocol', title: `${compound} — ${changeType}`, detail: fieldText(row.Description || row['Description of Change']), view: 'changes', nav: 'nav-pep' });
    });
    recordFields(supplementChanges).forEach(row => {
      if (!row['Change Date']) return;
      const supplement = fieldText(row.Supplement) || 'Supplement';
      const changeType = fieldText(row['Change Type']) || 'Change';
      supplementActivity.push({ date: row['Change Date'], type: 'Supplement', title: `${supplement} — ${changeType}`, detail: fieldText(row['Description of Change']), view: 'suppchanges', nav: 'nav-supp' });
    });
    const newestThree = items => items.sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 3);
    return [...newestThree(injectionActivity), ...newestThree(protocolActivity), ...newestThree(supplementActivity)]
      .sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 7);
  }

  function renderRecentActivity(injections, changes, supplementChanges) {
    const target = document.getElementById('dash-recent-activity');
    if (!target) return;
    const activities = normalizeActivities(injections, changes, supplementChanges);
    if (!activities.length) {
      target.innerHTML = '<p class="dashboard-empty">No recent protocol activity is available.</p>';
      return;
    }
    target.innerHTML = `<div class="dashboard-activity-list">${activities.map(item => `<button onclick="navDrop('${item.view}','${item.nav}')">
      <span class="dashboard-activity-dot ${item.type.toLowerCase()}" aria-hidden="true"></span>
      <span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail || item.type)}</small></span>
      <time datetime="${escapeHtml(item.date)}">${escapeHtml(formatDashboardDate(item.date).replace(/, \d{4}$/, ''))}</time>
    </button>`).join('')}</div>`;
  }

  function renderError() {
    ['dash-lab-status', 'dash-health-focus', 'dash-monitoring-queue', 'dash-daily-snapshot', 'dash-recent-activity'].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.innerHTML = '<p class="dashboard-empty">Could not refresh this section. Use ↻ to retry.</p>';
    });
  }

  async function loadDashboardInsights(force) {
    if (loading) return;
    renderProtocolSnapshot();
    const cached = !force && readCache();
    if (cached) {
      renderLabs(cached.labs);
      renderGoals(cached.goals);
      renderMonitoring(cached.plan);
      renderDailySnapshot(cached.daily);
      renderRecentActivity(cached.injections, cached.changes, cached.supplementChanges);
      return;
    }
    loading = true;
    try {
      const payload = { labs: [], goals: [], plan: [], daily: [], injections: [], changes: [], supplementChanges: [] };
      const corePromise = Promise.all([
        fetchTable(TABLES.bloodwork), fetchTable(TABLES.goals), fetchTable(TABLES.labMonitoringPlan, '{Active}=1')
      ]).then(([labs, goals, plan]) => {
        Object.assign(payload, { labs, goals, plan });
        renderLabs(labs); renderGoals(goals); renderMonitoring(plan);
      }).catch(error => {
        console.error('[dashboard] core insights:', error);
        ['dash-lab-status', 'dash-health-focus', 'dash-monitoring-queue'].forEach(id => {
          const element = document.getElementById(id);
          if (element) element.innerHTML = '<p class="dashboard-empty">Could not refresh this section. Use ↻ to retry.</p>';
        });
      });
      const dailyPromise = fetchRecentTable(TABLES.dailyLog, DAILY_FIELDS.date, 60, Object.values(DAILY_FIELDS), true)
        .then(daily => { payload.daily = daily; renderDailySnapshot(daily); })
        .catch(error => { console.error('[dashboard] daily snapshot:', error); renderDailySnapshot([]); });
      const activityPromise = Promise.all([
        fetchRecentTable(INJECTION_TABLE, 'Date', 15),
        fetchRecentTable(TABLES.protocolChanges, 'Change Date', 15),
        fetchRecentTable(TABLES.suppChanges, 'Change Date', 15)
      ]).then(([injections, changes, supplementChanges]) => {
        Object.assign(payload, { injections, changes, supplementChanges });
        renderRecentActivity(injections, changes, supplementChanges);
      }).catch(error => { console.error('[dashboard] activity:', error); renderRecentActivity([], [], []); });
      await Promise.allSettled([corePromise, dailyPromise, activityPromise]);
      writeCache(payload);
    } catch (error) {
      console.error('[dashboard] insights:', error);
      renderError();
    } finally { loading = false; }
  }

  window.refreshDashboardInsights = function () {
    try { localStorage.removeItem(CACHE_KEY); } catch (_) {}
    loadDashboardInsights(true);
  };

  window.openLabMonitoringPlan = function () {
    localStorage.setItem('hp_labs_view_v1', 'plan');
    navDrop('labs', 'nav-personal');
  };

  const baseRenderDashboard = renderDashboard;
  renderDashboard = function () {
    baseRenderDashboard();
    renderProtocolSnapshot();
  };

  document.addEventListener('DOMContentLoaded', () => loadDashboardInsights(false));
})();
