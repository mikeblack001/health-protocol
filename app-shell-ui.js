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
    if (event.key !== 'Escape') return;
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu.classList.contains('open')) window.toggleMobileMenu();
    if (typeof window.closeAllDrops === 'function') window.closeAllDrops();
  });

  window.addEventListener('hashchange', syncFromLocation);
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.drop-trigger').forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
    const requested = location.hash.replace(/^#/, '');
    if (validView(requested) && requested !== 'dashboard') openRoute(requested);
    else {
      updateActiveNavigation('dashboard');
      document.title = 'Dashboard | Health Protocol';
    }
  });
})();
