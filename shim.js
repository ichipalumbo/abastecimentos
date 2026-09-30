/* ══════════════════════════════════════════════════════════
   SHIM — emula google.script.run usando fetch para a API
   (GitHub Pages → Apps Script)
══════════════════════════════════════════════════════════ */

// O servidor local serve frontend e API na mesma origem. file:// e ?mock=1
// falham no mock indisponível, mas nunca encaminham escritas para produção.
const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyaw7Hltfk4nYdXjvUnaeYtpCpgf1MlKUD3PrxNs3vT1IJEY33iJ2GJZDwLKKtGoDQF/exec';
const localHosts = ['localhost', '127.0.0.1', '[::1]'];
const urlParams = new URLSearchParams(window.location.search);
const USE_LOCAL_MOCK = urlParams.get('mock') === '1' || window.location.protocol === 'file:' ||
  localHosts.includes(window.location.hostname);
const mockScenario = urlParams.get('scenario') || 'default';
const mockOrigin = localHosts.includes(window.location.hostname) && window.location.port === '5000'
  ? window.location.origin : 'http://127.0.0.1:5000';
const API_URL = USE_LOCAL_MOCK
  ? `${mockOrigin}/exec?scenario=${encodeURIComponent(mockScenario)}`
  : APPSCRIPT_URL;
if (USE_LOCAL_MOCK) document.documentElement.classList.add('mock-mode');
if (USE_LOCAL_MOCK && urlParams.get('reset') === '1') {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('fuelapp_cache_')) localStorage.removeItem(key);
  }
}
// Mesmo token do Code.gs; o mock local ignora credenciais.
const API_TOKEN = 'abst_7gK9pQ2xW5nR8tL4vY6mZ3jH';

// Mapeia cada função → action + nomes dos argumentos (na ordem)
const _API_MAP = {
  getRecords:   { action:'getRecords',   args:['user'] },
  getPostos:    { action:'getPostos',    args:['user'] },
  addRecord:    { action:'addRecord',    args:['user','record'] },
  updateRecord: { action:'updateRecord', args:['user','record'] },
  deleteRecord: { action:'deleteRecord', args:['user','id'] },
  addPosto:     { action:'addPosto',     args:['user','nome'] },
  updatePosto:  { action:'updatePosto',  args:['user','id','nome'] },
  deletePosto:  { action:'deletePosto',  args:['user','id'] }
};

window.google = window.google || {};
google.script = google.script || {};
google.script.run = (function () {
  function makeRunner(onSuccess, onFailure) {
    const runner = {
      withSuccessHandler(fn) { return makeRunner(fn, onFailure); },
      withFailureHandler(fn) { return makeRunner(onSuccess, fn); }
    };
    Object.keys(_API_MAP).forEach(name => {
      runner[name] = function (...callArgs) {
        const cfg     = _API_MAP[name];
        const payload = { token: API_TOKEN, action: cfg.action };
        cfg.args.forEach((argName, i) => { payload[argName] = callArgs[i]; });

        fetch(API_URL, {
          method: 'POST',
          // text/plain evita o "preflight" de CORS no Apps Script
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        })
          .then(async r => {
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
            return data;
          })
          .then(data => { if (onSuccess) onSuccess(data); })
          .catch(err => {
            if (onFailure) onFailure(USE_LOCAL_MOCK && err instanceof TypeError
              ? new Error('Mock local indisponível. Inicie node dev\\mock\\server.js.')
              : err);
          });
      };
    });
    return runner;
  }
  return makeRunner(null, null);
})();
