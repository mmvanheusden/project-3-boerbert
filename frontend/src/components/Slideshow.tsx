import React, { useState } from "react";

export function Slideshow() {
	const images = [
		"https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg",
		"https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg",
		"https://wallpapers.com/images/thumbnail/hog-rider-clash-character-uh80006aoilk44dh.webp"
	];

	const [index, setIndex] = useState(0);

	const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
	const next = () => setIndex((i) => (i + 1) % images.length);

	return (
		<>
			<div>
				Stap 0
				<h1>In deze stap komt de slideshow!</h1>
			</div>

			<div id="gallery" className="relative w-full" data-carousel="slide">
				<div className="relative h-56 overflow-hidden rounded-lg md:h-96">
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
								className="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
							/>
						</div>
					))}
				</div>

				{/* Slider controls met handlers */}
				<button
					type="button"
					className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
					onClick={prev}
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
					onClick={next}
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
		</>
	);
}