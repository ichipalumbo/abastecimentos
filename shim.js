/* ══════════════════════════════════════════════════════════
   SHIM — emula google.script.run usando fetch para a API
   (GitHub Pages → Apps Script)
══════════════════════════════════════════════════════════ */

// 🔧 TROQUE pela SUA URL /exec real:
const API_URL   = 'https://script.google.com/macros/s/AKfycbyaw7Hltfk4nYdXjvUnaeYtpCpgf1MlKUD3PrxNs3vT1IJEY33iJ2GJZDwLKKtGoDQF/exec';
// 🔑 Mesmo token do Code.gs:
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
          .then(r => r.json())
          .then(data => { if (onSuccess) onSuccess(data); })
          .catch(err => { if (onFailure) onFailure(err); });
      };
    });
    return runner;
  }
  return makeRunner(null, null);
})();
