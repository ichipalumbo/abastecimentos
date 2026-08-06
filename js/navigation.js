/* [NAVIGATION] ═══════════════════════════════ */
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.page').forEach(p     => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + tab).classList.add('active');
  document.getElementById('nav-'  + tab).classList.add('active');
  if (tab === 'analytics' && records.length && !analyticsBuilt) renderAnalytics(records);
}

function refreshData() {
  if (!currentUser) return;
  showToast('🔄 Forçando atualização...', '');
  setLoaderText('Atualizando dados...');   // 🔧 só define o texto, NÃO liga
  loadRecords(true);
  loadPostos(true);
}

/* [/NAVIGATION] */

function updateRefreshMeta(ts) {
  const el = document.getElementById('refresh-meta');
  if (!el) return;
  if (!ts) {
    el.textContent = 'Última atualização: —';
    return;
  }
  el.textContent = `Última atualização: ${new Date(ts).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })}`;
}
