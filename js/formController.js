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
