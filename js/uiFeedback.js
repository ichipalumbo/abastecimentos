function showToast(msg, type) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.className = `toast show ${type||''}`;
  setTimeout(() => el.className = 'toast', 3200);
}
/* [LOADER-OVERLAY] — controla o overlay de loading */
function showLoader(texto) {
  const el = document.getElementById('loader-overlay');
  if (!el) return;
  if (texto) el.querySelector('.loader-text').textContent = texto;
  el.classList.add('active');
}

function hideLoader() {
  const el = document.getElementById('loader-overlay');
  if (el) el.classList.remove('active');
}
/* [/LOADER-OVERLAY] */

/* define o texto do loader SEM ligar o overlay */
function setLoaderText(texto) {
  const el = document.getElementById('loader-overlay');
  if (el && texto) el.querySelector('.loader-text').textContent = texto;
}
