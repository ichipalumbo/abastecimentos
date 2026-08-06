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
