import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

function Weerbericht() {
  const [weer, setWeer] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [laden, setLaden] = useState(true);

  const apiKey = "a3e97ae2a9d868bfd778f5fedf2f45c1";
  const stad = "Utrecht";

  useEffect(() => {
    Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${stad}&units=metric&appid=${apiKey}`
      ).then((res) => res.json()),
      fetch(  
        `https://api.openweathermap.org/data/2.5/forecast?q=${stad}&units=metric&appid=${apiKey}`
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
      <div className="flex h-full items-center justify-center text-3xl">
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
    <div className={`min-h-screen bg-linear-to-br ${achtergrond} p-10 text-white`}>
      <div className="mx-auto max-w-xl rounded-3xl bg-white/20 p-8 text-center backdrop-blur-lg shadow-xl">
        <div className="text-8xl my-6">
          {emoji[weerType] || "🌤️"}
        </div>

        <p className="text-5xl font-bold mb-4">
          {temperatuur}°
        </p>

        <div className="space-y-2 text-lg">
          <p className="flex justify-center gap-2">
            <Icon icon="carbon:temperature-feels-like" />
            {gevoel}°
          </p>
          <p className="flex justify-center gap-2">
            <Icon icon="meteocons:wind-offshore-fill" />
            {wind}
          </p>
        </div>

        <p className="mt-4 text-sm opacity-70">
          {isDag ? "🌞" : "🌙"}
        </p>
      </div>

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

