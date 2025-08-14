const BASE_URL = 'https://api.jikan.moe/v4';
const DEFAULT_TTL_MS = 1000 * 60; 

/**
 * Custom error class for Jikan API errors.
 */
class JikanError extends Error {
  constructor(message, status, url) {
    super(message);
    this.name = 'JikanError';
    this.status = status;
    this.url = url;
  }
}

const cache = new Map();

/**
 * Build a query string from an object (skips undefined / null)
 * @param {*} params
 * @returns a normalized query string
 */
function buildQuery(params = {}) {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return q ? `?${q}` : '';
}

/**
 * Core request wrapper with caching, error handling, and abort support
 * @param {string} path - API path (without base)
 * @param {object} params - Query params
 * @param {object} options - { signal, ttl }
 */
async function request(path, params = {}, { signal, ttl = DEFAULT_TTL_MS } = {}) {
  const url = `${BASE_URL}${path}${buildQuery(params)}`;

  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const res = await fetch(url, { signal });
  if (!res.ok) {
    let detail;
    try {
      const errJson = await res.json();
      detail = errJson?.message || JSON.stringify(errJson);
    } catch {
      detail = res.statusText;
    }
    throw new JikanError(`Jikan request failed: ${detail}`, res.status, url);
  }

  const json = await res.json();

  cache.set(url, { expires: Date.now() + ttl, data: json });
  return json;
}

/**
 * Normalize raw anime item to a minimal shape used by UI.
 * @param {*} raw
 * @returns normalized anime object
 */
function normalizeAnime(raw) {
  return {
    id: raw.mal_id,
    title: raw.title || raw.title_english || raw.title_japanese,
    image: raw.images?.webp?.large_image_url || raw.images?.jpg?.image_url,
    banner: raw.images?.webp?.large_image_url || raw.images?.jpg?.large_image_url, 
    score: raw.score,
    rank: raw.rank,
    episodes: raw.episodes,
    url: raw.url
  };
}

/**
 * Normalize raw info anime item to a minimal shape used by UI.
 * @param {*} raw
 * @returns normalized anime info object
 */
function normalizeAnimeInfo(raw) {
  return {
    id: raw.mal_id,
    title: raw.title || raw.title_english || raw.title_japanese,
    image: raw.images?.webp?.large_image_url || raw.images?.jpg?.image_url,
    score: raw.score,
    rank: raw.rank,
    episodes: raw.episodes,
    url: raw.url,
    synopsis: raw.synopsis,
    genres: raw.genres,
    title_japanese: raw.title_japanese
  };
}

/**
 * Normalize raw info anime genre item
 * @param {*} raw 
 * @returns normalized anime genres as categories object
 */
function normalizeAnimeCategories(raw) {
  return {
    id: raw.mal_id,
    name: raw.name
  }
}

/**
 * Fetch top anime list.
 * @param {object} opts { limit=25, page=1, signal, ttl }
 * @returns {Promise<Array>}
 */
export async function getTopAnimes({ limit = 25, page = 1, signal, ttl } = {}) {
  try {
    const json = await request('/top/anime', { limit, page }, { signal, ttl });
    const items = Array.isArray(json?.data) ? json.data : [];
    return items.map(normalizeAnime);
  } catch (err) {
    if (err.name === 'AbortError') {
      return [];
    }
    console.error('[getTopAnimes] Error:', err);
    throw err;
  }
}

/**
 * Fetch newest anime list.
 * @param {object} opts { limit=25, page=1, signal, ttl }
 * @returns {Promise<Array>}
 */
export async function getNewestAnimes({ limit = 25, page = 1, signal, ttl } = {}) {
  try {
    const json = await request('/seasons/upcoming', { limit, page }, { signal, ttl });
    const items = Array.isArray(json?.data) ? json.data : [];
    // console.log(items)
    return items.map(normalizeAnime);
  } catch (err) {
    if (err.name === 'AbortError') {
      return [];
    }
    console.error('[getNewestAnimes] Error:', err);
    throw err;
  }
}

/**
 * Fetch anime by id.
 * @param {object} opts { id, signal, ttl }
 * @returns {Promise<Array>}
 */
export async function getAnimeById({ id, signal, ttl } = {}) {
  try {
    const json = await request(`/anime/${id}`, {}, { signal, ttl });
    const item = json?.data ? json.data : [];
    return [normalizeAnimeInfo(item)]; 
  } catch (err) {
    if (err.name === 'AbortError') {
      return [];
    }
    console.error('[getAnimeById] Error:', err);
    throw err;
  }
}

/**
 * 
 * @param {*} opts { signal, ttl }
 * @returns {Promise<Array>}
 */
export async function getAnimeCategories({signal, ttl} = {}) {
  try {
    const json = await request(`/genres/anime`, {}, { signal, ttl });
    const items = Array.isArray(json?.data) ? json.data : [];
    const EXCLUDED_GENRES = [
      "Ecchi", "Erotica", "Hentai", "Adult Cast",
      "CGDCT", "Crossdressing", "Gore", "Harem", "High Stakes Game",
      "Magical Sex Shift", "Otaku Culture", "Reverse Harem",
      "Love Status Quo", "Kids"
    ];

    // Filter out unwanted genres
    const filteredItems = items.filter(item => !EXCLUDED_GENRES.includes(item.name));

    return filteredItems.map(normalizeAnimeCategories);
  } catch(err) {
    if (err.name === 'AbortError') {
      return [];
    }
    console.error('[getAnimeCategories] Error:', err);
    throw err;
  }
}

/**
 * Fetch top anime list.
 * @param {object} opts { limit=25, page=1, signal, ttl }
 * @returns {Promise<Array>}
 */
export async function getAnimesByCategories({ categoryId, limit = 25, page = 1, signal, ttl } = {}) {
  try {
    const json = await request(`/anime?${categoryId}`, { limit, page }, { signal, ttl });
    console.log(json);    

    const items = Array.isArray(json?.data)
      ? json.data.flat()
      : [];

    console.log(items);
    console.log(items.map(normalizeAnime));
    return items.map(normalizeAnime);
  } catch (err) {
    if (err.name === 'AbortError') {
      return [];
    }
    console.error('[getTopAnimes] Error:', err);
    throw err;
  }
}

export function clearJikanCache() {
  cache.clear();
}