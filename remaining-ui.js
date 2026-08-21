// Final credential-free polish for trackers, logs, health context, and utility views.
(function () {
  'use strict';

  const STANDARD_VIEWS = [
    'workouts', 'tracker', 'injlog', 'log', 'workout-suggestions', 'drinks', 'printlist',
    'goals', 'profile', 'recipes', 'aicontext', 'databrowser', 'suppdash', 'purchases',
    'labs', 'changes', 'injaudit', 'wktracker', 'wkaudit', 'bodycomp'
  ];

  function addHeader(viewId, title, subtitle) {
    const view = document.getElementById('view-' + viewId);
    if (!view || view.querySelector(':scope > .section-header')) return;
    view.insertAdjacentHTML('afterbegin', `<div class="section-header generated-view-header"><div><h2>${title}</h2><p class="section-sub">${subtitle}</p></div></div>`);
  }

  function installInjectionHistoryToggle() {
    const view = document.getElementById('view-injlog');
    const full = document.getElementById('injlog-full');
    if (!view || !full || document.getElementById('injlog-history-toggle')) return;
    const heading = [...view.querySelectorAll(':scope > h3')].find(item => item.textContent.trim() === 'Full Log');
    if (!heading) return;
    heading.className = 'injlog-full-heading';
    heading.innerHTML = '<button type="button" id="injlog-history-toggle" aria-expanded="false"><span><strong>Full Log</strong><small>Recent records, filters, and week notes</small></span><span class="injlog-toggle-label">Show history</span></button>';
    full.hidden = true;
    document.getElementById('injlog-history-toggle').addEventListener('click', event => {
      const button = event.currentTarget;
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      full.hidden = !open;
      button.querySelector('.injlog-toggle-label').textContent = open ? 'Hide history' : 'Show history';
    });
  }

  function installBackToTop() {
    if (document.getElementById('back-to-top')) return;
    document.body.insertAdjacentHTML('beforeend', '<button type="button" id="back-to-top" aria-label="Back to top">↑</button>');
    const button = document.getElementById('back-to-top');
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
    const update = () => button.classList.toggle('visible', window.scrollY > 700);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  document.addEventListener('DOMContentLoaded', () => {
    STANDARD_VIEWS.forEach(id => document.getElementById('view-' + id)?.classList.add('standard-view'));
    addHeader('tracker', 'Peptide Tracker', 'Weekly dosing and injection completion');
    addHeader('wktracker', 'Workout Tracker', 'Log sets and review recent sessions');
    installInjectionHistoryToggle();
    installBackToTop();
    document.getElementById('db-collection')?.setAttribute('aria-label', 'Data collection');
    document.getElementById('db-search')?.setAttribute('aria-label', 'Search all fields');
  });
})();
