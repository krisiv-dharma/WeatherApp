// Turn a city name into coordinates
export async function getCoordinates(city) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  );
  if (!res.ok) throw new Error("Could not reach the location service");
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
  }
  const { latitude, longitude, name, country } = data.results[0];
  return { latitude, longitude, name, country };
}

// Get current weather for coordinates
export async function getCurrentWeather(latitude, longitude) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
  );
  if (!res.ok) throw new Error("Could not fetch weather data");
  const data = await res.json();
  return data.current;
}

// Get a 5-day forecast for coordinates
export async function getForecast(latitude, longitude) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max` +
      `&timezone=auto&forecast_days=5`
  );
  if (!res.ok) throw new Error("Could not fetch forecast data");
  const data = await res.json();
  const d = data.daily;

  // Turn parallel arrays into an array of day objects
  return d.time.map((date, i) => ({
    date,
    weatherCode: d.weather_code[i],
    tempMax: d.temperature_2m_max[i],
    tempMin: d.temperature_2m_min[i],
    rainChance: d.precipitation_probability_max[i],
    windMax: d.wind_speed_10m_max[i],
    uvMax: d.uv_index_max[i],
  }));
}