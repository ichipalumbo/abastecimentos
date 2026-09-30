const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const fixtures = require('./fixtures.json');
const root = path.resolve(__dirname, '..', '..');
const staticFiles = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/script.js', ['script.js', 'text/javascript; charset=utf-8']],
  ['/shim.js', ['shim.js', 'text/javascript; charset=utf-8']],
  ['/manifest.json', ['manifest.json', 'application/json; charset=utf-8']],
  ['/icon.svg', ['icon.svg', 'image/svg+xml']]
]);
const scenarios = ['default', 'empty', 'read-error', 'write-error', 'slow'];

function createMockServer() {
  const databases = new Map();
  let nextId = 1;
  const getDb = scenario => {
    if (!databases.has(scenario)) {
      databases.set(scenario, scenario === 'empty'
        ? { records: { Luccas: [], Josy: [] }, postos: { Luccas: [], Josy: [] } }
        : structuredClone(fixtures));
    }
    return databases.get(scenario);
  };
  const send = (res, status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(data));
  };

  return http.createServer(async (req, res) => {
    if (!/^(localhost|127\.0\.0\.1|\[::1\]):\d+$/.test(req.headers.host || '')) {
      send(res, 403, { error: 'Acesse o mock somente pelo host local.' });
      return;
    }
    const origin = `http://${req.headers.host}`;
    if (req.headers.origin && req.headers.origin !== origin) {
      send(res, 403, { error: 'Use o app servido pelo mock local.' });
      return;
    }
    const url = new URL(req.url, origin);
    if (req.method === 'GET' && url.pathname === '/__mock/health') {
      send(res, 200, { status: 'ok', environment: 'mock', scenarios });
      return;
    }
    if (req.method === 'GET' && staticFiles.has(url.pathname)) {
      const [file, contentType] = staticFiles.get(url.pathname);
      let content;
      try {
        content = await fs.readFile(path.join(root, file));
      } catch (error) {
        console.error('Falha ao servir o app local:', error);
        send(res, 500, { error: 'Arquivo do app indisponível.' });
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-store' });
      res.end(content);
      return;
    }
    if (req.method !== 'POST' || !['/exec', '/__mock/reset'].includes(url.pathname)) {
      send(res, 404, { error: 'Rota não encontrada.' });
      return;
    }
    const scenario = url.searchParams.get('scenario') || 'default';
    if (!scenarios.includes(scenario)) {
      send(res, 400, { error: 'Cenário desconhecido.' });
      return;
    }
    if (url.pathname === '/__mock/reset') {
      databases.clear();
      nextId = 1;
      send(res, 200, { success: true });
      return;
    }
    let body = '';
    req.setEncoding('utf8');
    for await (const chunk of req) {
      body += chunk;
      if (body.length > 1024 * 1024) {
        send(res, 413, { error: 'Requisição grande demais.' });
        return;
      }
    }
    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      send(res, 400, { error: 'JSON inválido.' });
      return;
    }
    if (!payload || !['Luccas', 'Josy'].includes(payload.user)) {
      send(res, 400, { error: 'Perfil inválido.' });
      return;
    }
    const read = ['getRecords', 'getPostos'].includes(payload.action);
    const write = ['addRecord', 'updateRecord', 'deleteRecord', 'addPosto', 'updatePosto', 'deletePosto'].includes(payload.action);
    if (!read && !write) {
      send(res, 400, { error: 'Ação desconhecida.' });
      return;
    }
    if ((read && scenario === 'read-error') || (write && scenario === 'write-error')) {
      send(res, 503, { error: 'Falha simulada. Nenhuma alteração foi feita.' });
      return;
    }
    if (scenario === 'slow') await new Promise(resolve => setTimeout(resolve, 1400));
    const db = getDb(scenario);
    const { user, action } = payload;
    const records = db.records[user];
    const postos = db.postos[user];
    if (action === 'getRecords') {
      const sorted = [...records].sort((a, b) => new Date(a.Data) - new Date(b.Data));
      let previous = null;
      const result = sorted.map(record => {
        const trip = previous && record.KM_Total > previous.KM_Total ? record.KM_Total - previous.KM_Total : 0;
        previous = record;
        return { ...record, KM_Trip: trip, 'KM/L Trip': trip && record.Litros && !record['Parcial?']
          ? Number((trip / record.Litros).toFixed(2)) : 0 };
      });
      send(res, 200, result);
      return;
    }
    if (action === 'getPostos') {
      send(res, 200, postos);
      return;
    }
    if (action === 'addPosto') {
      if (!payload.nome || !String(payload.nome).trim()) {
        send(res, 200, { success: false, error: 'Informe o nome do posto.' });
        return;
      }
      const posto = { id: `mock-p${nextId++}`, nome: String(payload.nome).trim() };
      postos.push(posto);
      send(res, 200, { success: true, ...posto });
      return;
    }
    if (action === 'updatePosto' || action === 'deletePosto') {
      const index = postos.findIndex(p => p.id === payload.id);
      if (index < 0) { send(res, 200, { success: false, error: 'Posto não encontrado.' }); return; }
      if (action === 'updatePosto') {
        if (!payload.nome || !String(payload.nome).trim()) {
          send(res, 200, { success: false, error: 'Informe o nome do posto.' });
          return;
        }
        postos[index].nome = String(payload.nome).trim();
      } else postos.splice(index, 1);
      send(res, 200, { success: true });
      return;
    }
    if (action === 'deleteRecord') {
      const index = records.findIndex(r => r.ID === payload.id);
      if (index < 0) { send(res, 200, { success: false, error: 'Registro não encontrado.' }); return; }
      records.splice(index, 1);
      send(res, 200, { success: true });
      return;
    }
    const input = payload.record || {};
    const index = action === 'updateRecord' ? records.findIndex(r => r.ID === input.id) : -1;
    if (action === 'updateRecord' && index < 0) {
      send(res, 200, { success: false, error: 'Registro não encontrado.' });
      return;
    }
    const date = new Date(input.data);
    if (!Number.isFinite(date.getTime()) || !Number.isFinite(+input.litros) || +input.litros <= 0 ||
        !Number.isFinite(+input.valor) || +input.valor <= 0 ||
        !Number.isInteger(+input.kmTotal) || +input.kmTotal <= 0) {
      send(res, 200, { success: false, error: 'Confira data, litros, valor e quilometragem.' });
      return;
    }
    const id = action === 'addRecord' ? `mock-r${nextId++}` : records[index].ID;
    const record = {
      ID: id, Data: input.data, KM_Total: +input.kmTotal, Litros: +input.litros,
      Valor: +input.valor, 'Parcial?': Boolean(input.parcial),
      Posto: String(input.posto || ''), 'Tipo Combustível': String(input.combustivel || '')
    };
    if (action === 'addRecord') records.push(record);
    else records[index] = record;
    send(res, 200, { success: true, id });
  });
}

if (require.main === module) {
  createMockServer().listen(5000, '127.0.0.1', () => {
    console.log('Mock local: http://localhost:5000/?mock=1');
  });
}

module.exports = { createMockServer };
