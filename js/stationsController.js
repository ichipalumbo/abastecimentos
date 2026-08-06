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
