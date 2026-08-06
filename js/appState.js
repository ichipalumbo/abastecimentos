/* [STATE] ════════════════════════════════════ */
let currentUser        = null;     // 'Luccas' ou 'Josy'
let records            = [];
let postos             = [];       // [{id, nome}]
let currentTab         = 'home';
let analyticsBuilt     = false;
let editMode           = false;
let selectedPostoNome  = '';
let pendingDeleteId    = null;
let pendingDeletePostoId = null;
let editingPostoId     = null;
let pendingLoads = 0;
let sortOrder          = 'desc';   // 'desc' = recente primeiro, 'asc' = antigo primeiro
let lastRefreshTs      = null;
const CACHE_PREFIX     = 'fuelapp_cache';
const CACHE_TTL_MS     = 5 * 60 * 1000; // 5 minutos

/* [/STATE] */
