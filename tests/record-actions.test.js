const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function app() {
  const elements = new Map();
  const list = {
    cards: [],
    set innerHTML(html) {
      this.html = html;
      this.cards = html.split('<div class="record-card">').slice(1).map(chunk => {
        const posto = chunk.match(/<div class="record-posto">([^<]*)<\/div>/)[1];
        const handlers = {};
        const labels = {};
        return {
          posto,
          labels,
          querySelector(selector) {
            return {
              addEventListener(event, handler) { handlers[selector] = handler; },
              setAttribute(name, value) { labels[selector] = value; },
              click() { handlers[selector](); }
            };
          }
        };
      });
    },
    get innerHTML() { return this.html; },
    querySelectorAll() { return this.cards; }
  };
  elements.set('list', list);
  function element(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        value: '',
        textContent: '',
        style: {},
        focus() { this.focused = true; },
        setAttribute() {},
        classList: {
          values: new Set(),
          add(name) { this.values.add(name); },
          remove(name) { this.values.delete(name); },
          toggle(name, force) { if (force) this.add(name); else this.remove(name); },
          contains(name) { return this.values.has(name); }
        },
        reset() { this.value = ''; },
        querySelector() { return { textContent: '' }; }
      });
    }
    return elements.get(id);
  }
  const requests = [];
  const operations = [];
  const removedCacheKeys = [];
  const runner = {
    withSuccessHandler(success) { this.success = success; return this; },
    withFailureHandler(failure) { this.failure = failure; return this; },
    deleteRecord(user, id) {
      requests.push({ user, id });
      operations.push({ kind: 'delete', success: this.success });
    },
    updateRecord(user, record) { operations.push({ kind: 'update', user, record, success: this.success, failure: this.failure }); },
    addRecord(user, record) { operations.push({ kind: 'add', user, record, success: this.success, failure: this.failure }); },
    getRecords(user) { operations.push({ kind: 'records', user, success: this.success }); },
    getPostos(user) { operations.push({ kind: 'postos', user, success: this.success }); }
  };
  const context = vm.createContext({
    document: { getElementById: element, addEventListener() {} },
    localStorage: {
      getItem() { return null; }, setItem() {},
      removeItem(key) { removedCacheKeys.push(key); }
    },
    google: { script: { run: runner } },
    setTimeout() {}
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8'), context);
  const data = [
    record('aug-1', '2026-08-12', 'Aug-1', 300),
    record('jul-1', '2026-07-10', 'Jul-1', 100),
    record('sep-2', '2026-09-02', 'Sep-2', 500),
    record('aug-2', '2026-08-20', 'Aug-2', 400),
    record('sep-1', '2026-09-27', 'Sep-1', 600),
    record('jul-2', '2026-07-15', 'Jul-2', 200)
  ];
  context.data = data;
  vm.runInContext('currentUser = "Luccas"; records = data', context);
  return { context, elements, list, requests, operations, removedCacheKeys, data, run: code => vm.runInContext(code, context) };
}

function record(id, date, posto, km) {
  return {
    'ID': id, 'Data': `${date}T12:00:00`, 'Posto': posto,
    'Tipo Combustível': 'Gasolina', 'Valor': 50, 'Litros': 10,
    'KM_Total': km, 'Parcial?': false
  };
}

test('edit and delete target every displayed card in both orders', () => {
  const a = app();
  for (const order of ['desc', 'asc']) {
    a.run(`sortOrder = '${order}'; renderList(records)`);
    assert.equal(a.list.cards.length, 6);
    for (const card of a.list.cards) {
      const expected = a.data.find(r => r['Posto'] === card.posto);
      assert.match(card.labels['.btn-edit'], new RegExp(`Editar abastecimento: ${card.posto}`));
      assert.match(card.labels['.btn-delete'], new RegExp(`Excluir abastecimento: ${card.posto}`));
      card.querySelector('.btn-edit').click();
      assert.equal(a.elements.get('f-id').value, expected['ID']);
      assert.equal(a.elements.get('f-kmtotal').value, expected['KM_Total']);
      a.run('closeModal()');
      card.querySelector('.btn-delete').click();
      assert.equal(a.run('pendingDeleteId'), expected['ID']);
      assert.match(a.elements.get('confirm-record-text').textContent, new RegExp(card.posto));
      a.run('closeConfirmRecord()');
    }
  }
  assert.deepEqual(a.requests, []);
});

test('closing a dialog restores focus to the triggering control', () => {
  const a = app();
  const trigger = { focus() { this.focused = true; } };
  a.context.document.activeElement = trigger;
  a.run('openModal()');
  assert.equal(a.elements.get('overlay').classList.contains('open'), true);
  a.run('closeModal()');
  assert.equal(trigger.focused, true);
  assert.equal(a.elements.get('overlay').classList.contains('open'), false);
});

test('cancel does not call API; confirm sends only the chosen record ID', () => {
  const a = app();
  a.run('renderList(records)');
  const card = a.list.cards.find(c => c.posto === 'Aug-1');
  card.querySelector('.btn-delete').click();
  a.run('closeConfirmRecord()');
  assert.deepEqual(a.requests, []);
  card.querySelector('.btn-delete').click();
  a.run('confirmDeleteRecord()');
  assert.deepEqual(a.requests, [{ user: 'Luccas', id: 'aug-1' }]);
});

test('missing, duplicate and stale IDs never open actions or call API', () => {
  const a = app();
  a.run('renderList(records)');
  const card = a.list.cards.find(c => c.posto === 'Aug-1');
  a.run('records = records.filter(r => r["ID"] !== "aug-1")');
  card.querySelector('.btn-edit').click();
  assert.match(a.elements.get('toast').textContent, /não encontrado/);
  assert.equal(a.elements.get('f-id')?.value ?? '', '');

  a.run('records = [...data, data[0]]; renderList(records)');
  a.list.cards.find(c => c.posto === 'Aug-1').querySelector('.btn-delete').click();
  assert.equal(a.run('pendingDeleteId'), null);
  assert.match(a.elements.get('toast').textContent, /duplicado/);

  a.run('records = data; renderList(records)');
  a.list.cards.find(c => c.posto === 'Aug-1').querySelector('.btn-delete').click();
  a.run('records = records.filter(r => r["ID"] !== "aug-1"); confirmDeleteRecord()');
  assert.deepEqual(a.requests, []);
  assert.equal(a.run('pendingDeleteId'), null);

  a.run('records = data; renderList(records)');
  const oldCard = a.list.cards[0];
  a.run('currentUser = "Josy"');
  oldCard.querySelector('.btn-edit').click();
  assert.match(a.elements.get('toast').textContent, /indisponível/);
  assert.equal(a.elements.get('f-id')?.value ?? '', '');
  a.run('currentUser = "Luccas"; records = [...data, { ...data[0], ID: "" }]; renderList(records)');
  a.list.cards.find(c => c.posto === 'Aug-1').querySelector('.btn-delete').click();
  assert.equal(a.run('pendingDeleteId'), 'aug-1');
  a.run('closeConfirmRecord()');
  a.list.cards.filter(c => c.posto === 'Aug-1').at(-1).querySelector('.btn-delete').click();
  assert.equal(a.run('pendingDeleteId'), null);
  assert.match(a.elements.get('toast').textContent, /indisponível/);
});

test('late load and mutation responses do not overwrite a newly selected profile', () => {
  const a = app();
  a.run('loadRecords(true); loadPostos(true)');
  a.run('renderList(records)');
  a.list.cards.find(c => c.posto === 'Aug-1').querySelector('.btn-delete').click();
  a.run('confirmDeleteRecord()');
  a.list.cards.find(c => c.posto === 'Jul-1').querySelector('.btn-edit').click();
  a.elements.get('f-data').value = '2026-07-10T12:00';
  a.run('submitForm({ preventDefault() {} })');
  assert.equal(a.operations.find(op => op.kind === 'update').record.id, 'jul-1');
  a.run('profileEpoch++; currentUser = "Josy"; records = [{ ...data[0], ID: "josy" }]; postos = []');
  for (const op of a.operations) op.success(op.kind === 'records' || op.kind === 'postos' ? a.data : { success: true });
  assert.equal(a.run('records[0]["ID"]'), 'josy');
  assert.equal(a.run('records.length'), 1);
  assert.equal(a.run('postos.length'), 0);
  assert.equal(a.operations.length, 4);
  assert.equal(a.requests[0].id, 'aug-1');
  assert.equal(a.removedCacheKeys.filter(key => key === 'fuelapp_cache_Luccas_records').length, 2);
});

test('an older refresh cannot replace newer records for the same profile', () => {
  const a = app();
  a.run('loadRecords(true); loadRecords(true)');
  const [older, newer] = a.operations.filter(op => op.kind === 'records');
  newer.success(a.data.slice(0, 1));
  older.success(a.data);
  assert.equal(a.run('records.length'), 1);
  assert.equal(a.run('records[0]["ID"]'), 'aug-1');
});

test('a successful edit updates only the selected record before refreshing', () => {
  const a = app();
  a.run('renderList(records)');
  a.list.cards.find(c => c.posto === 'Aug-2').querySelector('.btn-edit').click();
  a.elements.get('f-valor').value = '75';
  a.run('submitForm({ preventDefault() {} })');
  const update = a.operations.find(op => op.kind === 'update');
  assert.equal(update.user, 'Luccas');
  assert.equal(update.record.id, 'aug-2');
  update.success({ success: true });
  assert.equal(a.data.find(r => r['ID'] === 'aug-2')['Valor'], 75);
  assert.equal(a.data.find(r => r['ID'] === 'aug-1')['Valor'], 50);
  assert.equal(a.operations.at(-1).kind, 'records');
});

test('the form shows previous mileage and does not submit malformed amounts', () => {
  const a = app();
  a.elements.set('f-comb', { value: 'Gasolina' });
  a.run('document.getElementById("f-data").value = "2026-09-29T12:00"; document.getElementById("f-litros").value = "12,5"');
  a.run('calcKm()');
  assert.match(a.elements.get('previous-km').textContent, /600 km/);
  a.elements.get('f-litros').value = '12abc';
  a.run('document.getElementById("f-valor").value = "60"; document.getElementById("f-kmtotal").value = "650"');
  a.run('submitForm({ preventDefault() {} })');
  assert.equal(a.elements.get('f-litros').focused, true);
  assert.equal(a.operations.length, 0);
  assert.match(a.elements.get('toast').textContent, /Litros/);
});

test('a failed save retains the entered data for retry', () => {
  const a = app();
  a.elements.set('f-comb', { value: 'Gasolina' });
  a.run('document.getElementById("f-litros").value = "12,5"; document.getElementById("f-valor").value = "60"; document.getElementById("f-kmtotal").value = "650"');
  a.run('submitForm({ preventDefault() {} })');
  const add = a.operations.find(op => op.kind === 'add');
  assert.equal(add.record.litros, 12.5);
  add.failure(new Error('offline'));
  assert.equal(a.elements.get('f-litros').value, '12,5');
  assert.equal(a.elements.get('f-valor').value, '60');
  assert.equal(a.elements.get('btn-salvar').disabled, false);
  assert.match(a.elements.get('toast').textContent, /Falha na conexão/);
});

test('recent choices are scoped to the current profile and require an explicit tap', () => {
  const a = app();
  a.elements.set('f-comb', { value: '', options: [{ value: '' }, { value: 'Gasolina' }], focus() { this.focused = true; } });
  a.run('postos = [{ nome: "Aug-1" }, { nome: "Sep-1" }, { nome: "Sep-2" }]; renderPostoPicker(); renderRecentFuel()');
  assert.match(a.elements.get('posto-picker').innerHTML, /Sep-1[\s\S]*Sep-2[\s\S]*Aug-1/);
  assert.equal(a.elements.get('recent-fuel').hidden, false);
  assert.equal(a.elements.get('f-comb').value, '');
  assert.equal(a.run('selectedPostoNome'), '');
  a.run('useRecentFuel(); selectPosto(1)');
  assert.equal(a.elements.get('f-comb').value, 'Gasolina');
  assert.equal(a.run('selectedPostoNome'), 'Sep-1');
  a.run('records = []; selectedPostoNome = ""; renderPostoPicker(); renderRecentFuel()');
  assert.equal(a.elements.get('recent-fuel').hidden, true);
  assert.equal(a.elements.get('recent-postos-label').hidden, true);
});

test('fuel selection is required before sending a new record', () => {
  const a = app();
  a.run('document.getElementById("f-litros").value = "10"; document.getElementById("f-valor").value = "50"; document.getElementById("f-kmtotal").value = "700"');
  a.run('submitForm({ preventDefault() {} })');
  assert.equal(a.elements.get('f-comb').focused, true);
  assert.equal(a.operations.length, 0);
});

test('monthly trends show up to six chronological months with an explicit metric', () => {
  const a = app();
  a.data[0]['KM/L Trip'] = 12.5;
  a.run('renderAnalytics(data)');
  const chart = a.elements.get('trend-chart');
  assert.match(chart.innerHTML, /jul\. de 26[\s\S]*ago\. de 26[\s\S]*set\. de 26/);
  assert.match(chart.innerHTML, /R\$/);
  a.run('selectTrendMetric("price")');
  assert.match(chart.innerHTML, /\/L/);
  assert.equal(a.elements.get('trend-price').classList.contains('active'), true);
  a.run('selectTrendMetric("efficiency")');
  assert.match(chart.innerHTML, /km\/L/);
  a.run('renderAnalytics(Array.from({ length: 8 }, (_, i) => ({ Data: `2026-${String(i + 1).padStart(2, "0")}-15T12:00:00`, Valor: 50, Litros: 10, "Parcial?": false })))');
  assert.equal((chart.innerHTML.match(/class="trend-row"/g) || []).length, 6);
  assert.doesNotMatch(chart.innerHTML, /jan\. de 26|fev\. de 26/);
  assert.match(chart.innerHTML, /<span class="trend-value">—<\/span>/);
  a.run('renderAnalytics([])');
  assert.match(chart.innerHTML, /Registre um abastecimento/);
});

test('cache keys isolate mock scenarios including mock mode on a published host', () => {
  const a = app();
  a.context.URLSearchParams = URLSearchParams;
  a.context.window = { location: { hostname: 'example.org', protocol: 'https:', search: '' } };
  assert.equal(a.run('getCacheKey("Luccas", "records")'), 'fuelapp_cache_Luccas_records');
  a.context.window.location.search = '?mock=1&scenario=empty';
  assert.equal(a.run('getCacheKey("Luccas", "records")'), 'fuelapp_cache_Luccas_records_mock_empty');
  a.context.window.location.search = '?mock=1&scenario=write-error';
  assert.equal(a.run('getCacheKey("Luccas", "records")'), 'fuelapp_cache_Luccas_records_mock_write-error');
});
