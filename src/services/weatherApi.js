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