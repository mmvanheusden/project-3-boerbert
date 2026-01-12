import { useEffect, useState } from "react";

function Weerbericht() {
  const [weerData, setWeerData] = useState<any>(null);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    const apiKey = "a3e97ae2a9d868bfd778f5fedf2f45c1";
    const stad = "Amsterdam";

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${stad}&units=metric&appid=${apiKey}&lang=nl`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeerData(data);
        setLaden(false);
      })
      .catch(() => setLaden(false));
  }, []);

  if (laden) {
    return (
      <div className="flex h-full items-center justify-center text-3xl">
        Weerbericht laden...
      </div>
    );
  }

  const temperatuur = Math.round(weerData.main.temp);
  const gevoel = Math.round(weerData.main.feels_like);
  const beschrijving = weerData.weather[0].description;
  const wind = Math.round(weerData.wind.speed * 3.6);
  const luchtvochtigheid = weerData.main.humidity;

  return (
    <div className="flex h-full w-full items-center justify-center bg-blue-200">
      <div className="rounded-2xl bg-white p-10 shadow-xl text-center">
        <h1 className="mb-4 text-5xl font-bold text-blue-700">
          Weerbericht
        </h1>

        <p className="mb-6 text-2xl text-gray-600">
          {weerData.name}
        </p>

        <div className="mb-6 text-7xl">☁️</div>

        <div className="space-y-3 text-2xl">
          <p>🌡️ {temperatuur}°C</p>
          <p>🤔 Gevoel: {gevoel}°C</p>
          <p>☀️ {beschrijving}</p>
          <p>💨 Wind: {wind} km/u</p>
          <p>💧 {luchtvochtigheid}%</p>
        </div>
      </div>
    </div>
  );
}

export default Weerbericht;
