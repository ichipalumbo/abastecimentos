/* [FORMATAÇÃO BRASIL] ────────────────────── */
function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatNumber(valor, decimais = 2) {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: decimais, maximumFractionDigits: decimais });
}
/* [/FORMATAÇÃO BRASIL] */

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* [PARSE-DECIMAL] — aceita vírgula OU ponto, sempre retorna número */
function parseDecimal(valor) {
  if (valor === null || valor === undefined || valor === '') return 0;
  // troca vírgula por ponto e remove espaços
  const limpo = String(valor).trim().replace(',', '.');
  const n = parseFloat(limpo);
  return isNaN(n) ? 0 : n;
}
/* [/PARSE-DECIMAL] */
