/* [ICONS] ════════════════════════════════════ */
const ICONS = {
  fuel: `<svg class="icon-inline" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L19.5 6.5"/><path d="M3 10h11"/><path d="M7 6h3"/></svg>`,
  analytics: `<svg class="icon-inline" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  store: `<svg class="icon-inline" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 2-4h16l2 4"/><path d="M4 7v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7"/><path d="M9 22v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/></svg>`,
  edit: `<svg class="icon-inline" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
  trash: `<svg class="icon-inline" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
  arrowDown: `<svg class="icon-inline" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`,
  arrowUp: `<svg class="icon-inline" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
  check: `<svg class="icon-inline" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  save: `<svg class="icon-inline" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
  alert: `<svg class="icon-inline" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  zap: `<svg class="icon-inline" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  route: `<svg class="icon-inline" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>`,
  droplet: `<svg class="icon-inline" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`,
  dollar: `<svg class="icon-inline" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  tag: `<svg class="icon-inline" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r="2"/></svg>`,
  error: `<svg class="icon-inline" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
};
/* [/ICONS] */

/* [THEMING] ══════════════════════════════════ */
function applyUserTheme(user) {
  if (typeof document === 'undefined') return;
  if (document.body && typeof document.body.setAttribute === 'function') {
    if (user) document.body.setAttribute('data-user', user);
    else document.body.removeAttribute('data-user');
  }
  if (document.documentElement && typeof document.documentElement.setAttribute === 'function') {
    if (user) document.documentElement.setAttribute('data-user', user);
    else document.documentElement.removeAttribute('data-user');
  }
  if (typeof document.querySelector === 'function') {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', user === 'Josy' ? '#0e0d14' : (user === 'Luccas' ? '#0c1017' : '#0c0f17'));
    }
  }
}
/* [/THEMING] */

/* [STATE] ════════════════════════════════════ */
let currentUser        = null;     // 'Luccas' ou 'Josy'
let records            = [];
let postos             = [];       // [{id, nome}]
let currentTab         = 'home';
let analyticsBuilt     = false;
let trendMetric        = 'spend';
let trendMonths        = [];
let editMode           = false;
let selectedPostoNome  = '';
let pendingDeleteId    = null;
let pendingDeleteUser  = null;
let editingRecordUser  = null;
let pendingDeletePostoId = null;
let editingPostoId     = null;
let pendingLoads = 0;
let profileEpoch      = 0;
let recordsLoadSequence = 0;
const dialogTriggers = new Map();
let sortOrder          = 'desc';   // 'desc' = recente primeiro, 'asc' = antigo primeiro
let lastRefreshTs      = null;
let toastTimeoutId     = null;
const CACHE_PREFIX     = 'fuelapp_cache';
const CACHE_TTL_MS     = 5 * 60 * 1000; // 5 minutos

/* [/STATE] */

/* [INIT] ═════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  setNow();
  document.addEventListener('keydown', handleDialogKeydown);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', positionFormSheet);
    window.visualViewport.addEventListener('scroll', positionFormSheet);
  }
  document.getElementById('form').addEventListener('focusin', e => {
    if (e.target.closest('.form-fields')) {
      setTimeout(() => e.target.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 150);
    }
  });
  document.getElementById('form').addEventListener('invalid', e => {
    showToast('Confira ' + (e.target.labels?.[0]?.textContent.trim() || 'o campo obrigatório'), 'err');
  }, true);

  ['f-comb', 'f-litros', 'f-valor', 'f-kmtotal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const clear = () => {
        el.classList.remove('is-invalid');
        el.removeAttribute?.('aria-invalid');
      };
      el.addEventListener('input', clear);
      el.addEventListener('change', clear);
    }
  });

  const toastEl = document.getElementById('toast');
  if (toastEl) {
    toastEl.addEventListener('click', () => {
      toastEl.className = 'toast';
      if (toastTimeoutId && typeof clearTimeout === 'function') {
        clearTimeout(toastTimeoutId);
        toastTimeoutId = null;
      }
    });
  }

  // Esconde a splash
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.classList.add('hide');
  }, 1200);

  // AUTO-LOGIN: lembra o último usuário
  const saved = localStorage.getItem('fuelapp_user');
  if (saved) selectUser(saved);
  else applyUserTheme(null);
});
/* [/INIT] */

function showDialog(id, focusSelector) {
  const overlay = document.getElementById(id);
  dialogTriggers.set(id, document.activeElement);
  overlay.classList.add('open');
  setTimeout(() => {
    if (overlay.classList.contains('open')) overlay.querySelector(focusSelector)?.focus?.();
  }, 0);
}

function hideDialog(id) {
  const overlay = document.getElementById(id);
  if (!overlay.classList.contains('open')) return;
  overlay.classList.remove('open');
  dialogTriggers.get(id)?.focus?.();
  dialogTriggers.delete(id);
}

function handleDialogKeydown(e) {
  const id = ['confirm-record-overlay', 'confirm-posto-overlay', 'posto-overlay', 'overlay']
    .find(id => document.getElementById(id).classList.contains('open'));
  if (!id) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    ({ 'confirm-record-overlay': closeConfirmRecord, 'confirm-posto-overlay': closeConfirmPosto,
       'posto-overlay': closePostoModal, overlay: closeModal })[id]();
    return;
  }
  if (e.key !== 'Tab') return;
  const focusable = [...document.getElementById(id).querySelectorAll('button:not(:disabled), input:not([type="hidden"]):not(:disabled), select:not(:disabled)')]
    .filter(el => el.getClientRects().length);
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (!document.getElementById(id).contains(document.activeElement)) {
    e.preventDefault(); first.focus();
  } else if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
}

/* [USER] ═════════════════════════════════════ */
function selectUser(user) {
  profileEpoch++;
  closeModal();
  closeConfirmRecord();
  closePostoModal();
  closeConfirmPosto();
  editMode = false;
  const saveBtn = document.getElementById('btn-salvar');
  if (saveBtn) saveBtn.disabled = false;
  currentUser = user;
  localStorage.setItem('fuelapp_user', user);
  applyUserTheme(user);

  // Carrega a preferência de ordenação do localStorage
  sortOrder = localStorage.getItem('fuelapp_sortOrder') || 'desc';
  updateSortButton();
  
  const userSelect = document.getElementById('user-select');
  if (userSelect && userSelect.classList) userSelect.classList.add('hidden');

  const homeTitle = document.getElementById('home-title');
  if (homeTitle) {
    const carTag = user === 'Josy' ? 'LOGAN' : 'IDEA';
    homeTitle.innerHTML = `${ICONS.fuel} <span>${user}</span> <span class="header-user-tag">${carTag}</span>`;
  }

  // LIMPA dados antigos
  records = []; postos = []; selectedPostoNome = ''; analyticsBuilt = false;
  const listEl = document.getElementById('list');
  if (listEl) {
    listEl.innerHTML = `<div class="loading"><div class="loading-spinner"></div>Carregando registros...</div>`;
  }
  const sMes = document.getElementById('s-mes');
  if (sMes) sMes.textContent = '—';
  const sKml = document.getElementById('s-kml');
  if (sKml) sKml.textContent = '—';
  const sPreco = document.getElementById('s-preco');
  if (sPreco) sPreco.textContent = '—';
  updateRefreshMeta(null);

  setLoaderText('Carregando dados...');

  switchTab('home');
  loadRecords();
  loadPostos();
}

function logout() {
  profileEpoch++;
  closeModal();
  closeConfirmRecord();
  closePostoModal();
  closeConfirmPosto();
  editMode = false;
  const saveBtn = document.getElementById('btn-salvar');
  if (saveBtn) saveBtn.disabled = false;
  currentUser    = null;
  records        = [];
  postos         = [];
  analyticsBuilt = false;
  localStorage.removeItem('fuelapp_user');
  applyUserTheme(null);
  const homeTitle = document.getElementById('home-title');
  if (homeTitle) {
    homeTitle.innerHTML = `${ICONS.fuel} <span>Abastecimentos</span>`;
  }
  const userSelect = document.getElementById('user-select');
  if (userSelect && userSelect.classList) userSelect.classList.remove('hidden');
}

/* [SORT] ═════════════════════════════════════ */
function toggleSortOrder() {
  sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
  localStorage.setItem('fuelapp_sortOrder', sortOrder);
  updateSortButton();
  renderList(records);
}

function updateSortButton() {
  const btn = document.getElementById('btn-sort');
  if (!btn) return;
  if (sortOrder === 'desc') {
    btn.innerHTML = `${ICONS.arrowDown} <span>Recente</span>`;
    btn.title = 'Ordenar: do mais recente para o mais antigo';
  } else {
    btn.innerHTML = `${ICONS.arrowUp} <span>Antigo</span>`;
    btn.title = 'Ordenar: do mais antigo para o mais recente';
  }
}
/* [/SORT] */
/* [/USER] */

/* [NAVIGATION] ═══════════════════════════════ */
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.page').forEach(p     => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.bottom-nav .nav-item:not(.nav-registrar)').forEach(n =>
    n.setAttribute('aria-current', n.id === 'nav-' + tab ? 'page' : 'false'));
  const page = document.getElementById('page-' + tab);
  if (page) page.classList.add('active');
  const nav = document.getElementById('nav-'  + tab);
  if (nav) nav.classList.add('active');
  if (tab === 'analytics' && records.length && !analyticsBuilt) renderAnalytics(records);
}

function refreshData() {
  if (!currentUser) return;
  showToast('Forçando atualização...', '');
  setLoaderText('Atualizando dados...');
  loadRecords(true);
  loadPostos(true);
}

/* [/NAVIGATION] */

/* [LOAD-DATA] ════════════════════════════════ */
function loadRecords(forceRefresh = false) {
  if (!currentUser) return;
  const user = currentUser;
  const epoch = profileEpoch;
  const request = ++recordsLoadSequence;

  const cache = !forceRefresh ? getCachedData(user, 'records') : null;
  if (cache && cache.data && cache.data.length) {
    records = cache.data; analyticsBuilt = false;
    renderStats(records); renderList(records);
    refreshRecentChoices();
    lastRefreshTs = cache.ts;
    updateRefreshMeta(lastRefreshTs);
    if (!forceRefresh && isCacheFresh(cache)) {
      return;
    }
  }

  pendingLoads++;
  if (!cache || forceRefresh) showLoader();
  google.script.run
    .withSuccessHandler(data => {
      if (profileEpoch !== epoch || request !== recordsLoadSequence) { checkLoadsDone(); return; }
      records = data; analyticsBuilt = false;
      setCachedData(user, 'records', data);
      lastRefreshTs = Date.now();
      updateRefreshMeta(lastRefreshTs);
      renderStats(data); renderList(data);
      refreshRecentChoices();
      if (currentTab === 'analytics') renderAnalytics(data);
      checkLoadsDone();
    })
    .withFailureHandler(err => {
      if (profileEpoch !== epoch || request !== recordsLoadSequence) { checkLoadsDone(); return; }
      if (records.length) {
        showToast('Erro ao atualizar abastecimentos', 'err');
      } else {
        const listEl = document.getElementById('list');
        if (listEl) {
          listEl.innerHTML =
            `<div class="empty">
               <div class="empty-icon">${ICONS.error}</div>
               <p style="color:var(--red);margin-bottom:14px">Não foi possível carregar os abastecimentos.<br><small>${err?.message || 'Falha de conexão com o servidor'}</small></p>
               <button type="button" class="btn-empty-action" onclick="refreshData()">🔄 Tentar novamente</button>
             </div>`;
        }
      }
      checkLoadsDone();
    })
    .getRecords(user);
}

function loadPostos(forceRefresh = false) {
  if (!currentUser) return;
  const user = currentUser;
  const epoch = profileEpoch;

  const cache = !forceRefresh ? getCachedData(user, 'postos') : null;
  if (cache && cache.data) {
    postos = cache.data;
    renderPostoPicker();
    renderAdminPostos();
    if (!forceRefresh && isCacheFresh(cache)) {
      return;
    }
  }

  pendingLoads++;
  if (!cache || forceRefresh) showLoader();
  google.script.run
    .withSuccessHandler(data => {
      if (profileEpoch !== epoch) { checkLoadsDone(); return; }
      postos = data;
      setCachedData(user, 'postos', data);
      renderPostoPicker();
      renderAdminPostos();
      checkLoadsDone();
    })
    .withFailureHandler(err => {
      if (profileEpoch !== epoch) { checkLoadsDone(); return; }
      if (postos.length) {
        showToast('Erro ao atualizar postos', 'err');
      } else {
        const postosList = document.getElementById('postos-list');
        if (postosList) {
          postosList.innerHTML =
            `<div class="empty">
               <div class="empty-icon">${ICONS.error}</div>
               <p style="color:var(--red);margin-bottom:14px">Não foi possível carregar os postos.<br><small>${err?.message || 'Falha de conexão com o servidor'}</small></p>
               <button type="button" class="btn-empty-action" onclick="refreshData()">🔄 Tentar novamente</button>
             </div>`;
        }
      }
      checkLoadsDone();
    })
    .getPostos(user);
}

/* esconde o overlay só quando tudo terminou */
function checkLoadsDone() {
  pendingLoads = Math.max(0, pendingLoads - 1);
  if (pendingLoads === 0) hideLoader();
}
/* [/LOAD-DATA] */

/* [HELPER-ISFULL] ════════════════════════════ */
function isFull(r) {
  return !(r['Parcial?'] === true || String(r['Parcial?']) === 'true');
}

function getCacheKey(user, type) {
  const location = typeof window !== 'undefined' && window.location;
  const params = location && new URLSearchParams(location.search);
  const isMock = location && (['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname) ||
    location.protocol === 'file:' || params.get('mock') === '1');
  const scenario = isMock ? params.get('scenario') || 'default' : null;
  return `${CACHE_PREFIX}_${user}_${type}${scenario ? `_mock_${scenario}` : ''}`;
}

function getCachedData(user, type) {
  try {
    const raw = localStorage.getItem(getCacheKey(user, type));
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function setCachedData(user, type, data) {
  try {
    localStorage.setItem(getCacheKey(user, type), JSON.stringify({ ts: Date.now(), data }));
  } catch (err) {
    // quota excedida ou similar
  }
}

function invalidateRecordsCache(user) {
  try {
    localStorage.removeItem(getCacheKey(user, 'records'));
  } catch (err) {
    showToast('Não foi possível limpar o cache de registros', 'err');
  }
}

function isCacheFresh(cache) {
  return cache && (Date.now() - cache.ts) < CACHE_TTL_MS;
}

function updateRefreshMeta(timestamp) {
  const el = document.getElementById('refresh-meta');
  if (!el) return;
  if (!timestamp) {
    el.textContent = 'Última atualização: —';
    return;
  }
  const date = new Date(timestamp);
  const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  el.innerHTML = `Última atualização: <strong>${dateStr} às ${timeStr}</strong>`;
}

/* [STATS] ════════════════════════════════════ */
function renderStats(data) {
  const now = new Date();
  const thisMo = data.filter(r => {
    const d = new Date(r['Data']);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalMes = thisMo.reduce((s, r) => s + (+r['Valor'] || 0), 0);

  const fullWithKml = data.filter(r => isFull(r) && +r['KM/L Trip'] > 0);
  const mediaKml = fullWithKml.length
    ? fullWithKml.reduce((s, r) => s + (+r['KM/L Trip'] || 0), 0) / fullWithKml.length : 0;

  const comPreco = data.filter(r => +r['Litros'] && +r['Valor']);
  const mediaPreco = comPreco.length
    ? comPreco.reduce((s, r) => s + (+r['Valor'] / +r['Litros']), 0) / comPreco.length : 0;

  const sMes = document.getElementById('s-mes');
  if (sMes) sMes.textContent = totalMes ? formatBRL(totalMes) : 'R$ 0,00';
  const sKml = document.getElementById('s-kml');
  if (sKml) sKml.textContent = mediaKml ? `${formatNumber(mediaKml, 1)}` : '—';
  const sPreco = document.getElementById('s-preco');
  if (sPreco) sPreco.textContent = mediaPreco ? `R$ ${formatNumber(mediaPreco, 2)}` : '—';

  const moName = now.toLocaleDateString('pt-BR', { month: 'long' });
  const subtitle = document.getElementById('subtitle');
  if (subtitle) subtitle.textContent = `${data.length} registros • ${capitalize(moName)}`;
  const badgeMes = document.getElementById('badge-mes');
  if (badgeMes) badgeMes.textContent = thisMo.length ? `${thisMo.length} este mês` : 'sem registro';
}
/* [/STATS] */

/* [LIST] ═════════════════════════════════════ */
function renderList(data) {
  const el = document.getElementById('list');
  if (!el) return;
  if (!data.length) {
    el.innerHTML = `<div class="empty">
      <div class="empty-icon">${ICONS.fuel}</div>
      <p style="margin-bottom:16px">Nenhum abastecimento registrado ainda.<br>Comece registrando o primeiro!</p>
      <button type="button" class="btn-empty-action" onclick="openModal()">＋ Registrar Abastecimento</button>
    </div>`;
    return;
  }
  // Ordena por data de acordo com sortOrder
  const sorted = [...data].sort((a, b) => {
    const dateA = new Date(a['Data']);
    const dateB = new Date(b['Data']);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const groups = sorted.reduce((acc, r) => {
    const d     = new Date(r['Data']);
    const group = capitalize(d.toLocaleDateString('pt-BR', { month:'long', year:'numeric' }));
    if (!acc[group]) acc[group] = [];
    acc[group].push(r);
    return acc;
  }, {});

  const displayedRecords = [];
  el.innerHTML = Object.keys(groups).map(group => {
    const rows = groups[group];
    const totalGasto  = rows.reduce((sum, r) => sum + (+r['Valor'] || 0), 0);
    const totalLitros = rows.reduce((sum, r) => sum + (+r['Litros'] || 0), 0);
    const precoArr    = rows.filter(r => +r['Litros'] && +r['Valor']).map(r => (+r['Valor'] || 0) / (+r['Litros'] || 1));
    const avgPreco    = precoArr.length ? precoArr.reduce((a, b) => a + b, 0) / precoArr.length : 0;
    const kmlArr      = rows.filter(r => isFull(r) && +r['KM/L Trip'] > 0).map(r => +r['KM/L Trip']);
    const avgKml      = kmlArr.length ? kmlArr.reduce((a, b) => a + b, 0) / kmlArr.length : 0;

    const header = `
      <div class="month-divider">
        <div class="month-divider-label">${group}</div>
        <div class="month-divider-meta">
          <span class="month-meta">${formatBRL(totalGasto)}</span>
          <span class="month-meta">${formatNumber(totalLitros, 1)} L</span>
          <span class="month-meta">${avgPreco ? formatBRL(avgPreco) : '—'}</span>
          <span class="month-meta">${avgKml ? formatNumber(avgKml, 1) + ' km/L' : '—'}</span>
        </div>
      </div>`;

    const cards = rows.map(r => {
      displayedRecords.push(r);
      const d      = new Date(r['Data']);
      const dStr   = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
      const tStr   = d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
      const posto  = r['Posto']            || 'Posto não informado';
      const tipo   = r['Tipo Combustível'] || '';
      const valor  = +r['Valor']           || 0;
      const litros = +r['Litros']          || 0;
      const kml    = +r['KM/L Trip']       || 0;
      const kmTrip = +r['KM_Trip']         || 0;
      const precoL = litros ? (valor / litros) : 0;
      const parcial = !isFull(r);

      return `
        <div class="record-card">
          <div class="record-main">
            <div class="record-left">
              <div class="record-date">${dStr} • ${tStr}</div>
              <div class="record-posto">${posto}</div>
              <div class="chips">
                ${tipo    ? `<span class="chip blue">${tipo}</span>`                                    : ''}
                ${parcial ? `<span class="chip amber">⚠️ Parcial</span>`                                : ''}
                ${kml     ? `<span class="chip green">${ICONS.zap} ${formatNumber(kml, 1)} km/L</span>`: ''}
                ${kmTrip  ? `<span class="chip purple">${ICONS.route} ${formatNumber(kmTrip, 0)} km</span>`: ''}
                ${precoL  ? `<span class="chip blue">R$ ${formatNumber(precoL, 2)}/L</span>`           : ''}
              </div>
            </div>
            <div class="record-right">
              <div class="record-valor">${formatBRL(valor)}</div>
              <div class="record-litros">${formatNumber(litros, 2)} L</div>
            </div>
          </div>
          <div class="record-actions">
            <button class="btn-action btn-edit">${ICONS.edit} Editar</button>
            <button class="btn-action btn-delete">${ICONS.trash} Excluir</button>
          </div>
        </div>`;
    }).join('');

    return header + cards;
  }).join('');
  const renderedUser = currentUser;
  el.querySelectorAll('.record-card').forEach((card, index) => {
    const record = displayedRecords[index];
    const id = record['ID'];
    const context = `${record['Posto'] || 'posto não informado'}, ${new Date(record['Data']).toLocaleDateString('pt-BR')}`;
    const edit = card.querySelector('.btn-edit');
    const remove = card.querySelector('.btn-delete');
    edit.setAttribute('aria-label', `Editar abastecimento: ${context}`);
    remove.setAttribute('aria-label', `Excluir abastecimento: ${context}`);
    edit.addEventListener('click', () => openEdit(id, renderedUser));
    remove.addEventListener('click', () => askDelete(id, renderedUser));
  });
}
/* [/LIST] */

/* [POSTO-PICKER] ═════════════════════════════ */
function renderPostoPicker() {
  const el = document.getElementById('posto-picker');
  if (!el) return;
  const recentNames = recentValues('Posto', 3).filter(name => postos.some(p => p.nome === name));
  const recentLabel = document.getElementById('recent-postos-label');
  if (recentLabel) recentLabel.hidden = !recentNames.length || editMode;
  if (!postos.length) {
    el.innerHTML = `<button type="button" class="chip-posto chip-add" onclick="showInlineAddPosto()">+ Adicionar Posto</button>`;
    return;
  }
  const ordered = [...postos.keys()].sort((a, b) => {
    const rank = i => {
      const position = recentNames.indexOf(postos[i].nome);
      return position < 0 ? recentNames.length : position;
    };
    return rank(a) - rank(b);
  });
  el.innerHTML = ordered.map((i, position) => {
    const p = postos[i];
    return `${position === recentNames.length && recentNames.length && !editMode ? '<span class="posto-group-break">Outros postos</span>' : ''}
    <button type="button"
            class="chip-posto${selectedPostoNome === p.nome ? ' selected' : ''}"
            aria-pressed="${selectedPostoNome === p.nome}"
            onclick="selectPosto(${i})">${p.nome}</button>`;
  }).join('') +
  `<button type="button" class="chip-posto chip-add" onclick="showInlineAddPosto()">+ Novo Posto</button>`;
}

function recentValues(field, limit) {
  const seen = new Set();
  return [...records]
    .filter(r => Number.isFinite(new Date(r['Data']).getTime()))
    .sort((a, b) => new Date(b['Data']) - new Date(a['Data']))
    .map(r => r[field])
    .filter(value => {
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    }).slice(0, limit);
}

function refreshRecentChoices() {
  const overlay = document.getElementById('overlay');
  if (!overlay || !overlay.classList.contains('open')) return;
  renderPostoPicker();
  renderRecentFuel();
}

function renderRecentFuel() {
  const button = document.getElementById('recent-fuel');
  if (!button) return;
  const select = document.getElementById('f-comb');
  if (!select) return;
  const options = Array.from(select.options || []);
  const fuel = recentValues('Tipo Combustível', 5).find(value => options.some(option => option.value === value));
  const valid = Boolean(fuel);
  button.hidden = !valid || editMode;
  if (!button.hidden) button.textContent = `Último: ${fuel} · usar`;
}

function useRecentFuel() {
  const select = document.getElementById('f-comb');
  if (!select) return;
  const fuel = recentValues('Tipo Combustível', 5)
    .find(value => Array.from(select.options || []).some(option => option.value === value));
  if (!fuel) return;
  select.value = fuel;
  if (typeof select.focus === 'function') select.focus();
}

function selectPosto(idx) {
  selectedPostoNome = postos[idx].nome;
  renderPostoPicker();
}

function showInlineAddPosto() {
  const wrap = document.getElementById('inline-add-posto');
  if (wrap) wrap.classList.add('show');
  setTimeout(() => document.getElementById('inline-posto-input')?.focus(), 50);
}

function cancelInlineAddPosto() {
  const wrap = document.getElementById('inline-add-posto');
  if (wrap) wrap.classList.remove('show');
  const input = document.getElementById('inline-posto-input');
  if (input) input.value = '';
}

function saveInlineAddPosto() {
  const nome = document.getElementById('inline-posto-input').value.trim();
  if (!nome) { showToast('Digite o nome do posto', ''); return; }
  google.script.run
    .withSuccessHandler(res => {
      if (res.success) {
        postos.push({ id: res.id, nome: res.nome });
        postos.sort((a,b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        selectedPostoNome = res.nome;
        cancelInlineAddPosto();
        renderPostoPicker();
        renderAdminPostos();
        showToast('Posto adicionado!', 'ok');
      } else { showToast(res.error, 'err'); }
    })
    .withFailureHandler(() => showToast('Falha na conexão', 'err'))
    .addPosto(currentUser, nome);
}
/* [/POSTO-PICKER] */

/* [POSTOS-LIST] ══════════════════════════════ */
function renderAdminPostos() {
  const el = document.getElementById('postos-list');
  if (!el) return;
  if (!postos.length) {
    el.innerHTML = `<div class="empty">
      <div class="empty-icon">${ICONS.store}</div>
      <p style="margin-bottom:16px">Nenhum posto cadastrado ainda.<br>Adicione postos para agilizar seus registros.</p>
      <button type="button" class="btn-empty-action" onclick="openAddPosto()">＋ Novo Posto</button>
    </div>`;
    return;
  }
  el.innerHTML = postos.map((p, i) => `
    <div class="posto-card">
      <div class="posto-name">${ICONS.store} <span>${p.nome}</span></div>
      <div class="posto-btns">
        <button class="btn-icon btn-icon-edit" aria-label="Editar posto" onclick="openEditPosto(${i})">${ICONS.edit}</button>
        <button class="btn-icon btn-icon-delete" aria-label="Excluir posto" onclick="askDeletePosto(${i})">${ICONS.trash}</button>
      </div>
    </div>`).join('');
  el.querySelectorAll('.posto-card').forEach((card, i) => {
    card.querySelector('.btn-icon-edit').setAttribute('aria-label', `Editar posto ${postos[i].nome}`);
    card.querySelector('.btn-icon-delete').setAttribute('aria-label', `Excluir posto ${postos[i].nome}`);
  });
}

function openAddPosto() {
  editingPostoId = null;
  const input = document.getElementById('posto-nome-input');
  if (input) input.value = '';
  const title = document.getElementById('posto-modal-title');
  if (title) title.innerHTML = `${ICONS.store} <span>Novo Posto</span>`;
  const btn = document.getElementById('btn-salvar-posto');
  if (btn) btn.innerHTML = `${ICONS.check} <span>Adicionar Posto</span>`;
  showDialog('posto-overlay', '.btn-close-modal');
  setTimeout(() => document.getElementById('posto-nome-input')?.focus(), 350);
}

function openEditPosto(idx) {
  const p = postos[idx];
  editingPostoId = p.id;
  const input = document.getElementById('posto-nome-input');
  if (input) input.value = p.nome;
  const title = document.getElementById('posto-modal-title');
  if (title) title.innerHTML = `${ICONS.edit} <span>Editar Posto</span>`;
  const btn = document.getElementById('btn-salvar-posto');
  if (btn) btn.innerHTML = `${ICONS.save} <span>Salvar Alterações</span>`;
  showDialog('posto-overlay', '.btn-close-modal');
  setTimeout(() => document.getElementById('posto-nome-input')?.focus(), 350);
}

function closePostoModal() {
  editingPostoId = null;
  hideDialog('posto-overlay');
}

function bgClickPosto(e) {
  if (e.target === document.getElementById('posto-overlay')) closePostoModal();
}

function savePostoModal() {
  const nome = document.getElementById('posto-nome-input').value.trim();
  if (!nome) { showToast('Digite o nome do posto', ''); return; }

  const btn = document.getElementById('btn-salvar-posto');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  if (editingPostoId) {
    const id      = editingPostoId;
    const oldNome = postos.find(p => p.id === id)?.nome;
    google.script.run
      .withSuccessHandler(res => {
        btn.disabled = false;
        btn.innerHTML = `${ICONS.save} <span>Salvar Alterações</span>`;
        if (res.success) {
          const idx = postos.findIndex(p => p.id === id);
          if (idx >= 0) postos[idx].nome = nome;
          postos.sort((a,b) => a.nome.localeCompare(b.nome, 'pt-BR'));
          if (selectedPostoNome === oldNome) selectedPostoNome = nome;
          setCachedData(currentUser, 'postos', postos);
          renderPostoPicker(); renderAdminPostos(); closePostoModal();
          showToast('Posto atualizado!', 'ok');
        } else { showToast(res.error, 'err'); }
      })
      .withFailureHandler(() => {
        btn.disabled = false;
        btn.innerHTML = `${ICONS.save} <span>Salvar Alterações</span>`;
        showToast('Falha na conexão', 'err');
      })
      .updatePosto(currentUser, id, nome);
  } else {
    google.script.run
      .withSuccessHandler(res => {
        btn.disabled = false;
        btn.innerHTML = `${ICONS.check} <span>Adicionar Posto</span>`;
        if (res.success) {
          postos.push({ id: res.id, nome: res.nome || nome });
          postos.sort((a,b) => a.nome.localeCompare(b.nome, 'pt-BR'));
          setCachedData(currentUser, 'postos', postos);
          renderPostoPicker(); renderAdminPostos(); closePostoModal();
          showToast('Posto adicionado!', 'ok');
        } else { showToast(res.error, 'err'); }
      })
      .withFailureHandler(() => {
        btn.disabled = false;
        btn.innerHTML = `${ICONS.check} <span>Adicionar Posto</span>`;
        showToast('Falha na conexão', 'err');
      })
      .addPosto(currentUser, nome);
  }
}

function askDeletePosto(idx) {
  const p = postos[idx];
  pendingDeletePostoId = p.id;
  document.getElementById('confirm-posto-name').textContent = p.nome;
  showDialog('confirm-posto-overlay', '.btn-cancel');
}

function closeConfirmPosto() {
  pendingDeletePostoId = null;
  hideDialog('confirm-posto-overlay');
}

function confirmDeletePosto() {
  if (!pendingDeletePostoId) return;
  const id = pendingDeletePostoId;
  closeConfirmPosto();
  google.script.run
    .withSuccessHandler(res => {
      if (res.success) {
        postos = postos.filter(p => p.id !== id);
        if (selectedPostoNome && !postos.find(p => p.nome === selectedPostoNome)) selectedPostoNome = '';
        setCachedData(currentUser, 'postos', postos);
        renderPostoPicker(); renderAdminPostos();
        showToast('Posto excluído!', 'ok');
      } else { showToast(res.error, 'err'); }
    })
    .withFailureHandler(() => showToast('Falha na conexão', 'err'))
    .deletePosto(currentUser, id);
}
/* [/POSTOS-LIST] */

/* [MODAL-FORM] ═══════════════════════════════ */
function setNow() {
  const now   = new Date();
  const local = new Date(now - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const dataEl = document.getElementById('f-data');
  if (dataEl) dataEl.value = local;
}

function toLocalDatetimeValue(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  const local = new Date(d - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function advanceForm(e, nextId) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const nextEl = document.getElementById(nextId);
    if (nextEl) nextEl.focus();
  }
}

function positionFormSheet() {
  const overlay = document.getElementById('overlay');
  if (typeof window === 'undefined' || !window.visualViewport || !overlay || !overlay.classList.contains('open')) return;
  overlay.style.top = `${window.visualViewport.offsetTop}px`;
  overlay.style.height = `${window.visualViewport.height}px`;
  const active = document.activeElement;
  if (active?.closest && active.closest('.form-fields')) {
    active.scrollIntoView({ block: 'nearest' });
  }
}

function openModal() {
  editMode = false; selectedPostoNome = '';
  document.getElementById('f-id').value = '';
  document.getElementById('form').reset();
  const o1 = document.getElementById('f-precol'), o2 = document.getElementById('f-kmtrip'), o3 = document.getElementById('f-kmlprev');
  if (o1) { o1.value = ''; o1.textContent = '—'; }
  if (o2) { o2.value = ''; o2.textContent = '—'; }
  if (o3) { o3.value = ''; o3.textContent = '—'; }
  ['f-comb', 'f-litros', 'f-valor', 'f-kmtotal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('is-invalid'); el.removeAttribute?.('aria-invalid'); }
  });
  const title = document.getElementById('modal-title');
  if (title) title.innerHTML = `${ICONS.fuel} <span>Novo Abastecimento</span>`;
  const sub = document.getElementById('modal-subtitle');
  if (sub) sub.textContent = '';
  const btn = document.getElementById('btn-salvar');
  if (btn) btn.innerHTML = `${ICONS.check} <span>Salvar Abastecimento</span>`;
  cancelInlineAddPosto(); setNow(); renderPostoPicker(); renderRecentFuel(); calcKm();
  showDialog('overlay', '.btn-close-modal');
  positionFormSheet();
}

function findRecordForAction(id, renderedUser) {
  if (renderedUser !== currentUser || id === null || id === undefined || String(id).trim() === '') {
    showToast('Registro indisponível. Atualize o histórico.', 'err');
    return null;
  }
  const matches = records.filter(r => r['ID'] !== null && r['ID'] !== undefined &&
    String(r['ID']) === String(id));
  if (matches.length !== 1) {
    showToast('Registro não encontrado ou duplicado. Atualize o histórico.', 'err');
    return null;
  }
  return matches[0];
}

function openEdit(id, renderedUser = currentUser) {
  const r = findRecordForAction(id, renderedUser);
  if (!r) return;
  editMode = true;
  editingRecordUser = currentUser;
  document.getElementById('f-id').value        = r['ID']               || '';
  document.getElementById('f-data').value      = toLocalDatetimeValue(r['Data']);
  document.getElementById('f-comb').value      = r['Tipo Combustível'] || '';
  document.getElementById('f-parcial').checked = !isFull(r);
  document.getElementById('f-litros').value    = r['Litros']           || '';
  document.getElementById('f-valor').value     = r['Valor']            || '';
  document.getElementById('f-kmtotal').value   = r['KM_Total']         || '';
  selectedPostoNome = r['Posto'] || '';
  ['f-comb', 'f-litros', 'f-valor', 'f-kmtotal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('is-invalid'); el.removeAttribute?.('aria-invalid'); }
  });
  calcPreco(); calcKm(); cancelInlineAddPosto(); renderPostoPicker(); renderRecentFuel();
  const d    = new Date(r['Data']);
  const dStr = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
  const title = document.getElementById('modal-title');
  if (title) title.innerHTML = `${ICONS.edit} <span>Editar Abastecimento</span>`;
  const sub = document.getElementById('modal-subtitle');
  if (sub) sub.textContent = `ID: ${r['ID']} • ${dStr}`;
  const btn = document.getElementById('btn-salvar');
  if (btn) btn.innerHTML = `${ICONS.save} <span>Salvar Alterações</span>`;
  showDialog('overlay', '.btn-close-modal');
  positionFormSheet();
}

function closeModal() {
  editingRecordUser = null;
  const overlay = document.getElementById('overlay');
  hideDialog('overlay');
  overlay.style.top = '';
  overlay.style.height = '';
}
function bgClick(e)   { if (e.target === document.getElementById('overlay')) closeModal(); }
/* [/MODAL-FORM] */

/* [DELETE-RECORD] ════════════════════════════ */
function askDelete(id, renderedUser = currentUser) {
  const r = findRecordForAction(id, renderedUser);
  if (!r) return;
  pendingDeleteId = r['ID'];
  pendingDeleteUser = currentUser;
  const d    = new Date(r['Data']);
  const dStr = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
  document.getElementById('confirm-record-text').textContent =
    `${r['Posto'] || 'Posto não informado'} • ${dStr}\n\nEsta ação não pode ser desfeita.`;
  showDialog('confirm-record-overlay', '.btn-cancel');
}

function closeConfirmRecord() {
  pendingDeleteId = null;
  pendingDeleteUser = null;
  hideDialog('confirm-record-overlay');
}

function confirmDeleteRecord() {
  const r = findRecordForAction(pendingDeleteId, pendingDeleteUser);
  if (!r) {
    closeConfirmRecord();
    return;
  }
  const id = r['ID'];
  const user = currentUser;
  const epoch = profileEpoch;
  closeConfirmRecord();
  showToast('Excluindo...', '');
  google.script.run
    .withSuccessHandler(res => {
      if (res.success) {
        showToast('Registro excluído!', 'ok');
        if (profileEpoch === epoch) {
          records = records.filter(r => String(r['ID']) !== String(id));
          setCachedData(user, 'records', records);
          loadRecords(true);
        } else invalidateRecordsCache(user);
      } else { showToast(res.error, 'err'); }
    })
    .withFailureHandler(() => showToast('Falha na conexão', 'err'))
    .deleteRecord(user, id);
}
/* [/DELETE-RECORD] */

/* [SUBMIT-FORM] ══════════════════════════════ */
function clearFieldError(inputId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(`${inputId}-error`);
  if (input) {
    input.classList?.remove?.('field-invalid');
    input.classList?.remove?.('is-invalid');
    input.removeAttribute?.('aria-invalid');
  }
  if (error) error.textContent = '';
}

function setFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(`${inputId}-error`);
  if (input) {
    input.classList?.add?.('field-invalid');
    input.classList?.add?.('is-invalid');
    input.setAttribute?.('aria-invalid', 'true');
  }
  if (error) error.textContent = message;
}

function submitForm(e) {
  e.preventDefault();

  if (editMode && !findRecordForAction(document.getElementById('f-id').value, editingRecordUser)) return;

  // Validações ANTES de enviar (evita travar o botão)
  const litros = parseDecimal(document.getElementById('f-litros').value);
  const valor  = parseDecimal(document.getElementById('f-valor').value);
  const kmTot  = parseDecimal(document.getElementById('f-kmtotal').value);
  const fuelInput = document.getElementById('f-comb');

  clearFieldError('f-comb');
  clearFieldError('f-litros');
  clearFieldError('f-valor');
  clearFieldError('f-kmtotal');
  const invalidFields = [];
  if (!fuelInput.value) {
    setFieldError('f-comb', 'Selecione o combustível.');
    showToast('Selecione o combustível', 'err');
    invalidFields.push('f-comb');
  }
  for (const [id, value, decimal, label] of [
    ['f-litros', litros, true, 'os litros'],
    ['f-valor', valor, true, 'o valor'],
    ['f-kmtotal', kmTot, false, 'o KM total']
  ]) {
    const input = document.getElementById(id);
    const valid = decimal ? /^\d+(?:[.,]\d+)?$/.test(String(input?.value ?? '').trim()) : Number.isInteger(value);
    if (valid && value > 0) continue;
    setFieldError(id, decimal ? 'Informe um número maior que zero.' : 'Informe um KM Total inteiro e positivo.');
    showToast(`Confira ${label}`, 'err');
    invalidFields.push(id);
    break;
  }
  if (invalidFields.length) {
    document.getElementById(invalidFields[0]).focus();
    return;
  }

  // 🛡️ Validação de Hodômetro Regressivo
  const editId = document.getElementById('f-id').value;
  const previousKm = findPreviousKm(document.getElementById('f-data').value, editId);
  if (previousKm !== null && kmTot <= previousKm) {
    setFieldError('f-kmtotal', `O KM Total deve ser maior que o anterior (${formatNumber(previousKm, 0)}).`);
    showToast(`O KM atual (${formatNumber(kmTot, 0)}) deve ser maior que o anterior (${formatNumber(previousKm, 0)})`, 'err');
    document.getElementById('f-kmtotal').focus();
    return;
  }

  const btn = document.getElementById('btn-salvar');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  const record = {
    id:          document.getElementById('f-id').value,
    data:        document.getElementById('f-data').value,
    combustivel: document.getElementById('f-comb').value,
    parcial:     document.getElementById('f-parcial').checked,
    litros:      litros,
    valor:       valor,
    kmTotal:     kmTot,
    posto:       selectedPostoNome
  };

  const fn    = editMode ? 'updateRecord' : 'addRecord';
  const msgOk = editMode ? 'Alterações salvas!' : 'Abastecimento salvo!';
  const user = currentUser;
  const wasEditing = editMode;
  const epoch = profileEpoch;

  google.script.run
    .withSuccessHandler(res => {
      if (profileEpoch === epoch) {
        btn.disabled = false;
        btn.innerHTML = wasEditing ? `${ICONS.save} <span>Salvar Alterações</span>` : `${ICONS.check} <span>Salvar Abastecimento</span>`;
      }
      if (res.success) {
        if (profileEpoch === epoch && wasEditing) {
          const idx = records.findIndex(r => String(r['ID']) === String(record.id));
          if (idx >= 0) {
            records[idx]['Data']            = record.data;
            records[idx]['Tipo Combustível'] = record.combustivel;
            records[idx]['Litros']          = record.litros;
            records[idx]['Valor']           = record.valor;
            records[idx]['KM_Total']        = record.kmTotal;
            records[idx]['Posto']           = record.posto;
            records[idx]['Parcial?']        = record.parcial;
            setCachedData(user, 'records', records);
          }
        }
        showToast(`${msgOk} ${formatNumber(litros, 2)} L • ${formatBRL(valor)} • ${formatNumber(kmTot, 0)} km`, 'ok');
        if (profileEpoch === epoch) {
          closeModal();
          document.getElementById('form').reset();
          const so1 = document.getElementById('f-precol'), so2 = document.getElementById('f-kmtrip'), so3 = document.getElementById('f-kmlprev');
          if (so1) { so1.value = ''; so1.textContent = '—'; }
          if (so2) { so2.value = ''; so2.textContent = '—'; }
          if (so3) { so3.value = ''; so3.textContent = '—'; }
          selectedPostoNome = '';
          loadRecords(true);
        } else invalidateRecordsCache(user);
      } else { showToast(res.error, 'err'); }
    })
    .withFailureHandler(() => {
      if (profileEpoch === epoch) {
        btn.disabled = false;
        btn.innerHTML = wasEditing ? `${ICONS.save} <span>Salvar Alterações</span>` : `${ICONS.check} <span>Salvar Abastecimento</span>`;
      }
      showToast('Falha na conexão', 'err');
    })
    [fn](user, record);
}
/* [/SUBMIT-FORM] */

/* [ANALYTICS] ════════════════════════════════ */
function renderAnalytics(data) {
  analyticsBuilt = true;
  const totalGasto  = data.reduce((s,r) => s + (+r['Valor']  || 0), 0);
  const totalLitros = data.reduce((s,r) => s + (+r['Litros'] || 0), 0);
  const kmlArr   = data.filter(r => isFull(r) && +r['KM/L Trip'] > 0).map(r => +r['KM/L Trip']);
  const avgKml   = kmlArr.length  ? kmlArr.reduce((a,b)=>a+b)/kmlArr.length  : 0;
  const precos   = data.filter(r => +r['Litros'] && +r['Valor']).map(r => +r['Valor']/+r['Litros']);
  const avgPreco = precos.length  ? precos.reduce((a,b)=>a+b)/precos.length  : 0;

  const summaryGrid = document.getElementById('summary-grid');
  if (summaryGrid) {
    summaryGrid.innerHTML = `
      <div class="summary-card">
        <div class="summary-icon">${ICONS.dollar}</div>
        <div class="summary-val" style="color:var(--primary)">${formatBRL(totalGasto)}</div>
        <div class="summary-lbl">Total gasto no histórico</div>
      </div>
      <div class="summary-card">
        <div class="summary-icon" style="color:var(--purple)">${ICONS.droplet}</div>
        <div class="summary-val" style="color:var(--purple)">${formatNumber(totalLitros, 1)} L</div>
        <div class="summary-lbl">Total de litros no histórico</div>
      </div>
      <div class="summary-card">
        <div class="summary-icon" style="color:var(--green)">${ICONS.zap}</div>
        <div class="summary-val" style="color:var(--green)">${avgKml ? formatNumber(avgKml, 2)+' km/L' : '—'}</div>
        <div class="summary-lbl">Eficiência média no histórico (sem parciais)</div>
      </div>
      <div class="summary-card">
        <div class="summary-icon" style="color:var(--amber)">${ICONS.tag}</div>
        <div class="summary-val" style="color:var(--amber)">${avgPreco ? formatBRL(avgPreco) : '—'}</div>
        <div class="summary-lbl">Preço médio por litro no histórico</div>
      </div>`;
  }

  const months = {};
  data.forEach(r => {
    const d   = new Date(r['Data']);
    if (!Number.isFinite(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    if (!months[key]) months[key] = {
      key, year:d.getFullYear(), month:d.getMonth(),
      count:0, litros:0, valor:0, kmlSum:0, kmlCount:0, precoSum:0, precoCount:0, parciais:0
    };
    const m = months[key];
    m.count++; m.litros += +r['Litros']||0; m.valor += +r['Valor']||0;
    if (!isFull(r)) m.parciais++;
    if (isFull(r) && +r['KM/L Trip'])   { m.kmlSum   += +r['KM/L Trip'];          m.kmlCount++;  }
    if (+r['Litros']&&+r['Valor'])      { m.precoSum += +r['Valor']/+r['Litros']; m.precoCount++; }
  });

  const sorted   = Object.values(months).sort((a,b) => b.key.localeCompare(a.key));
  const maxValor = Math.max(0, ...sorted.map(m => m.valor));
  trendMonths = sorted.slice(0, 6).reverse();
  renderTrend();

  const monthlyList = document.getElementById('monthly-list');
  if (monthlyList) {
    monthlyList.innerHTML = sorted.length ? sorted.map(m => {
      const moName  = new Date(m.year,m.month,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
      const avgKml  = m.kmlCount   ? formatNumber(m.kmlSum/m.kmlCount, 1)      : '—';
      const avgPrec = m.precoCount ? formatBRL(m.precoSum/m.precoCount)         : '—';
      const barPct  = maxValor     ? ((m.valor/maxValor)*100).toFixed(1)        : 0;
      const pAviso  = m.parciais   ? ` · ${m.parciais} parcial${m.parciais>1?'is':''}` : '';
      return `
        <div class="month-card">
          <div class="month-header">
            <div class="month-name">${capitalize(moName)}</div>
            <div class="month-count">${m.count} abastec.</div>
          </div>
          <div class="month-grid">
            <div><div class="month-stat-val" style="color:var(--primary)">${formatBRL(m.valor)}</div><div class="month-stat-lbl">${ICONS.dollar} Total gasto</div></div>
            <div><div class="month-stat-val" style="color:var(--purple)">${formatNumber(m.litros, 1)} L</div><div class="month-stat-lbl">${ICONS.droplet} Total litros</div></div>
            <div><div class="month-stat-val" style="color:var(--green)">${avgKml} km/L</div><div class="month-stat-lbl">${ICONS.zap} Média km/L${pAviso}</div></div>
            <div><div class="month-stat-val" style="color:var(--amber)">${avgPrec}</div><div class="month-stat-lbl">${ICONS.tag} Preço/litro</div></div>
          </div>
          <div class="bar-wrap"><div class="bar-fill" style="width:${barPct}%"></div></div>
        </div>`;
    }).join('') : '<div class="empty"><p>Nenhum abastecimento para analisar ainda.</p></div>';
  }
}

function selectTrendMetric(metric) {
  if (!['spend', 'price', 'efficiency'].includes(metric)) return;
  trendMetric = metric;
  renderTrend();
}

function renderTrend() {
  const metrics = {
    spend: { label: 'Gasto', color: 'var(--primary)', value: m => m.valor, format: v => formatBRL(v) },
    price: { label: 'Preço por litro', color: 'var(--amber)',
      value: m => m.precoCount ? m.precoSum / m.precoCount : null, format: v => `${formatBRL(v)}/L` },
    efficiency: { label: 'Eficiência', color: 'var(--green)',
      value: m => m.kmlCount ? m.kmlSum / m.kmlCount : null, format: v => `${formatNumber(v, 1)} km/L` }
  };
  for (const key of Object.keys(metrics)) {
    const button = document.getElementById('trend-' + key);
    if (button) {
      button.classList.toggle('active', key === trendMetric);
      button.setAttribute('aria-pressed', String(key === trendMetric));
    }
  }
  const chart = document.getElementById('trend-chart');
  if (!chart) return;
  if (!trendMonths.length) {
    chart.innerHTML = '<p class="trend-empty">Registre um abastecimento para ver a evolução.</p>';
    return;
  }
  const metric = metrics[trendMetric];
  const values = trendMonths.map(metric.value);
  const max = Math.max(0, ...values.filter(v => v !== null));
  chart.setAttribute('aria-label', `${metric.label} por mês, até seis meses com registros`);
  chart.innerHTML = trendMonths.map((month, i) => {
    const value = values[i];
    const width = value !== null && max > 0 ? (value / max * 100).toFixed(1) : 0;
    const monthName = new Date(month.year, month.month, 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    return `<div class="trend-row">
      <span class="trend-month">${monthName}</span>
      <div class="trend-track"><div class="trend-fill" style="width:${width}%;background:${metric.color}"></div></div>
      <span class="trend-value">${value === null ? '—' : metric.format(value)}</span>
    </div>`;
  }).join('');
}
/* [/ANALYTICS] */

/* [HELPERS] ══════════════════════════════════ */
/* [FORMATAÇÃO BRASIL] ────────────────────── */
function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatNumber(valor, decimais = 2) {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: decimais, maximumFractionDigits: decimais });
}
/* [/FORMATAÇÃO BRASIL] */

function calcPreco() {
  const l = parseDecimal(document.getElementById('f-litros').value);
  const v = parseDecimal(document.getElementById('f-valor').value);
  const val = (l>0&&v>0) ? `R$ ${formatNumber(v/l, 3)}/L` : '';
  const el = document.getElementById('f-precol');
  if (el) { el.value = val; el.textContent = val || '—'; }
}

/* [CALC-KM-PREVIEW] — prévia de KM rodados e km/L no formulário */
function getPreviousKmTotal(dataVal, editId) {
  if (!dataVal) return null;
  const dataAtual = new Date(dataVal).getTime();
  if (!Number.isFinite(dataAtual)) return null;
  let prevKmTotal = null, prevTime = -Infinity;

  records.forEach(r => {
    if (editId && String(r['ID']) === String(editId)) return; // ignora o próprio
    const t  = new Date(r['Data']).getTime();
    const km = +r['KM_Total'] || 0;
    if (km > 0 && t < dataAtual && t > prevTime) {
      prevTime = t; prevKmTotal = km;
    }
  });
  return prevKmTotal;
}

function calcKm() {
  const kmTotalEl = document.getElementById('f-kmtotal');
  const kmTripEl  = document.getElementById('f-kmtrip');
  const kmlPrevEl = document.getElementById('f-kmlprev');

  const kmTotal = parseDecimal(kmTotalEl?.value) || 0;
  const litros  = parseDecimal(document.getElementById('f-litros')?.value) || 0;
  const dataVal = document.getElementById('f-data')?.value;
  const editId  = document.getElementById('f-id')?.value;
  const previousEl = document.getElementById('previous-km');

  // 🔍 Acha o KM_Total do registro ANTERIOR (por data/hora)
  const prevKmTotal = findPreviousKm(dataVal, editId);

  if (prevKmTotal === null) {
    previousEl.textContent = 'Sem hodômetro anterior (1º abastecimento)';
    previousEl.style.color = '';
    previousEl.style.fontWeight = '';
  } else {
    previousEl.textContent = `Hodômetro anterior: ${formatNumber(prevKmTotal, 0)} km`;
    previousEl.style.color = '';
    previousEl.style.fontWeight = '';
  }

  if (prevKmTotal === null || kmTotal > prevKmTotal) {
    if (kmTotalEl) {
      kmTotalEl.classList.remove('is-invalid');
      kmTotalEl.removeAttribute?.('aria-invalid');
    }
  }

  if (kmTotal <= 0 || !dataVal) {
    if (kmTripEl) { kmTripEl.value = ''; kmTripEl.textContent = '—'; }
    if (kmlPrevEl) { kmlPrevEl.value = ''; kmlPrevEl.textContent = '—'; }
    return;
  }

  // KM Rodados
  if (prevKmTotal === null) {
    if (kmTripEl) { kmTripEl.value = '—'; kmTripEl.textContent = '—'; }
    if (kmlPrevEl) { kmlPrevEl.value = '—'; kmlPrevEl.textContent = '—'; }
    return;
  }

  const dist = kmTotal - prevKmTotal;
  if (dist <= 0) {
    if (kmTripEl) { kmTripEl.value = '—'; kmTripEl.textContent = '—'; }
    if (kmlPrevEl) { kmlPrevEl.value = '—'; kmlPrevEl.textContent = '—'; }
    if (previousEl) {
      previousEl.textContent = `Hodômetro anterior: ${formatNumber(prevKmTotal, 0)} km (atual deve ser maior)`;
      previousEl.style.color = 'var(--amber)';
      previousEl.style.fontWeight = '700';
    }
    return;
  }

  const distStr = `${formatNumber(dist, 0)} km`;
  if (kmTripEl) { kmTripEl.value = distStr; kmTripEl.textContent = distStr; }

  // ⚡ Prévia de km/L (estimativa simples)
  const kmlStr = (litros > 0) ? `~ ${formatNumber(dist / litros, 2)} km/L` : '—';
  if (kmlPrevEl) { kmlPrevEl.value = kmlStr; kmlPrevEl.textContent = kmlStr; }
}
/* [/CALC-KM-PREVIEW] */

/* 🔍 Acha o KM_Total do registro ANTERIOR (por data/hora), ignorando o próprio registro em edição */
function findPreviousKm(dataVal, editId) {
  if (!dataVal) return null;
  const dataAtual = new Date(dataVal).getTime();
  if (!Number.isFinite(dataAtual)) return null;
  let prevKmTotal = null;
  let prevTime = -Infinity;
  records.forEach(r => {
    if (editId && String(r['ID']) === String(editId)) return;
    const t = new Date(r['Data']).getTime();
    const km = +r['KM_Total'];
    if (Number.isFinite(t) && Number.isFinite(km) && km > 0 && t < dataAtual && t > prevTime) {
      prevTime = t;
      prevKmTotal = km;
    }
  });
  return prevKmTotal;
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function showToast(msg, type) {
  const el = document.getElementById('toast');
  if (!el) return;
  if (toastTimeoutId && typeof clearTimeout === 'function') {
    clearTimeout(toastTimeoutId);
    toastTimeoutId = null;
  }
  el.setAttribute('role', type === 'err' ? 'alert' : 'status');
  el.setAttribute('aria-live', type === 'err' ? 'assertive' : 'polite');
  el.textContent = msg;
  el.className = `toast show ${type || ''}`;
  const delay = type === 'err' ? 5500 : 3500;
  if (typeof setTimeout === 'function') {
    toastTimeoutId = setTimeout(() => {
      el.className = 'toast';
      toastTimeoutId = null;
    }, delay);
  }
}

/* [LOADER-OVERLAY] — controla o overlay de loading */
function showLoader(texto) {
  const el = document.getElementById('loader-overlay');
  if (!el) return;
  if (texto) {
    const textEl = el.querySelector('.loader-text');
    if (textEl) textEl.textContent = texto;
  }
  el.classList.add('active');
}

function hideLoader() {
  const el = document.getElementById('loader-overlay');
  if (el) el.classList.remove('active');
}
/* [/LOADER-OVERLAY] */

/* [PARSE-DECIMAL] — aceita somente um número decimal completo */
function parseDecimal(valor) {
  if (valor === null || valor === undefined) return NaN;
  const limpo = String(valor).trim();
  if (!/^\d+(?:[.,]\d*)?$/.test(limpo)) return NaN;
  const n = Number(limpo.replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
}
/* [/PARSE-DECIMAL] */

/* define o texto do loader SEM ligar o overlay */
function setLoaderText(texto) {
  const el = document.getElementById('loader-overlay');
  if (el && texto) {
    const textEl = el.querySelector('.loader-text');
    if (textEl) textEl.textContent = texto;
  }
}

/* [/HELPERS] */
