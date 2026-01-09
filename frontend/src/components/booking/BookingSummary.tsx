import { BookingDetails, Header } from "../KleineDingetjes.tsx";
import i18n, { t } from "i18next";
import { useContext } from "react";
import Context from "./Context.tsx";
import { CancelButton } from "./BookingFlowManager.tsx";

export function BookingSummary() {
	const context = useContext(Context), { selectedActivity, prev, selectedAmount } = useContext(Context);

	return (<div className="flex flex-col gap-3 h-full">
			<Header>
				<span
					className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
					{t("confirm_booking")}
				</span>
			</Header>

			<div className="flex-1 overflow-auto text-2xl p-5 bg-white shadow-md rounded-lg">
				<div>
					<div className="w-full h-[20vh] max-h-[20vh] overflow-hidden rounded-xl">
						<img
							className="w-full h-full object-cover object-center"
							src={`data:image/png;base64, ${selectedActivity?.hero}`}
							style={{imageRendering: "pixelated"}}
							alt={selectedActivity?.title[i18n.language as "en" | "de" | "nl"] ?? "activity image"}
						/>
					</div>
					<h1 className="text-8xl font-bold italic mb-15 mt-2 text-center">{t("book_areyousure")}</h1>
					<b className="text-center text-6xl">{t("booking_details")}</b>
					<div className="text-4xl">
						<BookingDetails/>
					</div>
				</div>
			</div>
			<div
				className="flex-row flex w-full gap-2 items-center justify-between">
				<CancelButton/>
				<button
					className="inline-flex items-center hover:cursor-pointer h-full py-3 px-5 bg-orange-400 hover:bg-orange-300 rounded-xl text-4xl text-white"
					onClick={context.prev}>
					{t("back_to_activity_view")}
				</button>
				<button
					className="inline-flex items-center hover:cursor-pointer h-full py-3 px-5 bg-green-600 hover:bg-green-700 rounded-xl text-4xl text-white"
					onClick={context.next}>
					{t("confirm_booking_details")}
				</button>
			</div>
		</div>
	);
}
