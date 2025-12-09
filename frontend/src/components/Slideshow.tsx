import { useContext, useState, useEffect, useRef } from "react";
import Context from "./booking/Context.tsx";
import { t } from "i18next";
import i18n from "../i18n/config.ts";
import { Icon } from "@iconify/react";
import {Header} from "./KleineDingetjes.tsx";
import {CancelButton} from "./booking/BookingFlowManager.tsx";

export function Slideshow() {
  const { next,activities, slideshow } = useContext(Context);
  const [index, setIndex] = useState(0);

  // --- NIEUW: autoplay states / refs ---
  const [playing, setPlaying] = useState(true); // true = automatisch wisselen
  const delay = 4000; // tijd per slide in ms (4000 = 4 seconden)
  const timeoutRef = useRef<number | null>(null);

  const prevSlide = () => setIndex((i) => (i - 1 + slideshow!.length) % slideshow!.length);
  const nextSlide = () => setIndex((i) => (i + 1) % slideshow!.length);

  // --- NIEUW: useEffect die de autoplay regelt met setTimeout ---
  useEffect(() => {
    // clear bestaande timeout als die er is
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (playing) {
      // Stel een nieuwe timeout in; na 'delay' ms naar volgende slide
      timeoutRef.current = window.setTimeout(() => {
        setIndex((i) => (i + 1) % slideshow!.length);
      }, delay);
    }

    // cleanup als component unmount of dependencies veranderen
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [index, playing, slideshow!.length]); // herstart timer als index verandert (bv. door klik) of playing verandert

  return (
    <>
      <div className="flex flex-col h-full">
        <span className="font-bold text-center text-7xl mb-2 italic bg-green-600 text-white rounded-xl p-4">
          {t("Welkom bij Boer Bert's Camping!")}
        </span>
        <div className="flex-1">
          <div
              id="gallery"
              className="relative w-full"
              data-carousel="slide"
              onMouseEnter={() => setPlaying(false)}
              onMouseLeave={() => setPlaying(true)}
          >
            <div className="relative overflow-hidden h-[calc(100vh-20rem)]">
              {/* Slides: alleen actieve slide zichtbaar */}
              {slideshow!.length == 0
                  ?
                  <div className="flex flex-row justify-center items-center select-none bottom-0  text-center text-xl font-semibold border-2 border-black">
                    <Icon icon="mdi:alert" width="48" height="48" color="red"/> De slideshow is leeg.
                  </div>
                  : <>{slideshow!.map((slide, i) => (
                      <div
                          key={i}
                          className={`duration-700 ease-in-out ${i === index ? "block" : "hidden"}`}
                          aria-hidden={i === index ? "false" : "true"}
                      >
                        <img
                            src={`data:image/png;base64, ${slide.image}`}
                            alt={slide.alt}
                            className="absolute block max-w-full h-screen -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-cover"
                        />
                      </div>
                  ))}</>
              }
            </div>
        </div>
          {/* Slider controls met handlers */}
          <button
              type="button"
              className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              onClick={() => {
                prevSlide();
                // timer reset gebeurt automatisch doordat index verandert en useEffect opnieuw loopt
              }}
              aria-label="Previous"
          >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
                className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
          </button>

          <button
              type="button"
              className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              onClick={() => {
                nextSlide();
                // timer reset gebeurt automatisch doordat index verandert en useEffect opnieuw loopt
              }}
              aria-label="Next"
          >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
                className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
            </svg>
            <span className="sr-only">Next</span>
          </span>
          </button>
        </div>
        <div className="h-[20%] flex items-center justify-between px-6 gap-3">
          <div className="flex items-center gap-3">
            <button
                className="text-5xl hover:underline hover:cursor-pointer rounded py-3 px-5 border-black hover:bg-green-600 focus:outline-none"
                onClick={() => i18n.changeLanguage("nl")}
            >
              <Icon icon="flag:nl-4x3" width="60" height="h-full" />
            </button>

            <button
                className="text-5xl hover:underline hover:cursor-pointer rounded py-3 px-5 border-black hover:bg-green-600 focus:outline-none"
                onClick={() => i18n.changeLanguage("de")}
            >
              <Icon icon="flag:de-4x3" width="60" height="h-full" />
            </button>

            <button
                className="text 5xl hover:underline hover:cursor-pointer rounded py-3 px-5 border-black hover:bg-green-600 focus:outline-none"
                onClick={() => i18n.changeLanguage("en")}
            >
              <Icon icon="flagpack:gb-ukm" width="60" height="h-full" />
            </button>
          </div>

          <button
              className={`text-5xl hover:underline hover:cursor-pointer py-3 px-10 border-black focus:outline-none text-white rounded-xl ${(activities != null && activities.length == 0) ? "disabled bg-red-500 pointer-events-none" : "bg-green-600 hover:bg-green-700"}`}
              onClick={next}
          >
            {(activities != null && activities.length == 0) ? <><Icon icon="mdi:alert" width="24" height="24" />Momenteel geen activiteiten beschikbaar!</> : t("book")}
          </button>
        </div>
      </div>



    </>
  );
}