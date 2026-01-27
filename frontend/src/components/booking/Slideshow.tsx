import { useContext, useEffect, useRef, useState } from "react";
import Context from "./Context.tsx";
import { t } from "i18next";
import i18n from "../../i18n/config.ts";
import { Icon } from "@iconify/react";
import useFirstRender from "../../App.tsx";
import Weerbericht from "./Weerbericht.tsx";

export function Slideshow() {
  const { next,activities, slideshow, refetchData } = useContext(Context);
  const [index, setIndex] = useState(0);

  // TOTAAL aantal slides (foto's + weerbericht)
  const totalSlides = (slideshow?.length || 0) + 1;

  useFirstRender(() => {
    // Elke x dat we naar deze stap gaan, moeten we even de data uit de backend op de achtergrond opnieuw ophalen. Zo is alles up-to-date.
    refetchData();
  })

  // --- NIEUW: autoplay states / refs ---
  const [playing, setPlaying] = useState(true); // true = automatisch wisselen
  const delay = 7500; // tijd per slide in ms (1000 = 10 seconden)
  const timeoutRef = useRef<number | null>(null);

  const prevSlide = () => setIndex((i) => (i - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setIndex((i) => (i + 1) % totalSlides);

  // --- NIEUW: useEffect die de autoplay regelt met setTimeout ---
  useEffect(() => {
    // clear bestaande timeout als die er is
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (playing) {
      // Stel een nieuwe timeout in; na 'delay' ms naar volgende slide
      timeoutRef.current = window.setTimeout(() => {
        setIndex((i) => (i + 1) % totalSlides);
      }, delay);
    }

    // cleanup als component unmount of dependencies veranderen
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [index, playing, totalSlides]); // herstart timer als index verandert (bv. door klik) of playing verandert

  return (<>
        <div className="flex flex-col h-full">
        <span className="font-bold text-center text-8xl mb-2 italic bg-green-600 text-white rounded-xl p-4 inline-flex items-center justify-center gap-4">
          <Icon icon="material-symbols:camping-rounded" width="96" height="96" /> {t("welcome")}
        </span>
          <div
              id="gallery"
              className="relative w-full max-h-full overflow-hidden rounded-2xl"
              onMouseEnter={() => setPlaying(false)}
              onMouseLeave={() => setPlaying(true)}
          >
            <div className="relative overflow-hidden h-[calc(100vh-20rem)]">
                        {/* FOTO SLIDES */}
          {slideshow?.map((slide, i) => (
            <div
              key={i}
              className={`duration-700 ease-in-out ${
                i === index ? "block" : "hidden"
              }`}
            >
              <img
                src={`data:image/png;base64, ${slide.image}`}
                alt={slide.alt}
                className="absolute block max-w-full h-screen -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-cover"
              />
            </div>
          ))}

          {/* WEERBERICHT SLIDE */}
          <div
            className={`duration-700 ease-in-out h-full ${
              index === slideshow!.length ? "block" : "hidden"
            }`}
          >
            <Weerbericht />
          </div>
        </div>

            {/* CONTROLS */}
            <button
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer active:scale-150 transition"
                onClick={prevSlide}
            >
              <Icon icon="icon-park-twotone:left-c" width="64" height="64" color="#28282B"/>
            </button>

            <button
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer active:scale-150 transition"
                onClick={nextSlide}
            >
              <Icon icon="icon-park-twotone:right-c" width="64" height="64" color="#28282B"/>
            </button>
          </div>

          {/*Vlaggen en knoppenrij!!!!!1!!1!! omg omg*/}
          <div className="flex items-center justify-between">
            {/*Deze div wordt aan het begin verspreid (er staat 3 vlaggetjes in)*/}
            <div className="inline-flex gap-5 justify-evenly translate-y-2">
              <button
                  className={`text-8xl my-auto cursor-pointer rounded-full ring-green-600 hover:ring-7 ${i18n.language as "en" | "de" | "nl" == "nl" && "ring-7"}`}
                  onClick={() => i18n.changeLanguage("nl")}
              >
                <Icon icon="circle-flags:lang-nl" />
              </button>
              <button
                  className={`text-8xl my-auto cursor-pointer rounded-full ring-green-600 hover:ring-7 ${i18n.language as "en" | "de" | "nl" == "de" && "ring-7"}`}
                  onClick={() => i18n.changeLanguage("de")}
              >
                <Icon icon="circle-flags:lang-de" />
              </button>
              <button
                  className={`text-8xl my-auto cursor-pointer rounded-full ring-green-600 hover:ring-7 ${i18n.language as "en" | "de" | "nl" == "en" && "ring-7"}`}
                  onClick={() => i18n.changeLanguage("en")}
              >
                <Icon icon="circle-flags:lang-en" />
              </button>
            </div>

            {/*Deze div wordt aan het einde verspreid (er staat 1 knopje in)*/}
            <div>
              <button
                  className={`h-full items-center inline-flex text-7xl hover:cursor-pointer translate-y-2 py-6 px-5 border-black focus:outline-none text-white rounded-xl ${(activities != null && activities.length == 0) ? "disabled bg-red-500 pointer-events-none" : "bg-green-600 hover:bg-green-700"}`}
                  onClick={next}
              >
                {(activities != null && activities.length == 0) ? <><Icon icon="mdi:alert"/>{t("no_activities_available")}</> : t("proceed")}
              </button>
            </div>
          </div>
        </div>
      </>
  );
}