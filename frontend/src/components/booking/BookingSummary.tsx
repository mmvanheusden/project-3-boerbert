import {BookingDetails, Header} from "../KleineDingetjes.tsx";
import i18n, {t} from "i18next";
import {useContext} from "react";
import Context from "./Context.tsx";

export function BookingSummary() {
	const context = useContext(Context);

	return (
		<div className="flex flex-col gap-3 h-full">
			<Header>
					<span
						className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
						{t("boeking_samenvatting")}
					</span>
			</Header>
			<div className="flex-1 overflow-auto text-2xl ">
				<div className="size-full min-h-[30vh] max-h-[40vh] overflow-hidden rounded-xl">
					<img
						className="object-contain size-full"
						src={`data:image/png;base64, ${context.selectedActivity?.hero}`}
						style={{ imageRendering: "pixelated" }}
						alt={context.selectedActivity?.title[i18n.language as "en" | "de" | "nl"] ?? "activity image"}
					/>
				</div>
				<h1 className="text-4xl font-semibold mb-10 text-center">Weet je zeker dat je deze activiteit wil boeken?</h1>
				<b className="text-center underline">Boekingsdetails:</b>
				<BookingDetails/>
			</div>
			<div className="flex-row flex w-full items-center justify-between">
				<button
					className="hover:underline hover:cursor-pointer rounded-xl py-3 px-5 bg-red-600 hover:bg-red-700 focus:outline-none text-4xl mr-3 text-white"
					onClick={context.prev}>
					{t("back_to_activity_details")}
				</button>
				<button
					className="hover:underline hover:cursor-pointer rounded-xl py-3 px-5 bg-green-600 hover:bg-green-700 focus:outline-none text-4xl mr-3 text-white"
					onClick={context.next}>
					{t("continue_bookingflow")}
				</button>
			</div>
		</div>
	)
}