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

/* esconde o overlay só quando tudo terminou */
function checkLoadsDone() {
  pendingLoads = Math.max(0, pendingLoads - 1);
  if (pendingLoads === 0) hideLoader();
}
/* [/LOAD-DATA] */

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
