/* [INIT] ═════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  setNow();

  // Esconde a splash
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.classList.add('hide');
  }, 1200);

  // // ⬇️ AUTO-LOGIN: lembra o último usuário (remova este bloco se não quiser)
  const saved = localStorage.getItem('fuelapp_user');
  if (saved) selectUser(saved);
});
/* [/INIT] */

/* [USER] ═════════════════════════════════════ */
function selectUser(user) {
  currentUser = user;
  localStorage.setItem('fuelapp_user', user);
  // Carrega a preferência de ordenação do localStorage
  sortOrder = localStorage.getItem('fuelapp_sortOrder') || 'desc';
  updateSortButton();
  
  document.getElementById('user-select').classList.add('hidden');
  document.getElementById('home-title').textContent =
    `⛽ ${user === 'Josy' ? '💜' : '💙'} ${user}`;

  // ⬇️ LIMPA dados antigos (mata o "fantasma")
  records = []; postos = []; selectedPostoNome = ''; analyticsBuilt = false;
  document.getElementById('list').innerHTML =
    `<div class="loading"><div class="loading-spinner"></div>Carregando registros...</div>`;
  document.getElementById('s-mes').textContent   = '—';
  document.getElementById('s-kml').textContent   = '—';
  document.getElementById('s-preco').textContent = '—';
  updateRefreshMeta(null);

  setLoaderText('Carregando dados...');   // 🔧 troca showLoader por setLoaderText

  switchTab('home');
  loadRecords();
  loadPostos();
}

function logout() {
  currentUser    = null;
  records        = [];
  postos         = [];
  analyticsBuilt = false;
  localStorage.removeItem('fuelapp_user');
  document.getElementById('user-select').classList.remove('hidden');
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
    btn.textContent = '⬇️ Recente';
    btn.title = 'Ordenar: do mais recente para o mais antigo';
  } else {
    btn.textContent = '⬆️ Antigo';
    btn.title = 'Ordenar: do mais antigo para o mais recente';
  }
}
/* [/SORT] */
/* [/USER] */
