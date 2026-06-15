
/* ══════════════════════════════════════════════
   STATE
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  setNow();
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.classList.add('hide');
  }, 1200);
});

/* ══════════════════════════════════════════════
   USER SELECTION
══════════════════════════════════════════════ */
function selectUser(user) {
  currentUser = user;
  localStorage.setItem('fuelapp_user', user);
  document.getElementById('user-select').classList.add('hidden');
  document.getElementById('home-title').textContent =
    `⛽ ${user === 'Josy' ? '💜' : '💙'} ${user}`;
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

/* ══════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════ */
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.page').forEach(p     => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + tab).classList.add('active');
  document.getElementById('nav-'  + tab).classList.add('active');
  if (tab === 'analytics' && records.length && !analyticsBuilt) renderAnalytics(records);
}

/* ══════════════════════════════════════════════
   LOAD DATA
══════════════════════════════════════════════ */
function loadRecords() {
  google.script.run
    .withSuccessHandler(data => {
      records = data; analyticsBuilt = false;
      renderStats(data); renderList(data);
      if (currentTab === 'analytics') renderAnalytics(data);
    })
    .withFailureHandler(err => {
      document.getElementById('list').innerHTML =
        `<div class="empty"><div class="empty-icon">❌</div>
         <p style="color:var(--red)">Erro ao carregar:<br><small>${err.message}</small></p></div>`;
    })
    .getRecords(currentUser);
}

function loadPostos() {
  google.script.run
    .withSuccessHandler(data => {
      postos = data;
      renderPostoPicker();
      renderAdminPostos();
    })
    .withFailureHandler(() => {})
    .getPostos(currentUser);
}

/* ══════════════════════════════════════════════
   HELPER — abastecimento cheio (não parcial)
══════════════════════════════════════════════ */
function isFull(r) {
  return !(r['Parcial?'] === true || String(r['Parcial?']) === 'true');
}

/* ══════════════════════════════════════════════
   STATS (HOME)
══════════════════════════════════════════════ */
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

  document.getElementById('s-mes').textContent   = `R$${totalMes.toFixed(0)}`;
  document.getElementById('s-kml').textContent   = avgKml   ? avgKml.toFixed(1)          : '—';
  document.getElementById('s-preco').textContent = avgPreco ? `R$${avgPreco.toFixed(2)}` : '—';

  const moName = now.toLocaleDateString('pt-BR', { month:'long', year:'numeric' });
  document.getElementById('subtitle').textContent  = `${data.length} registros • ${capitalize(moName)}`;
  document.getElementById('badge-mes').textContent = thisMo.length
    ? `${thisMo.length} este mês` : 'sem registro';
}

/* ══════════════════════════════════════════════
   LIST (HOME)
══════════════════════════════════════════════ */
function renderList(data) {
  const el = document.getElementById('list');
  if (!data.length) {
    el.innerHTML = `<div class="empty">
      <div class="empty-icon">⛽</div>
      <p>Nenhum abastecimento ainda.<br>Toque em <strong>Registrar</strong> para começar!</p>
    </div>`;
    return;
  }
  el.innerHTML = data.map((r, idx) => {
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
              ${kml     ? `<span class="chip green">⚡ ${kml.toFixed(1)} km/L</span>`    : ''}
              ${kmTrip  ? `<span class="chip purple">🛣️ ${kmTrip.toFixed(0)} km</span>` : ''}
              ${precoL  ? `<span class="chip amber">R$ ${precoL.toFixed(2)}/L</span>`    : ''}
            </div>
          </div>
          <div class="record-right">
            <div class="record-valor">R$ ${valor.toFixed(2)}</div>
            <div class="record-litros">${litros.toFixed(2)} L</div>
          </div>
        </div>
        <div class="record-actions">
          <button class="btn-action btn-edit"   onclick="openEdit(${idx})">✏️ Editar</button>
          <button class="btn-action btn-delete" onclick="askDelete(${idx})">🗑️ Excluir</button>
        </div>
      </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════
   POSTO PICKER (formulário)
══════════════════════════════════════════════ */
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



/* ══════════════════════════════════════════════
   ADMIN — POSTOS
══════════════════════════════════════════════ */
function renderAdminPostos() {
  const el = document.getElementById('postos-admin-list');
  if (!el) return;
  if (!postos.length) {
    el.innerHTML = `<div class="empty">
      <div class="empty-icon">🏪</div>
      <p>Nenhum posto cadastrado.<br>Clique em <strong>+ Novo Posto</strong> para adicionar.</p>
    </div>`;
    return;
  }
  el.innerHTML = postos.map((p, i) => `
    <div class="posto-admin-card">
      <div class="posto-admin-name">🏪 ${p.nome}</div>
      <div class="posto-admin-btns">
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
        renderPostoPicker(); renderAdminPostos();
        showToast('🗑️ Posto removido', 'ok');
      } else { showToast('❌ ' + res.error, 'err'); }
    })
    .withFailureHandler(() => showToast('❌ Falha na conexão', 'err'))
    .deletePosto(currentUser, id);
}

/* ══════════════════════════════════════════════
   MODAL — FORM (registro)
══════════════════════════════════════════════ */
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
  document.getElementById('f-kmtrip').value    = r['KM_Trip']          || '';
  selectedPostoNome = r['Posto'] || '';
  calcPreco(); cancelInlineAddPosto(); renderPostoPicker();
  const d    = new Date(r['Data']);
  const dStr = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
  document.getElementById('modal-title').textContent    = '✏️ Editar Abastecimento';
  document.getElementById('modal-subtitle').textContent = `ID: ${r['ID']} • ${dStr}`;
  document.getElementById('btn-salvar').textContent     = '💾 Salvar Alterações';
  document.getElementById('overlay').classList.add('open');
}

function closeModal() { document.getElementById('overlay').classList.remove('open'); }
function bgClick(e)   { if (e.target === document.getElementById('overlay')) closeModal(); }

/* ══════════════════════════════════════════════
   DELETE RECORD
══════════════════════════════════════════════ */
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
      if (res.success) { showToast('🗑️ Registro excluído', 'ok'); loadRecords(); }
      else { showToast('❌ ' + res.error, 'err'); }
    })
    .withFailureHandler(() => showToast('❌ Falha na conexão', 'err'))
    .deleteRecord(currentUser, id);
}

/* ══════════════════════════════════════════════
   SUBMIT FORM
══════════════════════════════════════════════ */
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-salvar');
  btn.disabled = true; btn.textContent = '⏳ Salvando...';

  const record = {
    id:          document.getElementById('f-id').value,
    data:        document.getElementById('f-data').value,
    combustivel: document.getElementById('f-comb').value,
    parcial:     document.getElementById('f-parcial').checked,
    litros:      +document.getElementById('f-litros').value,
    valor:       +document.getElementById('f-valor').value,
    kmTotal:     +document.getElementById('f-kmtotal').value || '',
    kmTrip:      +document.getElementById('f-kmtrip').value  || '',
    posto:       selectedPostoNome
  };

  const fn    = editMode ? 'updateRecord' : 'addRecord';
  const msgOk = editMode ? '💾 Alterações salvas!' : '✅ Abastecimento salvo!';

  google.script.run
    .withSuccessHandler(res => {
      btn.disabled = false;
      btn.textContent = editMode ? '💾 Salvar Alterações' : '✅ Salvar Abastecimento';
      if (res.success) {
        showToast(msgOk, 'ok'); closeModal();
        document.getElementById('form').reset();
        document.getElementById('f-precol').value = '';
        selectedPostoNome = ''; loadRecords();
      } else { showToast('❌ ' + res.error, 'err'); }
    })
    .withFailureHandler(() => {
      btn.disabled = false;
      btn.textContent = editMode ? '💾 Salvar Alterações' : '✅ Salvar Abastecimento';
      showToast('❌ Falha na conexão', 'err');
    })
    [fn](currentUser, record);
}

/* ══════════════════════════════════════════════
   ANALYTICS
══════════════════════════════════════════════ */
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
      <div class="summary-val" style="color:var(--blue)">R$ ${totalGasto.toFixed(2)}</div>
      <div class="summary-lbl">Total gasto em combustível</div>
    </div>
    <div class="summary-card">
      <div class="summary-icon">💧</div>
      <div class="summary-val" style="color:var(--purple)">${totalLitros.toFixed(1)} L</div>
      <div class="summary-lbl">Total de litros abastecidos</div>
    </div>
    <div class="summary-card">
      <div class="summary-icon">⚡</div>
      <div class="summary-val" style="color:var(--green)">${avgKml ? avgKml.toFixed(2)+' km/L' : '—'}</div>
      <div class="summary-lbl">Eficiência média (sem parciais)</div>
    </div>
    <div class="summary-card">
      <div class="summary-icon">🏷️</div>
      <div class="summary-val" style="color:var(--amber)">${avgPreco ? 'R$ '+avgPreco.toFixed(3) : '—'}</div>
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
    const avgKml  = m.kmlCount   ? (m.kmlSum/m.kmlCount).toFixed(1)           : '—';
    const avgPrec = m.precoCount ? 'R$ '+(m.precoSum/m.precoCount).toFixed(3) : '—';
    const barPct  = maxValor     ? ((m.valor/maxValor)*100).toFixed(1)        : 0;
    const pAviso  = m.parciais   ? ` · ⚠️ ${m.parciais} parcial${m.parciais>1?'is':''}` : '';
    return `
      <div class="month-card">
        <div class="month-header">
          <div class="month-name">${capitalize(moName)}</div>
          <div class="month-count">${m.count} abastec.</div>
        </div>
        <div class="month-grid">
          <div><div class="month-stat-val" style="color:var(--blue)">R$ ${m.valor.toFixed(2)}</div><div class="month-stat-lbl">💸 Total gasto</div></div>
          <div><div class="month-stat-val" style="color:var(--purple)">${m.litros.toFixed(1)} L</div><div class="month-stat-lbl">💧 Total litros</div></div>
          <div><div class="month-stat-val" style="color:var(--green)">${avgKml} km/L</div><div class="month-stat-lbl">⚡ Média km/L${pAviso}</div></div>
          <div><div class="month-stat-val" style="color:var(--amber)">${avgPrec}</div><div class="month-stat-lbl">🏷️ Preço/litro</div></div>
        </div>
        <div class="bar-wrap"><div class="bar-fill" style="width:${barPct}%"></div></div>
      </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function calcPreco() {
  const l = +document.getElementById('f-litros').value;
  const v = +document.getElementById('f-valor').value;
  document.getElementById('f-precol').value = (l>0&&v>0) ? `R$ ${(v/l).toFixed(3)}/L` : '';
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function showToast(msg, type) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.className = `toast show ${type||''}`;
  setTimeout(() => el.className = 'toast', 3200);
}

