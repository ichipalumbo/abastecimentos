function getCacheKey(user, type) {
  return `${CACHE_PREFIX}_${user}_${type}`;
}

function getCachedData(user, type) {
  try {
    const raw = localStorage.getItem(getCacheKey(user, type));
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function setCachedData(user, type, data) {
  try {
    localStorage.setItem(getCacheKey(user, type), JSON.stringify({
      ts: Date.now(),
      data
    }));
  } catch (err) {
    // sem cache se localStorage falhar
  }
}

function isCacheFresh(cache) {
  return cache && cache.ts && (Date.now() - cache.ts) < CACHE_TTL_MS;
}
