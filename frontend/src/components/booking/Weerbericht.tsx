import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes moveClouds {
    from { transform: translateX(-300px); }
    to { transform: translateX(100vw); }
    }`;

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
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${stad}&units=metric&appid=${apiKey}&lang=nl`
      ).then((res) => res.json()),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${stad}&units=metric&appid=${apiKey}&lang=nl`
      ).then((res) => res.json()),
    ]).then(([weerData, forecastData]) => {
      setWeer(weerData);

      const dagelijks = forecastData.list.filter((item: any) =>
        item.dt_txt.includes("12:00:00")
      );

      setForecast(dagelijks.slice(1, 5));
      setLaden(false);
    });
  }, []);

  if (laden) {
    return (
      <div className="flex h-full items-center justify-center text-4xl">
        🌤️
      </div>
    );
  }

  const nu = Math.floor(Date.now() / 1000);
  const isDag = nu > weer.sys.sunrise && nu < weer.sys.sunset;

  const temperatuur = Math.round(weer.main.temp);
  const gevoel = Math.round(weer.main.feels_like);
  const wind = Math.round(weer.wind.speed * 3.6);

  const weerType = weer.weather[0].main.toLowerCase();

  const beschrijving = weer.weather?.[0]?.description?.toLowerCase() ?? "";
  const isLichtBewolkt = beschrijving.includes("licht");
  const isHalfBewolkt = beschrijving.includes("half");
  const isZwaarBewolkt =
    beschrijving.includes("zwaar") || beschrijving.includes("bewolkt");

  const emoji: Record<string, string> = {
    clear: isDag ? "☀️" : "🌙",
    clouds: "☁️",
    rain: "🌧️",
    drizzle: "🌦️",
    thunderstorm: "⛈️",
    snow: "❄️",
    mist: "🌫️",
  };

  const achtergrond = isDag
    ? "from-sky-400 to-blue-200"
    : "from-slate-900 to-indigo-900";

  return (
    <div
      className={`relative min-h-screen bg-linear-to-br ${achtergrond} p-10 text-white overflow-hidden`}
    >
      {/* Bewegende wolken */}
      {(isLichtBewolkt || isHalfBewolkt || isZwaarBewolkt) && (
        <>
          <div className="absolute top-12 left-0 text-[12rem] opacity-60" style={{ animation: "moveClouds 30s linear infinite" }}>☁️</div>
          <div className="absolute top-32 left-0 text-[40rem] opacity-40" style={{ animation: "moveClouds 32s linear infinite" }}>☁️</div>
          <div className="absolute top-48 left-0 text-[60rem] opacity-40" style={{ animation: "moveClouds 54s linear infinite" }}>☁️</div>
          <div className="absolute top-20 left-0 text-[30rem] opacity-35" style={{ animation: "moveClouds 40s linear infinite" }}>☁️</div>
          <div className="absolute top-40 left-0 text-[50rem] opacity-40" style={{ animation: "moveClouds 38s linear infinite" }}>☁️</div>
          <div className="absolute top-28 left-0 text-[18rem] opacity-45" style={{ animation: "moveClouds 60s linear infinite" }}>☁️</div>
          <div className="absolute top-54 left-0 text-[40rem] opacity-40" style={{ animation: "moveClouds 50s linear infinite" }}>☁️</div>
          <div className="absolute top-10 left-0 text-[20rem] opacity-50" style={{ animation: "moveClouds 45s linear infinite" }}>☁️</div>
        </>
      )}

      <div className="mx-auto max-w-xl rounded-3xl bg-white/20 p-8 text-center backdrop-blur-lg shadow-xl relative z-10">
        <div className="text-9xl my-6">
          {emoji[weerType] || "🌤️"}
        </div>

        <p className="text-6xl font-bold mb-6">
          {temperatuur}°
        </p>

        {/* 🔽 ALLEEN DIT BLOK GROTER GEMAAKT */}
        <div className="space-y-4 text-3xl">
          <p className="flex justify-center gap-4">
            <Icon icon="carbon:temperature-feels-like" />
            {gevoel}°
          </p>
          <p className="flex justify-center gap-4">
            <Icon icon="meteocons:wind-offshore-fill" />
            {wind}
          </p>
        </div>
      </div>

      {/* 🔽 EXTRA DAGEN NU EXACT IN HET MIDDEN */}
      <div className="mx-auto mt-12 max-w-5xl relative z-10 flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {forecast.map((dag) => (
            <div
              key={dag.dt}
              className="rounded-2xl bg-white/20 p-5 text-center backdrop-blur shadow"
            >
              <p className="font-semibold text-lg">
                {new Date(dag.dt * 1000).toLocaleDateString()}
              </p>

              <div className="text-5xl my-3">
                {emoji[dag.weather[0].main.toLowerCase()] || "🌤️"}
              </div>

              <p className="font-bold text-2xl">
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

