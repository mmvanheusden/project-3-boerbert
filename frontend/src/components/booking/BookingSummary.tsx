import { BookingDetails, Header } from "../KleineDingetjes.tsx";
import i18n, { t } from "i18next";
import { useContext } from "react";
import Context from "./Context.tsx";
import { CancelButton } from "./BookingFlowManager.tsx";

export function BookingSummary() {
	const context = useContext(Context), { selectedActivity, prev, selectedAmount } = useContext(Context);

	return (
		<div className="flex flex-col gap-3 h-full rounded-4xl bg-white/50 flex-1 overflow-auto">
			<Header>
				<span
					className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
					{t("boeking_samenvatting")}
				</span>
			</Header>

			<div className="flex-1 overflow-auto text-2xl p-5">
				<div>
					<div className="w-full h-[20vh] max-h-[20vh] overflow-hidden rounded-xl">
						<img
							className="w-full h-full object-cover object-center"
							src={`data:image/png;base64, ${selectedActivity?.hero}`}
							style={{ imageRendering: "pixelated" }}
							alt={selectedActivity?.title[i18n.language as "en" | "de" | "nl"] ?? "activity image"}
						/>
					</div>
					<h1 className="text-8xl font-semibold mb-15 mt-10 text-center">Weet je zeker dat je deze activiteit wil boeken?</h1>
					<b className="text-center text-6xl">Boekingsdetails:</b>
					<div className="text-4xl">
						<BookingDetails />
					</div>
				</div>
			</div>
			<div className="flex-row flex w-full items-center justify-between">

				<button
					className="cursor-pointer w-full rounded-xl py-10 px-10 bg-green-600 hover:bg-green-700 focus:outline-none text-7xl text-white"
					onClick={context.next}>
					{t("continue_bookingflow")}
				</button>
			</div>


	  <div 
					className="flex-row flex w-full items-center justify-between">
					<CancelButton/>
				<div>
					<button
						className="hover:cursor-pointer rounded-xl py-3 px-5 bg-orange-400 hover:bg-orange-300 focus:outline-none text-4xl mr-3 text-white"
						onClick={context.prev}>
						{t("Terug naar activiteit bekijken invoeren")}
					</button>
				</div>
			</div>
		</div>
	);
}
