/* [HELPER-ISFULL] ════════════════════════════ */
function isFull(r) {
  return !(r['Parcial?'] === true || String(r['Parcial?']) === 'true');
}


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
