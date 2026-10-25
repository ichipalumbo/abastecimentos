const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'mock-data.json');
const EXPECTED_TOKEN = process.env.API_TOKEN || 'abst_7gK9pQ2xW5nR8tL4vY6mZ3jH';

app.use(cors());
app.use(express.json());
app.use(express.text({ type: 'text/*' }));

function loadData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { records: {}, postos: {}, nextRecordId: 1, nextPostoId: 1 };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function sortRecordsByDate(records) {
  return [...records].sort((a, b) => new Date(a.Data) - new Date(b.Data));
}

function recalcUserRecords(records) {
  let prev = null;
  const sorted = sortRecordsByDate(records);
  return sorted.map(rec => {
    const current = { ...rec };
    const kmTotal = Number(current.KM_Total || 0);
    const litros = Number(current.Litros || 0);
    if (prev && !isNaN(prev.KM_Total) && !isNaN(kmTotal) && kmTotal > prev.KM_Total) {
      current.KM_Trip = kmTotal - prev.KM_Total;
      current['KM/L Trip'] = litros > 0
        ? Number((current.KM_Trip / litros).toFixed(2))
        : 0;
    } else {
      current.KM_Trip = 0;
      current['KM/L Trip'] = 0;
    }
    prev = current;
    return current;
  });
}

app.post('/exec', (req, res) => {
  let payload;
  try {
    if (typeof req.body === 'string' && req.body.trim()) payload = JSON.parse(req.body);
    else payload = req.body;
  } catch (e) {
    return res.status(400).json({ success: false, error: 'invalid json' });
  }

  const { token, action, user } = payload || {};
  if (!action) return res.status(400).json({ success: false, error: 'missing action' });

  if (EXPECTED_TOKEN && token !== EXPECTED_TOKEN) {
    // allow empty token in dev if EXPECTED_TOKEN is falsy
    return res.status(403).json({ success: false, error: 'invalid token' });
  }

  const db = loadData();
  db.records = db.records || {};
  db.postos  = db.postos  || {};

  const ensureUser = (u) => { if (!db.records[u]) db.records[u] = []; if (!db.postos[u]) db.postos[u] = []; };
  if (user) ensureUser(user);

  switch (action) {
    case 'getRecords': {
      const userRecords = db.records[user] || [];
      return res.json(recalcUserRecords(userRecords));
    }

    case 'getPostos':
      return res.json(db.postos[user] || []);

    case 'addPosto': {
      const nome = payload.nome || payload.posto || '';
      if (!nome) return res.json({ success: false, error: 'Nome obrigatório' });
      const id = `p${db.nextPostoId++}`;
      const p = { id, nome };
      ensureUser(user);
      db.postos[user].push(p);
      saveData(db);
      return res.json({ success: true, id, nome });
    }

    case 'updatePosto': {
      const id = payload.id;
      const nome = payload.nome;
      if (!id || !nome) return res.json({ success: false, error: 'id/nome required' });
      ensureUser(user);
      const idx = db.postos[user].findIndex(x => x.id === id);
      if (idx === -1) return res.json({ success: false, error: 'posto not found' });
      db.postos[user][idx].nome = nome;
      saveData(db);
      return res.json({ success: true });
    }

    case 'deletePosto': {
      const id = payload.id;
      if (!id) return res.json({ success: false, error: 'id required' });
      ensureUser(user);
      db.postos[user] = db.postos[user].filter(p => p.id !== id);
      saveData(db);
      return res.json({ success: true });
    }

    case 'addRecord': {
      const record = payload.record || {};
      ensureUser(user);
      const id = `r${db.nextRecordId++}`;
      // map incoming fields to the format script.js expects
      const now = new Date(record.data || record.Data || Date.now()).toISOString();
      const newRec = {
        ID: id,
        Data: now,
        Valor: Number(record.valor || record.Valor || 0),
        Litros: Number(record.litros || record.Litros || 0),
        KM_Total: Number(record.kmTotal || record.KM_Total || 0),
        'KM_Trip': Number(record.kmTrip || record.KM_Trip || 0),
        'KM/L Trip': Number(record.kml || record['KM/L Trip'] || 0),
        Posto: record.posto || record.Posto || '',
        'Tipo Combustível': record.combustivel || record['Tipo Combustível'] || '',
        'Parcial?': !!record.parcial
      };
      db.records[user].push(newRec);
      saveData(db);
      return res.json({ success: true, id });
    }

    case 'updateRecord': {
      const record = payload.record || {};
      const id = record.id || record.ID;
      if (!id) return res.json({ success: false, error: 'id required' });
      ensureUser(user);
      const idx = db.records[user].findIndex(r => String(r.ID) === String(id));
      if (idx === -1) return res.json({ success: false, error: 'record not found' });
      // update fields
      const now = new Date(record.data || record.Data || db.records[user][idx].Data).toISOString();
      db.records[user][idx] = Object.assign(db.records[user][idx], {
        Data: now,
        Valor: Number(record.valor || record.Valor || db.records[user][idx].Valor || 0),
        Litros: Number(record.litros || record.Litros || db.records[user][idx].Litros || 0),
        KM_Total: Number(record.kmTotal || record.KM_Total || db.records[user][idx].KM_Total || 0),
        Posto: record.posto || record.Posto || db.records[user][idx].Posto || '',
        'Tipo Combustível': record.combustivel || record['Tipo Combustível'] || db.records[user][idx]['Tipo Combustível'] || '',
        'Parcial?': !!record.parcial
      });
      saveData(db);
      return res.json({ success: true });
    }

    case 'deleteRecord': {
      const id = payload.id;
      if (!id) return res.json({ success: false, error: 'id required' });
      ensureUser(user);
      db.records[user] = db.records[user].filter(r => String(r.ID) !== String(id));
      saveData(db);
      return res.json({ success: true });
    }

    default:
      return res.status(400).json({ success: false, error: 'unknown action' });
  }
});

app.listen(PORT, () => console.log(`Mock server running at http://localhost:${PORT}/exec`));
