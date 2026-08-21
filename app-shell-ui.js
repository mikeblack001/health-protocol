// Credential-free app-shell improvements. Loaded after app.js and labs-ui.js.
(function () {
  'use strict';

  const VIEW_GROUPS = {
    dashboard: 'nav-dashboard',
    peptides: 'nav-pep', tracker: 'nav-pep', changes: 'nav-pep', schedule: 'nav-pep',
    pricing: 'nav-pep', purchases: 'nav-pep', vendors: 'nav-pep', injlog: 'nav-pep', injaudit: 'nav-pep',
    supplements: 'nav-supp', suppdash: 'nav-supp', suppchanges: 'nav-supp', suppvendors: 'nav-supp',
    workouts: 'nav-ex', 'workout-suggestions': 'nav-ex', woschedule: 'nav-ex', drinks: 'nav-ex',
    wktracker: 'nav-ex', wkaudit: 'nav-ex',
    log: 'nav-personal', labs: 'nav-personal', bodycomp: 'nav-personal', goals: 'nav-personal',
    profile: 'nav-personal', recipes: 'nav-personal',
    printlist: 'nav-tools', aicontext: 'nav-tools', databrowser: 'nav-tools'
  };

  const VIEW_TITLES = {
    dashboard: 'Dashboard', peptides: 'Peptides', tracker: 'Peptide Tracker', changes: 'Peptide Changes',
    schedule: 'Peptide Schedule', pricing: 'Pricing', purchases: 'Purchases', vendors: 'Peptide Vendors',
    injlog: 'Injection Log', injaudit: 'Injection Audit', supplements: 'Supplements', suppdash: 'Supplement Dashboard',
    suppchanges: 'Supplement Changes', suppvendors: 'Supplement Vendors', workouts: 'Workouts',
    'workout-suggestions': 'Workout Suggestions', woschedule: 'Workout Schedule', drinks: 'Workout Drinks',
    wktracker: 'Workout Tracker', wkaudit: 'Workout Audit', log: 'Daily Log', labs: 'Labs',
    bodycomp: 'Body & Vitals', goals: 'Goals', profile: 'Profile', recipes: 'Recipes',
    printlist: 'Print List', aicontext: 'AI Context', databrowser: 'Data Browser'
  };

  const originalShowView = window.showView;
  const originalNavDrop = window.navDrop;
  const originalMobileNav = window.mobileNav;
  const originalToggleMobileMenu = window.toggleMobileMenu;
  const originalToggleDrop = window.toggleDrop;
  const originalLoadAll = window.loadAll;
  let routeChangeInProgress = false;
  let quickNavLastFocus = null;

  function validView(view) {
    return Boolean(view && VIEW_GROUPS[view] && document.getElementById('view-' + view));
  }

  function updateActiveNavigation(view) {
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    const activeTab = document.getElementById(VIEW_GROUPS[view]);
    if (activeTab) activeTab.classList.add('active');
    document.querySelectorAll('.mobile-item').forEach(item => {
      const matches = item.getAttribute('onclick')?.includes("mobileNav('" + view + "')");
      item.classList.toggle('active', Boolean(matches));
      if (matches) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
  }

  function finishNavigation(view, writeHistory) {
    if (!validView(view)) return;
    updateActiveNavigation(view);
    document.title = VIEW_TITLES[view] + ' | Health Protocol';
    if (writeHistory && !routeChangeInProgress && location.hash !== '#' + view) {
      history.pushState({ view }, '', '#' + view);
    }
    if (!routeChangeInProgress) window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function openRoute(view) {
    if (!validView(view)) return;
    routeChangeInProgress = true;
    try {
      if (view === 'dashboard') originalShowView('dashboard', { target: document.getElementById('nav-dashboard') });
      else originalNavDrop(view, VIEW_GROUPS[view]);
      finishNavigation(view, false);
    } finally {
      routeChangeInProgress = false;
    }
  }

  function quickNavItems() {
    return Object.keys(VIEW_TITLES).map(view => ({
      view,
      title: VIEW_TITLES[view],
      group: VIEW_GROUPS[view] === 'nav-dashboard' ? 'Main' :
        VIEW_GROUPS[view] === 'nav-pep' ? 'Peptides' :
        VIEW_GROUPS[view] === 'nav-supp' ? 'Supplements' :
        VIEW_GROUPS[view] === 'nav-ex' ? 'Exercise' :
        VIEW_GROUPS[view] === 'nav-personal' ? 'Personal' : 'Tools'
    }));
  }

  function renderQuickNav(query) {
    const results = document.getElementById('quick-nav-results');
    if (!results) return;
    const needle = (query || '').trim().toLowerCase();
    const matches = quickNavItems().filter(item => (item.title + ' ' + item.group).toLowerCase().includes(needle));
    results.innerHTML = matches.length ? matches.map((item, index) => `
      <button class="quick-nav-result${index === 0 ? ' selected' : ''}" data-view="${item.view}" role="option" aria-selected="${index === 0}">
        <span>${item.title}</span><small>${item.group}</small>
      </button>`).join('') : '<p class="quick-nav-empty">No matching section</p>';
    results.querySelectorAll('.quick-nav-result').forEach(button => {
      button.addEventListener('click', () => selectQuickNav(button.dataset.view));
    });
  }

  function closeQuickNav() {
    const modal = document.getElementById('quick-nav-modal');
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('quick-nav-open');
    quickNavLastFocus?.focus();
  }

  function selectQuickNav(view) {
    closeQuickNav();
    if (view === 'dashboard') window.showView('dashboard', { target: document.getElementById('nav-dashboard') });
    else window.navDrop(view, VIEW_GROUPS[view]);
  }

  window.openQuickNav = function () {
    const modal = document.getElementById('quick-nav-modal');
    if (!modal) return;
    quickNavLastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('quick-nav-open');
    const input = document.getElementById('quick-nav-input');
    input.value = '';
    renderQuickNav('');
    window.setTimeout(() => input.focus(), 0);
  };

  function installQuickNav() {
    const statusDot = document.getElementById('statusDot');
    if (statusDot && !document.querySelector('.quick-nav-trigger')) {
      statusDot.insertAdjacentHTML('beforebegin', '<button class="quick-nav-trigger" type="button" onclick="openQuickNav()" aria-label="Find a section">Find <kbd>⌘K</kbd></button>');
    }
    const mobileMain = document.querySelector('.mobile-section');
    if (mobileMain && !mobileMain.querySelector('.mobile-find')) {
      mobileMain.insertAdjacentHTML('beforeend', '<button class="mobile-item mobile-find" type="button" onclick="toggleMobileMenu();openQuickNav()">Find a section</button>');
    }
    document.body.insertAdjacentHTML('beforeend', `
      <div class="quick-nav-modal" id="quick-nav-modal" hidden>
        <div class="quick-nav-panel" role="dialog" aria-modal="true" aria-labelledby="quick-nav-title">
          <div class="quick-nav-search-row">
            <span aria-hidden="true">⌕</span>
            <label class="sr-only" for="quick-nav-input" id="quick-nav-title">Find a section</label>
            <input id="quick-nav-input" type="search" placeholder="Find labs, workouts, injections…" autocomplete="off">
            <button type="button" class="quick-nav-close" aria-label="Close section finder">Esc</button>
          </div>
          <div class="quick-nav-results" id="quick-nav-results" role="listbox"></div>
          <div class="quick-nav-help"><span>↑↓ move</span><span>Enter open</span></div>
        </div>
      </div>`);
    const modal = document.getElementById('quick-nav-modal');
    const input = document.getElementById('quick-nav-input');
    input.addEventListener('input', () => renderQuickNav(input.value));
    input.addEventListener('keydown', event => {
      const buttons = [...document.querySelectorAll('.quick-nav-result')];
      if (!buttons.length) return;
      let current = buttons.findIndex(button => button.classList.contains('selected'));
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        current = event.key === 'ArrowDown' ? (current + 1) % buttons.length : (current - 1 + buttons.length) % buttons.length;
        buttons.forEach((button, index) => {
          button.classList.toggle('selected', index === current);
          button.setAttribute('aria-selected', String(index === current));
        });
        buttons[current].scrollIntoView({ block: 'nearest' });
      } else if (event.key === 'Enter') {
        event.preventDefault();
        selectQuickNav(buttons[Math.max(current, 0)].dataset.view);
      }
    });
    modal.addEventListener('click', event => { if (event.target === modal) closeQuickNav(); });
    modal.querySelector('.quick-nav-close').addEventListener('click', closeQuickNav);
  }

  window.showView = function (view, event) {
    originalShowView(view, event);
    finishNavigation(view, true);
  };

  window.navDrop = function (view, triggerId) {
    originalNavDrop(view, triggerId);
    finishNavigation(view, true);
  };

  window.mobileNav = function (view) {
    originalMobileNav(view);
    finishNavigation(view, true);
  };

  window.toggleMobileMenu = function () {
    originalToggleMobileMenu();
    const menu = document.getElementById('mobileMenu');
    const trigger = document.querySelector('.hamburger');
    const isOpen = menu.classList.contains('open');
    document.body.classList.toggle('menu-open', isOpen);
    menu.setAttribute('aria-hidden', String(!isOpen));
    trigger.setAttribute('aria-expanded', String(isOpen));
    trigger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    if (isOpen) menu.querySelector('.mobile-close')?.focus();
    else trigger.focus();
  };

  window.toggleDrop = function (id, event) {
    originalToggleDrop(id, event);
    document.querySelectorAll('.drop-trigger').forEach(trigger => {
      const expanded = trigger.closest('.nav-dropdown')?.classList.contains('open');
      trigger.setAttribute('aria-expanded', String(Boolean(expanded)));
    });
  };

  window.loadAll = async function () {
    const button = document.querySelector('.sync-btn');
    if (button?.disabled) return;
    if (button) {
      button.disabled = true;
      button.textContent = 'Syncing…';
    }
    await originalLoadAll();
    const online = document.getElementById('statusDot')?.classList.contains('online');
    if (button) {
      button.textContent = online ? 'Synced' : 'Retry';
      button.title = online ? 'Last synced ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Sync failed — try again';
      window.setTimeout(() => {
        button.textContent = 'Sync';
        button.disabled = false;
      }, online ? 1000 : 0);
    }
  };

  function syncFromLocation() {
    const requested = location.hash.replace(/^#/, '');
    openRoute(validView(requested) ? requested : 'dashboard');
  }

  document.addEventListener('keydown', event => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      window.openQuickNav();
      return;
    }
    if (event.key === '/' && !typing && document.getElementById('quick-nav-modal')?.hidden) {
      event.preventDefault();
      window.openQuickNav();
      return;
    }
    if (event.key !== 'Escape') return;
    closeQuickNav();
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu.classList.contains('open')) window.toggleMobileMenu();
    if (typeof window.closeAllDrops === 'function') window.closeAllDrops();
  });

  window.addEventListener('hashchange', syncFromLocation);
  document.addEventListener('DOMContentLoaded', () => {
    installQuickNav();
    document.querySelectorAll('.drop-trigger').forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
    const requested = location.hash.replace(/^#/, '');
    if (validView(requested) && requested !== 'dashboard') openRoute(requested);
    else {
      updateActiveNavigation('dashboard');
      document.title = 'Dashboard | Health Protocol';
    }
  });
})();
