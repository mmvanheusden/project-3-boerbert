import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes moveClouds {
    from {
      transform: translateX(-300px);
    }
    to {
      transform: translateX(100vw);
    }
  }
  `;
  document.head.appendChild(style);
}

function Weerbericht() {
  const [weerData, setWeerData] = useState<any>(null);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    const apiKey = "a3e97ae2a9d868bfd778f5fedf2f45c1";
    const stad = "Utrecht";

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
  const wind = Math.round(weerData.wind.speed * 3.6);
  const luchtvochtigheid = weerData.main.humidity;
  const weerType = weerData.weather[0].main.toLowerCase();

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gray-300">
      {weerType === "clouds" && (
        <>
          <div className="absolute top-20 left-0 text-[20rem] opacity-70" style={{animation: "moveClouds 6s linear infinite"}}>☁️</div>
          <div className="absolute top-40 left-0 text-[12rem] opacity-50" style={{animation: "moveClouds 9s linear infinite"}}>☁️</div>
          <div className="absolute top-64 left-0 text-[30rem] opacity-60" style={{animation: "moveClouds 15s linear infinite"}}>☁️</div>
          <div className="absolute top-20 left-0 text-[25rem] opacity-70" style={{animation: "moveClouds 20s linear infinite" }}>☁️</div>
          <div className="absolute top-40 left-0 text-[40rem] opacity-50" style={{animation: "moveClouds 30s linear infinite" }}>☁️</div>
          <div className="absolute top-64 left-0 text-[48rem] opacity-60" style={{animation: "moveClouds 40s linear infinite"}}>☁️</div>
        </>
      )}
      <div className="rounded-2xl bg-white p-10 shadow-xl text-center">
        <h1 className="mb-4 text-5xl font-bold text-blue-700">
          Weerbericht
        </h1>

        <p className="mb-6 text-2xl text-gray-600">
          {weerData.name}
        </p>

        <div className="mb-6 text-7xl">☁️</div>

        <div className="space-y-3 text-2xl">
          <p> {temperatuur}°C</p>
          <p className="flex items-center justify-center"><Icon icon="carbon:temperature-feels-like"  className="w-8 h-8 text-orange-400 drop-shadow-md"></Icon> {gevoel}°C</p>
          <p className="flex items-center justify-center"><Icon icon="meteocons:wind-offshore-fill" className="w-8 h-8 "></Icon> {wind} km/u</p>
          <p>💧 {luchtvochtigheid}%</p>
        </div>
      </div>
    </div>
  );
}

export default Weerbericht;
