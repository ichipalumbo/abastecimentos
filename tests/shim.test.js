const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '..', 'shim.js'), 'utf8');

function shim(location, result = { ok: true, json: async () => [] }) {
  const calls = [];
  const classes = [];
  const storage = { fuelapp_cache_Luccas_records_mock_default: 'old', fuelapp_user: 'Luccas' };
  const context = { location, URLSearchParams, localStorage: {
    ...storage, removeItem(key) { delete this[key]; }
  }, document: { documentElement: { classList: { add(name) { classes.push(name); } } } },
  fetch(url, options) { calls.push({ url, options }); return Promise.resolve(result); } };
  context.window = context;
  vm.runInNewContext(source, context);
  return { context, calls, classes };
}

test('local URL and forced mock never target production', async () => {
  const local = shim({ hostname: 'localhost', port: '5000', origin: 'http://localhost:5000',
    protocol: 'http:', search: '?mock=1&scenario=empty&reset=1' });
  local.context.google.script.run.getRecords('Luccas');
  assert.equal(local.calls[0].url, 'http://localhost:5000/exec?scenario=empty');
  assert.equal(local.context.localStorage.fuelapp_cache_Luccas_records_mock_default, undefined);
  assert.equal(local.context.localStorage.fuelapp_user, 'Luccas');
  assert.deepEqual(local.classes, ['mock-mode']);

  const file = shim({ hostname: '', port: '', origin: 'null', protocol: 'file:', search: '' });
  file.context.google.script.run.getRecords('Luccas');
  assert.match(file.calls[0].url, /^http:\/\/127\.0\.0\.1:5000\/exec/);

  const forced = shim({ hostname: 'example.org', port: '', origin: 'https://example.org',
    protocol: 'https:', search: '?mock=1' });
  forced.context.google.script.run.addPosto('Luccas', 'Test');
  assert.match(forced.calls[0].url, /^http:\/\/127\.0\.0\.1:5000\/exec/);
});

test('production without mock parameter keeps its published endpoint', () => {
  const prod = shim({ hostname: 'example.org', port: '', origin: 'https://example.org',
    protocol: 'https:', search: '' });
  prod.context.google.script.run.getRecords('Luccas');
  assert.match(prod.calls[0].url, /^https:\/\/script\.google\.com\/macros\//);
  assert.deepEqual(prod.classes, []);
});

test('HTTP failures reach the failure handler instead of looking like successful data', async () => {
  const response = { ok: false, status: 503, json: async () => ({ error: 'Falha simulada' }) };
  const local = shim({ hostname: 'localhost', port: '5000', origin: 'http://localhost:5000',
    protocol: 'http:', search: '?mock=1' }, response);
  let message;
  local.context.google.script.run.withFailureHandler(error => { message = error.message; }).getRecords('Luccas');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(message, 'Falha simulada');
});
