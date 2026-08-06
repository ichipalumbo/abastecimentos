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
