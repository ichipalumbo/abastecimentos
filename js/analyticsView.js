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
