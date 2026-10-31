import { useState } from "react";
import { getCoordinates, getCurrentWeather } from "./services/weatherApi";
import { getWeatherInfo } from "./utils/weatherCodes";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const location = await getCoordinates(city);
      const current = await getCurrentWeather(location.latitude, location.longitude);
      setPlace(location);
      setWeather(current);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Weather App</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter a city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {weather && place && (
  <div>
    <h2>{place.name}, {place.country}</h2>
    <p style={{ fontSize: "3rem", margin: 0 }}>
      {getWeatherInfo(weather.weather_code).icon}
    </p>
    <p>{getWeatherInfo(weather.weather_code).label}</p>
    <p>Temperature: {weather.temperature_2m}°C</p>
    <p>Humidity: {weather.relative_humidity_2m}%</p>
    <p>Wind: {weather.wind_speed_10m} km/h</p>
  </div>
)}
    </div>
  );
}

export default App;