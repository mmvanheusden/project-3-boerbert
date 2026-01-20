import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

/* === Animaties === */
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes moveClouds {
      from { transform: translateX(-300px); }
      to { transform: translateX(100vw); }
    }
    @keyframes rain {
      from { transform: translateY(-100px); }
      to { transform: translateY(100vh); }
    }
    @keyframes snow {
      from { transform: translateY(-100px); }
      to { transform: translateY(100vh); }
    }
  `;
  document.head.appendChild(style);
}

function Weerbericht() {
  const [weer, setWeer] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [laden, setLaden] = useState(true);

  const apiKey = "a3e97ae2a9d868bfd778f5fedf2f45c1";
  const stad = "Utrecht";

  useEffect(() => {
    Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${stad}&units=metric&appid=${apiKey}`).then(r => r.json()),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${stad}&units=metric&appid=${apiKey}`).then(r => r.json()),
    ]).then(([weerData, forecastData]) => {
      setWeer(weerData);

      const dagelijks = forecastData.list.filter((item: any) =>
        item.dt_txt.includes("12:00:00")
      );

      setForecast(dagelijks.slice(1, 6));
      setLaden(false);
    });
  }, []);

  if (laden) {
    return (
      <div className="flex h-full items-center justify-center text-3xl">
        🌤️
      </div>
    );
  }

  /* === Basisdata === */
  const nu = Math.floor(Date.now() / 1000);
  const isDag = nu > weer.sys.sunrise && nu < weer.sys.sunset;

  const temperatuur = Math.round(weer.main.temp);
  const gevoel = Math.round(weer.main.feels_like);
  const wind = Math.round(weer.wind.speed * 3.6);

  const weerType = weer.weather[0].main.toLowerCase();

  /* === Weerstatussen === */
  const isHelder = weerType === "clear";
  const isBewolkt = weerType === "clouds";
  const isRegen = weerType === "rain" || weerType === "drizzle";
  const isSneeuw = weerType === "snow";
  const isMist = ["mist", "fog", "haze"].includes(weerType);

  /* === Emoji mapping === */
  const emoji: Record<string, string> = {
    clear: isDag ? "☀️" : "🌙",
    clouds: "☁️",
    rain: "🌧️",
    drizzle: "🌦️",
    thunderstorm: "⛈️",
    snow: "❄️",
    mist: "🌫️",
  };

  /* === Achtergrond === */
  const getBackground = () => {
    if (isHelder) return "bg-gradient-to-b from-sky-400 to-blue-200";
    if (isBewolkt) return "bg-gradient-to-b from-gray-400 to-gray-200";
    if (isRegen) return "bg-gradient-to-b from-slate-700 to-slate-500";
    if (isSneeuw) return "bg-gradient-to-b from-slate-200 to-white";
    if (isMist) return "bg-gradient-to-b from-gray-300 to-gray-100";
    return "bg-gray-300";
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${getBackground()} p-10 text-white`}>

      {/* Wolken */}
      {isBewolkt && (
        <>
          <div className="absolute top-10 left-0 text-[18rem] opacity-40" style={{ animation: "moveClouds 40s linear infinite" }}>☁️</div>
          <div className="absolute top-40 left-0 text-[28rem] opacity-30" style={{ animation: "moveClouds 55s linear infinite" }}>☁️</div>
          <div className="absolute top-60 left-0 text-[58rem] opacity-50" style={{ animation: "moveClouds 45s linear infinite" }}>☁️</div>
          <div className="absolute top-20 left-0 text-[38rem] opacity-30" style={{ animation: "moveClouds 40s linear infinite" }}>☁️</div>
        </>
      )}

      {/* Zon / maan */}
      {isHelder && (
        <div className="absolute top-16 text-[10rem]">
          {isDag ? "☀️" : "🌙"}
        </div>
      )}

      {/* Regen */}
      {isRegen && (
        <div
          className="absolute inset-0 text-blue-200 opacity-40 text-2xl" style={{ animation: "rain 1s linear infinite" }}>💧💧💧💧💧💧💧💧</div>
      )}

      {/* Sneeuw */}
      {isSneeuw && (
        <div
          className="absolute inset-0 text-white opacity-80 text-2xl" style={{ animation: "snow 4s linear infinite" }}>❄️ ❄️ ❄️ ❄️ ❄️ ❄️</div>
      )}

      {/* === Huidig weer === */}
      <div className="mx-auto max-w-xl rounded-3xl bg-white/20 p-8 text-center backdrop-blur-lg shadow-xl">
        <div className="text-8xl my-6">
          {emoji[weerType] || "🌤️"}
        </div>

        <p className="text-5xl font-bold mb-4">
          {temperatuur}°
        </p>

        <div className="space-y-2 text-lg">
          <p className="flex justify-center gap-4">
            <Icon icon="carbon:temperature-feels-like" />
            {gevoel}°
          </p>
          <p className="flex justify-center gap-4">
            <Icon icon="meteocons:wind-offshore-fill" />
            {wind} km/u
          </p>
        </div>
      </div>

      {/* === Forecast === */}
      <div className="mx-auto mt-10 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {forecast.map((dag) => (
            <div
              key={dag.dt}
              className="rounded-2xl bg-white/20 p-4 text-center backdrop-blur shadow"
            >
              <p className="font-semibold">
                {new Date(dag.dt * 1000).toLocaleDateString()}
              </p>

              <div className="text-4xl my-2">
                {emoji[dag.weather[0].main.toLowerCase()] || "🌤️"}
              </div>

              <p className="font-bold">
                {Math.round(dag.main.temp)}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Weerbericht;
