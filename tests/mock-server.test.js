const assert = require('node:assert/strict');
const http = require('node:http');
const { test, before, after } = require('node:test');
const { createMockServer } = require('../dev/mock/server');

const server = createMockServer();
let base;

before(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));

async function post(action, user = 'Luccas', extras = {}, scenario = 'default') {
  const response = await fetch(`${base}/exec?scenario=${scenario}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8', Origin: base },
    body: JSON.stringify({ action, user, ...extras })
  });
  return { status: response.status, data: await response.json() };
}

test('serves the app and checks mock readiness on the same origin', async () => {
  const health = await fetch(`${base}/__mock/health`);
  assert.equal((await health.json()).environment, 'mock');
  const app = await fetch(base);
  assert.match(await app.text(), /Abastecimentos/);
  assert.equal((await fetch(`${base}/dev/mock/fixtures.json`)).status, 404);
  assert.equal((await fetch(`${base}/GAS/Code.gs`)).status, 404);
});

test('synthetic fixtures are isolated by user and derived metrics are available', async () => {
  const luccas = (await post('getRecords')).data;
  const josy = (await post('getRecords', 'Josy')).data;
  assert.equal(luccas.length, 2);
  assert.equal(josy.length, 1);
  assert.equal(luccas[1].KM_Trip, 300);
  assert.equal(luccas[1]['KM/L Trip'], 7.79);
  assert.deepEqual((await post('getPostos', 'Josy')).data.map(p => p.nome), ['Posto Exemplo Sul']);
});

test('create, edit, delete and reset change only in-memory mock data', async () => {
  const added = await post('addPosto', 'Josy', { nome: 'Posto de teste' });
  assert.equal(added.data.success, true);
  assert.equal((await post('getPostos', 'Luccas')).data.length, 2);
  assert.equal((await post('updatePosto', 'Josy', { id: added.data.id, nome: 'Renomeado' })).data.success, true);
  const record = { data: '2026-09-28T12:00', litros: 20, valor: 100, kmTotal: 12300,
    posto: 'Renomeado', combustivel: 'Gasolina', parcial: false };
  const created = await post('addRecord', 'Josy', { record });
  assert.equal(created.data.success, true);
  assert.equal((await post('updateRecord', 'Josy', { record: { ...record, id: created.data.id, valor: 105 } })).data.success, true);
  assert.equal((await post('getRecords', 'Josy')).data.find(r => r.ID === created.data.id).Valor, 105);
  assert.equal((await post('deleteRecord', 'Josy', { id: created.data.id })).data.success, true);
  assert.equal((await post('deletePosto', 'Josy', { id: added.data.id })).data.success, true);
  const another = await post('addPosto', 'Luccas', { nome: 'Somente memória' });
  assert.equal(another.data.success, true);
  const reset = await fetch(`${base}/__mock/reset`, { method: 'POST' });
  assert.equal((await reset.json()).success, true);
  assert.equal((await post('getPostos')).data.length, 2);
});

test('empty, read-error, write-error and slow scenarios are deterministic', async () => {
  assert.deepEqual((await post('getRecords', 'Luccas', {}, 'empty')).data, []);
  assert.equal((await post('getRecords', 'Luccas', {}, 'read-error')).status, 503);
  assert.equal((await post('addPosto', 'Luccas', { nome: 'Não salvo' }, 'write-error')).status, 503);
  assert.equal((await post('getPostos', 'Luccas', {}, 'write-error')).data.length, 2);
  const start = Date.now();
  assert.equal((await post('getRecords', 'Luccas', {}, 'slow')).status, 200);
  assert.ok(Date.now() - start >= 1200);
});

test('rejects unknown scenarios, origins and malformed requests', async () => {
  assert.equal((await post('getRecords', 'Luccas', {}, 'undefined')).status, 400);
  const remote = await fetch(`${base}/exec`, {
    method: 'POST', headers: { Origin: 'https://example.org' },
    body: JSON.stringify({ user: 'Luccas', action: 'getRecords' })
  });
  assert.equal(remote.status, 403);
  const rebound = await new Promise((resolve, reject) => {
    http.get(`${base}/__mock/health`, { headers: { Host: 'example.org:5000' } }, res => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    }).on('error', reject);
  });
  assert.equal(rebound, 403);
  assert.equal((await post('getRecords', 'Unknown')).status, 400);
  assert.equal((await fetch(`${base}/exec`, { method: 'POST', body: '{' })).status, 400);
});
