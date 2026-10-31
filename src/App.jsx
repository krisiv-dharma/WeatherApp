import { useState } from "react";
import { getCoordinates, getCurrentWeather, getForecast } from "./services/weatherApi";
import { getWeatherInfo } from "./utils/weatherCodes";
import ForecastCard from "./components/ForecastCard";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const location = await getCoordinates(city);

      // Fetch current weather and forecast at the same time
      const [current, days] = await Promise.all([
        getCurrentWeather(location.latitude, location.longitude),
        getForecast(location.latitude, location.longitude),
      ]);

      setPlace(location);
      setWeather(current);
      setForecast(days);
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

      {forecast.length > 0 && (
        <div>
          <h3>5-Day Forecast</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {forecast.map((day) => (
              <ForecastCard key={day.date} day={day} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;