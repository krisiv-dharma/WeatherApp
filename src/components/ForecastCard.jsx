import { getWeatherInfo } from "../utils/weatherCodes";

function ForecastCard({ day }) {
  const { icon, label } = getWeatherInfo(day.weatherCode);

  // Adding T00:00:00 makes the date parse as local time, avoiding off-by-one-day bugs
  const dateText = new Date(day.date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "12px", minWidth: "110px" }}>
      <strong>{dateText}</strong>
      <p style={{ fontSize: "2rem", margin: "8px 0" }}>{icon}</p>
      <p style={{ margin: 0 }}>{label}</p>
      <p style={{ margin: "8px 0 0" }}>
        {Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°
      </p>
      <p style={{ margin: 0 }}>💧 {day.rainChance}%</p>
    </div>
  );
}

export default ForecastCard;