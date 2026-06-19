'use strict';

const axios = require('axios');

const cache = new Map();

async function getCoordsByCity(city) {
  if (!city) return null;
  if (cache.has(city)) return cache.get(city);

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: city, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'EsportHub/1.0' },
    });

    if (!response.data.length) return null;

    const { lat, lon } = response.data[0];
    const coords = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    cache.set(city, coords);
    return coords;
  } catch {
    return null;
  }
}

module.exports = { getCoordsByCity };
