// ============================================================
// CONFIGURAÇÃO
// ============================================================
const SPREADSHEET_ID = '1Z52bmMRy1ydt_fTeAZxLUSxg9K966njdJdRuUbpyZx8';
const SHEET_NAME = 'Abastecimentos';

const HEADERS = [
  'ID', 'Data', 'KM/L Trip', 'KM_H', 'KM_Trip',
  'KM_Total', 'Litros', 'Valor', 'Parcial?', 'Posto', 'Tipo Combustível'
];

// ── Serve o app HTML ─────────────────────────────────────────
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Abastecimentos')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── Chamado pelo HTML via google.script.run ──────────────────
function getRegistros() {
  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName(SHEET_NAME);

  if (!sheet) return [];

  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      const v = row[i];
      // Converte Date objects para string YYYY-MM-DD
      if (v instanceof Date) {
        const y = v.getFullYear();
        const m = String(v.getMonth() + 1).padStart(2, '0');
        const d = String(v.getDate()).padStart(2, '0');
        obj[h] = y + '-' + m + '-' + d;
      } else {
        obj[h] = v;
      }
    });
    return obj;
  });
}

// ── Chamado pelo HTML via google.script.run ──────────────────
function executarOperacao(payload) {
  const acao = payload.acao;
  const registro = payload.registro;

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  }

  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (!firstRow[0]) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

  if (acao === 'adicionar') {
    sheet.appendRow([
      registro['ID'],
      registro['Data'],
      registro['KM/L Trip'] || '',
      registro['KM_H'] || '',
      registro['KM_Trip'] || '',
      registro['KM_Total'] || '',
      registro['Litros'],
      registro['Valor'],
      registro['Parcial?'] || false,
      registro['Posto'] || '',
      registro['Tipo Combustível'] || 'Gasolina'
    ]);
    return { ok: true };
  }

  if (acao === 'atualizar' || acao === 'excluir') {
    const dados = sheet.getDataRange().getValues();
    const idCol = dados[0].indexOf('ID');
    let linhaEncontrada = -1;

    for (let i = 1; i < dados.length; i++) {
      if (String(dados[i][idCol]) === String(registro['ID'])) {
        linhaEncontrada = i + 1;
        break;
      }
    }

    if (linhaEncontrada === -1) throw new Error('Registro não encontrado');

    if (acao === 'excluir') {
      sheet.deleteRow(linhaEncontrada);
      return { ok: true };
    }

    if (acao === 'atualizar') {
      sheet.getRange(linhaEncontrada, 1, 1, HEADERS.length).setValues([[
        registro['ID'],
        registro['Data'],
        registro['KM/L Trip'] || '',
        registro['KM_H'] || '',
        registro['KM_Trip'] || '',
        registro['KM_Total'] || '',
        registro['Litros'],
        registro['Valor'],
        registro['Parcial?'] || false,
        registro['Posto'] || '',
        registro['Tipo Combustível'] || 'Gasolina'
      ]]);
      return { ok: true };
    }
  }

  throw new Error('Ação desconhecida');
}

// ── Teste — rode manualmente para verificar ──────────────────
function testarLeitura() {
  const resultado = getRegistros();
  Logger.log('Total: ' + resultado.length);
  Logger.log('Primeiro: ' + JSON.stringify(resultado[0]));
}