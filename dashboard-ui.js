// Credential-free current-health dashboard enhancements.
(function () {
  'use strict';

  const CACHE_KEY = 'hp_dashboard_insights_v1';
  const CACHE_TTL = 10 * 60 * 1000;
  const CURRENT_DRAW_DATE = '2026-08-21';
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

  function renderError() {
    ['dash-lab-status', 'dash-health-focus', 'dash-monitoring-queue'].forEach(id => {
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
      return;
    }
    loading = true;
    try {
      const [labs, goals, plan] = await Promise.all([
        fetchTable(TABLES.bloodwork),
        fetchTable(TABLES.goals),
        fetchTable(TABLES.labMonitoringPlan, '{Active}=1')
      ]);
      writeCache({ labs, goals, plan });
      renderLabs(labs);
      renderGoals(goals);
      renderMonitoring(plan);
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
