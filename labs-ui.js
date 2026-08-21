// Credential-free Labs UI overrides. Loaded after app.js.

const baseLoadLabs = loadLabs;

loadLabs = async function() {
  await baseLoadLabs();
  if (labsView === 'plan') loadLabMonitoringPlan();
};

setLabsView = function(view) {
  if (!['trend', 'draw', 'plan'].includes(view)) view = 'trend';
  labsView = view;
  const viewSelect = document.getElementById('labs-view-select');
  if (viewSelect) viewSelect.value = view;
  document.getElementById('labs-draw-select').style.display = view === 'draw' ? 'block' : 'none';
  document.getElementById('labs-source-filter').style.display = view === 'plan' ? 'none' : 'block';
  document.getElementById('labs-priority-bar').style.display = view === 'trend' ? 'flex' : 'none';
  document.getElementById('labs-flag-bar').style.display = 'none';
  if (view === 'plan') {
    loadLabMonitoringPlan();
    return;
  }
  if (!labsData.length) return;
  renderLabsFlagBar();
  if (view === 'trend') renderLabsTrend();
  else renderLabsDraw();
};

renderLabMonitoringPlan = function() {
  const el = document.getElementById('labs-content');
  const groups = [
    { name: 'Get Now', description: 'Current request / next draw' },
    { name: 'Routine 3 Months', description: 'Closer monitoring' },
    { name: 'Routine 6 Months', description: 'Routine surveillance' },
    { name: 'Conditional', description: 'Only when clinically indicated' },
  ];
  const groupNames = new Set(groups.map(group => group.name));
  const getGroups = record => {
    const value = record['Plan Group'];
    return Array.isArray(value) ? value : value ? [value] : [];
  };
  const renderCard = record => {
    const category = record.Category || 'Other';
    const frequency = record.Frequency || 'As directed';
    const notes = record.Notes || 'Monitoring rationale not yet documented.';
    return `<details class="lab-plan-item">
      <summary class="lab-plan-item-summary">
        <div class="lab-plan-card-top">
          <h3>${esc(record.Test || 'Unnamed test')}</h3>
          <span class="lab-plan-category">${esc(category)}</span>
        </div>
        <div class="lab-plan-item-meta">
          <span class="lab-plan-frequency">${esc(frequency)}</span>
          <span class="lab-plan-item-chevron" aria-hidden="true"></span>
        </div>
      </summary>
      <p class="lab-plan-item-notes">${esc(notes)}</p>
    </details>`;
  };

  let sections = groups.map(group => {
    const records = labsPlanData
      .filter(record => getGroups(record).includes(group.name))
      .sort((a, b) => (a.Category || '').localeCompare(b.Category || '') || (a.Test || '').localeCompare(b.Test || ''));
    if (!records.length) return '';
    return `<details class="lab-plan-section">
      <summary class="lab-plan-heading">
        <div><h2>${esc(group.name)}</h2><span>${esc(group.description)}</span></div>
        <div class="lab-plan-heading-actions"><strong>${records.length}</strong><span class="lab-plan-chevron" aria-hidden="true"></span></div>
      </summary>
      <div class="lab-plan-cards">${records.map(renderCard).join('')}</div>
    </details>`;
  }).join('');

  const ungrouped = labsPlanData
    .filter(record => !getGroups(record).some(group => groupNames.has(group)))
    .sort((a, b) => (a.Test || '').localeCompare(b.Test || ''));
  if (ungrouped.length) {
    sections += `<details class="lab-plan-section">
      <summary class="lab-plan-heading"><div><h2>Other Active Tests</h2><span>Not yet assigned to a plan group</span></div><div class="lab-plan-heading-actions"><strong>${ungrouped.length}</strong><span class="lab-plan-chevron" aria-hidden="true"></span></div></summary>
      <div class="lab-plan-cards">${ungrouped.map(renderCard).join('')}</div>
    </details>`;
  }

  el.innerHTML = `<div class="lab-plan-intro">
      <div><strong>Lab Monitoring Plan</strong><span>Live from Airtable · active tests only</span></div>
      <span>${labsPlanData.length} active tests</span>
    </div>
    <div class="lab-plan-grid">${sections || '<p class="lab-plan-empty">No active monitoring-plan tests found.</p>'}</div>`;
};
