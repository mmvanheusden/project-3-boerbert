import { useContext, useState, useEffect, useRef } from "react";
import Context from "./booking/Context.tsx";
import { t } from "i18next";
import i18n from "../i18n/config.ts";
import { Icon } from "@iconify/react";

export function Slideshow() {
  const { next } = useContext(Context);

	const images = [
		"https://images.theconversation.com/files/493905/original/file-20221107-16-ft18fk.jpeg?ixlib=rb-4.1.0&q=45&auto=format&w=1000&fit=clip",
		"https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg",
		"https://wallpapers.com/images/thumbnail/hog-rider-clash-character-uh80006aoilk44dh.webp"
	];

	const [index, setIndex] = useState(0);

  // --- NIEUW: autoplay states / refs ---
  const [playing, setPlaying] = useState(true); // true = automatisch wisselen
  const delay = 4000; // tijd per slide in ms (4000 = 4 seconden)
  const timeoutRef = useRef<number | null>(null);

  const prevSlide = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const nextSlide = () => setIndex((i) => (i + 1) % images.length);

  // --- NIEUW: useEffect die de autoplay regelt met setTimeout ---
  useEffect(() => {
    // clear bestaande timeout als die er is
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (playing) {
      // Stel een nieuwe timeout in; na 'delay' ms naar volgende slide
      timeoutRef.current = window.setTimeout(() => {
        setIndex((i) => (i + 1) % images.length);
      }, delay);
    }

    // cleanup als component unmount of dependencies veranderen
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [index, playing, images.length]); // herstart timer als index verandert (bv. door klik) of playing verandert

  return (
    <>
      <span className="font-bold text-center text-4xl mb-2 italic">
        {t("hello_world")}
      </span>
      <hr className="h-[2px] w-[110%] mx-auto border-0 rounded-sm bg-black mb-5" />
      {/* onMouseEnter / onMouseLeave pauzeren / hervatten autoplay */}
      <div
        id="gallery"
        className="relative w-full"
        data-carousel="slide"
        onMouseEnter={() => setPlaying(false)}
        onMouseLeave={() => setPlaying(true)}
      >
        <div className="relative overflow-hidden rounded-lg h-[calc(100vh-18rem)]">
          {/* Slides: alleen actieve slide zichtbaar */}
          {images.map((src, i) => (
            <div
              key={src}
              className={`duration-700 ease-in-out ${i === index ? "block" : "hidden"}`}
              aria-hidden={i === index ? "false" : "true"}
            >
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                className="absolute block max-w-full h-screen -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-cover"
              />
            </div>
          ))}
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

      <div className="mt-4 flex items-center gap-3">
        <button
          className="text-3xl border-2 hover:underline hover:cursor-pointer rounded py-3 px-5 border-black bg-green-600 hover:bg-green-700 focus:outline-none"
          onClick={next}
        >
          Boeken
        </button>
        
        <button
          className="text-3xl border-2 hover:underline hover:cursor-pointer rounded py-3 px-5 border-black hover:bg-green-600 focus:outline-none"
          onClick={() => i18n.changeLanguage("nl")}
        >
          <Icon icon="flag:nl-4x3" width="60" height="40" />
        </button>

        <button
          className="text-3xl border-2 hover:underline hover:cursor-pointer rounded py-3 px-5 border-black hover:bg-green-600 focus:outline-none"
          onClick={() => i18n.changeLanguage("de")}
        >
          <Icon icon="flag:de-4x3" width="60" height="40" />
        </button>

        <button
          className="text-3xl border-2 hover:underline hover:cursor-pointer rounded py-3 px-5 border-black hover:bg-green-600 focus:outline-none"
          onClick={() => i18n.changeLanguage("en")}
        >
          <Icon icon="flagpack:gb-ukm" width="60" height="40" />
        </button>
      </div>
    </>
  );
}
