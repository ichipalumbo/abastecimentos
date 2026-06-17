/* [STATE] ════════════════════════════════════ */
let currentUser        = null;     // 'Luccas' ou 'Josy'
let records            = [];
let postos             = [];       // [{id, nome}]
let currentTab         = 'home';
let analyticsBuilt     = false;
let editMode           = false;
let selectedPostoNome  = '';
let pendingDeleteId    = null;
let pendingDeletePostoId = null;
let editingPostoId     = null;
let pendingLoads = 0;
let sortOrder          = 'desc';   // 'desc' = recente primeiro, 'asc' = antigo primeiro
let lastRefreshTs      = null;
const CACHE_PREFIX     = 'fuelapp_cache';
const CACHE_TTL_MS     = 5 * 60 * 1000; // 5 minutos

/* [/STATE] */

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

/* [LOAD-DATA] ════════════════════════════════ */
function loadRecords(forceRefresh = false) {
  if (!currentUser) return;

  const cache = !forceRefresh ? getCachedData(currentUser, 'records') : null;
  if (cache && cache.data && cache.data.length) {
    records = cache.data; analyticsBuilt = false;
    renderStats(records); renderList(records);
    lastRefreshTs = cache.ts;
    updateRefreshMeta(lastRefreshTs);
    if (!forceRefresh && isCacheFresh(cache)) {
      return;
    }
  }

  pendingLoads++;
  if (!cache || forceRefresh) showLoader();   // 🔑 só garante o overlay visível, sem trocar texto
  google.script.run
    .withSuccessHandler(data => {
      records = data; analyticsBuilt = false;
      setCachedData(currentUser, 'records', data);
      lastRefreshTs = Date.now();
      updateRefreshMeta(lastRefreshTs);
      renderStats(data); renderList(data);
      if (currentTab === 'analytics') renderAnalytics(data);
      checkLoadsDone();
    })
    .withFailureHandler(err => {
      if (records.length) {
        showToast('❌ Erro ao atualizar registros', 'err');
      } else {
        document.getElementById('list').innerHTML =
          `<div class="empty"><div class="empty-icon">❌</div>
           <p style="color:var(--red)">Erro ao carregar:<br><small>${err.message}</small></p></div>`;
      }
      checkLoadsDone();
    })
    .getRecords(currentUser);
}

function loadPostos(forceRefresh = false) {
  if (!currentUser) return;

  const cache = !forceRefresh ? getCachedData(currentUser, 'postos') : null;
  if (cache && cache.data) {
    postos = cache.data;
    renderPostoPicker();
    renderAdminPostos();
    if (!forceRefresh && isCacheFresh(cache)) {
      return;
    }
  }

  pendingLoads++;
  if (!cache || forceRefresh) showLoader();   // 🔑 só garante o overlay visível, sem trocar texto
  google.script.run
    .withSuccessHandler(data => {
      postos = data;
      setCachedData(currentUser, 'postos', data);
      renderPostoPicker();
      renderAdminPostos();
      checkLoadsDone();
    })
    .withFailureHandler(() => {
      if (postos.length) {
        showToast('❌ Erro ao atualizar postos', 'err');
      }
      checkLoadsDone();
    })
    .getPostos(currentUser);
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
  return `${CACHE_PREFIX}_${user}_${type}`;
}

function getCachedData(user, type) {
  try {
    const raw = localStorage.getItem(getCacheKey(user, type));
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

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

function setCachedData(user, type, data) {
  try {
    localStorage.setItem(getCacheKey(user, type), JSON.stringify({
      ts: Date.now(),
      data
    }));
  } catch (err) {
    // sem cache se localStorage falhar
  }
}

function isCacheFresh(cache) {
  return cache && cache.ts && (Date.now() - cache.ts) < CACHE_TTL_MS;
}

/* [/HELPER-ISFULL] */

/* [STATS] ════════════════════════════════════ */
function renderStats(data) {
  const now    = new Date();
  const thisMo = data.filter(r => {
    const d = new Date(r['Data']);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalMes = thisMo.reduce((s,r) => s + (+r['Valor']  || 0), 0);
  const kmlArr   = data.filter(r => isFull(r) && +r['KM/L Trip'] > 0).map(r => +r['KM/L Trip']);
  const avgKml   = kmlArr.length  ? kmlArr.reduce((a,b)=>a+b) / kmlArr.length  : 0;
  const precos   = data.filter(r => +r['Litros'] && +r['Valor']).map(r => +r['Valor'] / +r['Litros']);
  const avgPreco = precos.length  ? precos.reduce((a,b)=>a+b) / precos.length  : 0;

  document.getElementById('s-mes').textContent   = formatBRL(totalMes);
  document.getElementById('s-kml').textContent   = avgKml   ? formatNumber(avgKml, 1)  : '—';
  document.getElementById('s-preco').textContent = avgPreco ? formatBRL(avgPreco)      : '—';

  const moName = now.toLocaleDateString('pt-BR', { month:'long', year:'numeric' });
  document.getElementById('subtitle').textContent  = `${data.length} registros • ${capitalize(moName)}`;
  document.getElementById('badge-mes').textContent = thisMo.length
    ? `${thisMo.length} este mês` : 'sem registro';
}
/* [/STATS] */

/* [LIST] ═════════════════════════════════════ */
function renderList(data) {
  const el = document.getElementById('list');
  if (!data.length) {
    el.innerHTML = `<div class="empty">
      <div class="empty-icon">⛽</div>
      <p>Nenhum abastecimento ainda.<br>Toque em <strong>Registrar</strong> para começar!</p>
    </div>`;
    return;
  }
  // ✅ Ordena por data de acordo com sortOrder
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

    const cards = rows.map((r, idx) => {
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
                ${tipo    ? `<span class="chip blue">${tipo}</span>`                       : ''}
                ${parcial ? `<span class="chip amber">⚠️ Parcial</span>`                  : ''}
                ${kml     ? `<span class="chip green">⚡ ${formatNumber(kml, 1)} km/L</span>`    : ''}
                ${kmTrip  ? `<span class="chip purple">🛣️ ${formatNumber(kmTrip, 0)} km</span>` : ''}
                ${precoL  ? `<span class="chip amber">R$ ${formatNumber(precoL, 2)}/L</span>`    : ''}
              </div>
            </div>
            <div class="record-right">
              <div class="record-valor">${formatBRL(valor)}</div>
              <div class="record-litros">${formatNumber(litros, 2)} L</div>
            </div>
          </div>
          <div class="record-actions">
            <button class="btn-action btn-edit"   onclick="openEdit(${idx})">✏️ Editar</button>
            <button class="btn-action btn-delete" onclick="askDelete(${idx})">🗑️ Excluir</button>
          </div>
        </div>`;
    }).join('');

    return header + cards;
  }).join('');
}
/* [/LIST] */

/* [POSTO-PICKER] ═════════════════════════════ */
function renderPostoPicker() {
  const el = document.getElementById('posto-picker');
  if (!el) return;
  if (!postos.length) {
    el.innerHTML = `<button type="button" class="chip-posto chip-add" onclick="showInlineAddPosto()">＋ Adicionar Posto</button>`;
    return;
  }
  el.innerHTML = postos.map((p, i) => `
    <button type="button"
            class="chip-posto${selectedPostoNome === p.nome ? ' selected' : ''}"
            onclick="selectPosto(${i})">${p.nome}</button>
  `).join('') +
  `<button type="button" class="chip-posto chip-add" onclick="showInlineAddPosto()">＋ Novo</button>`;
}

function selectPosto(idx) {
  selectedPostoNome = postos[idx].nome;
  renderPostoPicker();
}

function showInlineAddPosto() {
  document.getElementById('inline-add-posto').classList.add('show');
  setTimeout(() => document.getElementById('inline-posto-input').focus(), 50);
}

function cancelInlineAddPosto() {
  document.getElementById('inline-add-posto').classList.remove('show');
  document.getElementById('inline-posto-input').value = '';
}

function saveInlineAddPosto() {
  const nome = document.getElementById('inline-posto-input').value.trim();
  if (!nome) { showToast('⚠️ Digite o nome do posto', ''); return; }
  google.script.run
    .withSuccessHandler(res => {
      if (res.success) {
        postos.push({ id: res.id, nome: res.nome });
        postos.sort((a,b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        selectedPostoNome = res.nome;
        cancelInlineAddPosto();
        renderPostoPicker();
        renderAdminPostos();
        showToast('✅ Posto adicionado!', 'ok');
      } else { showToast('❌ ' + res.error, 'err'); }
    })
    .withFailureHandler(() => showToast('❌ Falha na conexão', 'err'))
    .addPosto(currentUser, nome);
}
/* [/POSTO-PICKER] */

/* [POSTOS-LIST] ══════════════════════════════ */
function renderAdminPostos() {
  const el = document.getElementById('postos-list');
  if (!el) return;
  if (!postos.length) {
    el.innerHTML = `<div class="empty">
      <div class="empty-icon">🏪</div>
      <p>Nenhum posto cadastrado.<br>Clique em <strong>+ Novo Posto</strong> para adicionar.</p>
    </div>`;
    return;
  }
  el.innerHTML = postos.map((p, i) => `
    <div class="posto-card">
      <div class="posto-name">🏪 ${p.nome}</div>
      <div class="posto-btns">
        <button class="btn-icon btn-icon-edit"   onclick="openEditPosto(${i})">✏️</button>
        <button class="btn-icon btn-icon-delete" onclick="askDeletePosto(${i})">🗑️</button>
      </div>
    </div>`).join('');
}

function openAddPosto() {
  editingPostoId = null;
  document.getElementById('posto-nome-input').value        = '';
  document.getElementById('posto-modal-title').textContent = '🏪 Novo Posto';
  document.getElementById('btn-salvar-posto').textContent  = '✅ Adicionar Posto';
  document.getElementById('posto-overlay').classList.add('open');
  setTimeout(() => document.getElementById('posto-nome-input').focus(), 350);
}

function openEditPosto(idx) {
  const p = postos[idx];
  editingPostoId = p.id;
  document.getElementById('posto-nome-input').value        = p.nome;
  document.getElementById('posto-modal-title').textContent = '✏️ Editar Posto';
  document.getElementById('btn-salvar-posto').textContent  = '💾 Salvar Alterações';
  document.getElementById('posto-overlay').classList.add('open');
  setTimeout(() => document.getElementById('posto-nome-input').focus(), 350);
}

function closePostoModal() {
  editingPostoId = null;
  document.getElementById('posto-overlay').classList.remove('open');
}

function bgClickPosto(e) {
  if (e.target === document.getElementById('posto-overlay')) closePostoModal();
}

function savePostoModal() {
  const nome = document.getElementById('posto-nome-input').value.trim();
  if (!nome) { showToast('⚠️ Digite o nome do posto', ''); return; }

  const btn = document.getElementById('btn-salvar-posto');
  btn.disabled = true; btn.textContent = '⏳ Salvando...';

  if (editingPostoId) {
    const id      = editingPostoId;
    const oldNome = postos.find(p => p.id === id)?.nome;
    google.script.run
      .withSuccessHandler(res => {
        btn.disabled = false; btn.textContent = '💾 Salvar Alterações';
        if (res.success) {
          const idx = postos.findIndex(p => p.id === id);
          if (idx >= 0) postos[idx].nome = nome;
          postos.sort((a,b) => a.nome.localeCompare(b.nome, 'pt-BR'));
          if (selectedPostoNome === oldNome) selectedPostoNome = nome;
          setCachedData(currentUser, 'postos', postos);
          renderPostoPicker(); renderAdminPostos(); closePostoModal();
          showToast('💾 Posto atualizado!', 'ok');
        } else { showToast('❌ ' + res.error, 'err'); }
      })
      .withFailureHandler(() => {
        btn.disabled = false; btn.textContent = '💾 Salvar Alterações';
        showToast('❌ Falha na conexão', 'err');
      })
      .updatePosto(currentUser, id, nome);
  } else {
    google.script.run
      .withSuccessHandler(res => {
        btn.disabled = false; btn.textContent = '✅ Adicionar Posto';
        if (res.success) {
          postos.push({ id: res.id, nome: res.nome || nome });
          postos.sort((a,b) => a.nome.localeCompare(b.nome, 'pt-BR'));
          setCachedData(currentUser, 'postos', postos);
          renderPostoPicker(); renderAdminPostos(); closePostoModal();
          showToast('✅ Posto adicionado!', 'ok');
        } else { showToast('❌ ' + res.error, 'err'); }
      })
      .withFailureHandler(() => {
        btn.disabled = false; btn.textContent = '✅ Adicionar Posto';
        showToast('❌ Falha na conexão', 'err');
      })
      .addPosto(currentUser, nome);
  }
}

function askDeletePosto(idx) {
  const p = postos[idx];
  pendingDeletePostoId = p.id;
  document.getElementById('confirm-posto-name').textContent = p.nome;
  document.getElementById('confirm-posto-overlay').classList.add('open');
}

function closeConfirmPosto() {
  pendingDeletePostoId = null;
  document.getElementById('confirm-posto-overlay').classList.remove('open');
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
        showToast('🗑️ Posto removido', 'ok');
      } else { showToast('❌ ' + res.error, 'err'); }
    })
    .withFailureHandler(() => showToast('❌ Falha na conexão', 'err'))
    .deletePosto(currentUser, id);
}
/* [/POSTOS-LIST] */

/* [MODAL-FORM] ═══════════════════════════════ */
function setNow() {
  const now   = new Date();
  const local = new Date(now - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  document.getElementById('f-data').value = local;
}

function toLocalDatetimeValue(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function openModal() {
  editMode = false; selectedPostoNome = '';
  document.getElementById('f-id').value = '';
  document.getElementById('form').reset();
  document.getElementById('f-precol').value             = '';
  document.getElementById('f-kmtrip').value             = '';
  document.getElementById('f-kmlprev').value            = '';
  document.getElementById('modal-title').textContent    = '🛢️ Novo Abastecimento';
  document.getElementById('modal-subtitle').textContent = '';
  document.getElementById('btn-salvar').textContent     = '✅ Salvar Abastecimento';
  cancelInlineAddPosto(); setNow(); renderPostoPicker();
  document.getElementById('overlay').classList.add('open');
}

function openEdit(idx) {
  editMode = true;
  const r  = records[idx];
  document.getElementById('f-id').value        = r['ID']               || '';
  document.getElementById('f-data').value      = toLocalDatetimeValue(r['Data']);
  document.getElementById('f-comb').value      = r['Tipo Combustível'] || 'Gasolina';
  document.getElementById('f-parcial').checked = !isFull(r);
  document.getElementById('f-litros').value    = r['Litros']           || '';
  document.getElementById('f-valor').value     = r['Valor']            || '';
  document.getElementById('f-kmtotal').value   = r['KM_Total']         || '';
  selectedPostoNome = r['Posto'] || '';
  calcPreco(); calcKm(); cancelInlineAddPosto(); renderPostoPicker();
  const d    = new Date(r['Data']);
  const dStr = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
  document.getElementById('modal-title').textContent    = '✏️ Editar Abastecimento';
  document.getElementById('modal-subtitle').textContent = `ID: ${r['ID']} • ${dStr}`;
  document.getElementById('btn-salvar').textContent     = '💾 Salvar Alterações';
  document.getElementById('overlay').classList.add('open');
}

function closeModal() { document.getElementById('overlay').classList.remove('open'); }
function bgClick(e)   { if (e.target === document.getElementById('overlay')) closeModal(); }
/* [/MODAL-FORM] */

/* [DELETE-RECORD] ════════════════════════════ */
function askDelete(idx) {
  const r = records[idx];
  pendingDeleteId = r['ID'];
  const d    = new Date(r['Data']);
  const dStr = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
  document.getElementById('confirm-record-text').textContent =
    `${r['Posto'] || 'Posto não informado'} • ${dStr}\n\nEsta ação não pode ser desfeita.`;
  document.getElementById('confirm-record-overlay').classList.add('open');
}

function closeConfirmRecord() {
  pendingDeleteId = null;
  document.getElementById('confirm-record-overlay').classList.remove('open');
}

function confirmDeleteRecord() {
  if (!pendingDeleteId) return;
  const id = pendingDeleteId;
  closeConfirmRecord();
  showToast('⏳ Excluindo...', '');
  google.script.run
    .withSuccessHandler(res => {
      if (res.success) {
        records = records.filter(r => String(r['ID']) !== String(id));
        setCachedData(currentUser, 'records', records);
        showToast('🗑️ Registro excluído', 'ok');
        loadRecords(true);
      } else { showToast('❌ ' + res.error, 'err'); }
    })
    .withFailureHandler(() => showToast('❌ Falha na conexão', 'err'))
    .deleteRecord(currentUser, id);
}
/* [/DELETE-RECORD] */

/* [SUBMIT-FORM] ══════════════════════════════ */
function submitForm(e) {
  e.preventDefault();

  // ✅ Validações ANTES de enviar (evita travar o botão)
  const litros = parseDecimal(document.getElementById('f-litros').value);
  const valor  = parseDecimal(document.getElementById('f-valor').value);
  const kmTot  = parseDecimal(document.getElementById('f-kmtotal').value);

  if (litros <= 0) { showToast('⚠️ Litros inválido', ''); return; }
  if (valor  <= 0) { showToast('⚠️ Valor inválido', '');  return; }
  if (kmTot  <= 0) { showToast('⚠️ Informe o KM Total', ''); return; }

  const btn = document.getElementById('btn-salvar');
  btn.disabled = true; btn.textContent = '⏳ Salvando...';

  const record = {
    id:          document.getElementById('f-id').value,
    data:        document.getElementById('f-data').value,
    combustivel: document.getElementById('f-comb').value,
    parcial:     document.getElementById('f-parcial').checked,
    litros:      litros,        // ✅ já validado
    valor:       valor,         // ✅ já validado
    kmTotal:     kmTot,         // ✅ já validado
    posto:       selectedPostoNome
  };

  const fn    = editMode ? 'updateRecord' : 'addRecord';
  const msgOk = editMode ? '💾 Alterações salvas!' : '✅ Abastecimento salvo!';

  google.script.run
    .withSuccessHandler(res => {
      btn.disabled = false;
      btn.textContent = editMode ? '💾 Salvar Alterações' : '✅ Salvar Abastecimento';
      if (res.success) {
        if (editMode) {
          const id = document.getElementById('f-id').value;
          const idx = records.findIndex(r => String(r['ID']) === String(id));
          if (idx >= 0) {
            records[idx]['Data']            = document.getElementById('f-data').value;
            records[idx]['Tipo Combustível'] = document.getElementById('f-comb').value;
            records[idx]['Litros']          = litros;
            records[idx]['Valor']           = valor;
            records[idx]['KM_Total']        = kmTot;
            records[idx]['Posto']           = selectedPostoNome;
            records[idx]['Parcial?']        = document.getElementById('f-parcial').checked;
            setCachedData(currentUser, 'records', records);
          }
        }
        showToast(msgOk, 'ok'); closeModal();
        document.getElementById('form').reset();
        document.getElementById('f-precol').value  = '';
        document.getElementById('f-kmtrip').value  = '';
        document.getElementById('f-kmlprev').value = '';
        selectedPostoNome = '';
        loadRecords(true);
      } else { showToast('❌ ' + res.error, 'err'); }
    })
    .withFailureHandler(() => {
      btn.disabled = false;
      btn.textContent = editMode ? '💾 Salvar Alterações' : '✅ Salvar Abastecimento';
      showToast('❌ Falha na conexão', 'err');
    })
    [fn](currentUser, record);
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

  document.getElementById('summary-grid').innerHTML = `
    <div class="summary-card">
      <div class="summary-icon">💸</div>
      <div class="summary-val" style="color:var(--blue)">${formatBRL(totalGasto)}</div>
      <div class="summary-lbl">Total gasto em combustível</div>
    </div>
    <div class="summary-card">
      <div class="summary-icon">💧</div>
      <div class="summary-val" style="color:var(--purple)">${formatNumber(totalLitros, 1)} L</div>
      <div class="summary-lbl">Total de litros abastecidos</div>
    </div>
    <div class="summary-card">
      <div class="summary-icon">⚡</div>
      <div class="summary-val" style="color:var(--green)">${avgKml ? formatNumber(avgKml, 2)+' km/L' : '—'}</div>
      <div class="summary-lbl">Eficiência média (sem parciais)</div>
    </div>
    <div class="summary-card">
      <div class="summary-icon">🏷️</div>
      <div class="summary-val" style="color:var(--amber)">${avgPreco ? formatBRL(avgPreco) : '—'}</div>
      <div class="summary-lbl">Preço médio por litro</div>
    </div>`;

  const months = {};
  data.forEach(r => {
    const d   = new Date(r['Data']);
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
  const maxValor = Math.max(...sorted.map(m => m.valor));

  document.getElementById('monthly-list').innerHTML = sorted.map(m => {
    const moName  = new Date(m.year,m.month,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
    const avgKml  = m.kmlCount   ? formatNumber(m.kmlSum/m.kmlCount, 1)      : '—';
    const avgPrec = m.precoCount ? formatBRL(m.precoSum/m.precoCount)         : '—';
    const barPct  = maxValor     ? ((m.valor/maxValor)*100).toFixed(1)        : 0;
    const pAviso  = m.parciais   ? ` · ⚠️ ${m.parciais} parcial${m.parciais>1?'is':''}` : '';
    return `
      <div class="month-card">
        <div class="month-header">
          <div class="month-name">${capitalize(moName)}</div>
          <div class="month-count">${m.count} abastec.</div>
        </div>
        <div class="month-grid">
          <div><div class="month-stat-val" style="color:var(--blue)">${formatBRL(m.valor)}</div><div class="month-stat-lbl">💸 Total gasto</div></div>
          <div><div class="month-stat-val" style="color:var(--purple)">${formatNumber(m.litros, 1)} L</div><div class="month-stat-lbl">💧 Total litros</div></div>
          <div><div class="month-stat-val" style="color:var(--green)">${avgKml} km/L</div><div class="month-stat-lbl">⚡ Média km/L${pAviso}</div></div>
          <div><div class="month-stat-val" style="color:var(--amber)">${avgPrec}</div><div class="month-stat-lbl">🏷️ Preço/litro</div></div>
        </div>
        <div class="bar-wrap"><div class="bar-fill" style="width:${barPct}%"></div></div>
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
  document.getElementById('f-precol').value = (l>0&&v>0) ? `R$ ${formatNumber(v/l, 3)}/L` : '';
}

/* [CALC-KM-PREVIEW] — prévia de KM rodados e km/L no formulário */
function calcKm() {
  const kmTotalEl = document.getElementById('f-kmtotal');
  const kmTripEl  = document.getElementById('f-kmtrip');
  const kmlPrevEl = document.getElementById('f-kmlprev');

  const kmTotal = parseDecimal(kmTotalEl.value) || 0;
  const litros  = parseDecimal(document.getElementById('f-litros').value) || 0;
  const dataVal = document.getElementById('f-data').value;
  const editId  = document.getElementById('f-id').value;

  if (kmTotal <= 0 || !dataVal) {
    kmTripEl.value  = '';
    kmlPrevEl.value = '';
    return;
  }

  // 🔍 Acha o KM_Total do registro ANTERIOR (por data/hora)
  const dataAtual = new Date(dataVal).getTime();
  let prevKmTotal = null, prevTime = -Infinity;

  records.forEach(r => {
    if (editId && String(r['ID']) === String(editId)) return; // ignora o próprio
    const t  = new Date(r['Data']).getTime();
    const km = +r['KM_Total'] || 0;
    if (km > 0 && t < dataAtual && t > prevTime) {
      prevTime = t; prevKmTotal = km;
    }
  });

  // 🛣️ KM Rodados
  if (prevKmTotal === null) {
    kmTripEl.value  = '— (1º registro)';
    kmlPrevEl.value = '—';
    return;
  }

  const dist = kmTotal - prevKmTotal;
  if (dist <= 0) {
    kmTripEl.value  = '⚠️ KM ≤ anterior';
    kmlPrevEl.value = '—';
    return;
  }

  kmTripEl.value = `${formatNumber(dist, 0)} km`;

  // ⚡ Prévia de km/L (estimativa simples)
  kmlPrevEl.value = (litros > 0)
    ? `~ ${formatNumber(dist / litros, 2)} km/L`
    : '—';
}
/* [/CALC-KM-PREVIEW] */

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function showToast(msg, type) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.className = `toast show ${type||''}`;
  setTimeout(() => el.className = 'toast', 3200);
}
/* [LOADER-OVERLAY] — controla o overlay de loading */
function showLoader(texto) {
  const el = document.getElementById('loader-overlay');
  if (!el) return;
  if (texto) el.querySelector('.loader-text').textContent = texto;
  el.classList.add('active');
}

function hideLoader() {
  const el = document.getElementById('loader-overlay');
  if (el) el.classList.remove('active');
}
/* [/LOADER-OVERLAY] */

/* [PARSE-DECIMAL] — aceita vírgula OU ponto, sempre retorna número */
function parseDecimal(valor) {
  if (valor === null || valor === undefined || valor === '') return 0;
  // troca vírgula por ponto e remove espaços
  const limpo = String(valor).trim().replace(',', '.');
  const n = parseFloat(limpo);
  return isNaN(n) ? 0 : n;
}
/* [/PARSE-DECIMAL] */

/* define o texto do loader SEM ligar o overlay */
function setLoaderText(texto) {
  const el = document.getElementById('loader-overlay');
  if (el && texto) el.querySelector('.loader-text').textContent = texto;
}

/* [/HELPERS] */
