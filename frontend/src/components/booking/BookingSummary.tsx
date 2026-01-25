import { BookingDetails, Header } from "../KleineDingetjes.tsx";
import i18n, { t } from "i18next";
import { useContext } from "react";
import Context from "./Context.tsx";
import { BottomRowButton } from "./BookingFlowManager.tsx";

export function BookingSummary() {
	const context = useContext(Context), { selectedActivity, prev, selectedAmount } = useContext(Context);

	return (<div className="flex flex-col gap-3 h-full flex-1 overflow-auto">
		<Header>
			<span
				className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
				{t("confirm_booking")}
			</span>
		</Header>

		<div className="flex-1 overflow-auto text-2xl p-5 bg-white shadow-md rounded-lg flex flex-col justify-between">
			<div>
				<div className="w-full h-[20vh] max-h-[20vh] overflow-hidden rounded-xl">
					<img
						className="w-full h-full object-cover object-center"
						src={`data:image/png;base64, ${selectedActivity?.hero}`}
						style={{ imageRendering: "pixelated" }}
						alt={selectedActivity?.title[i18n.language as "en" | "de" | "nl"] ?? "activity image"}
					/>
				</div>
				<h1 className="text-8xl font-semibold mb-15 mt-10 text-center">{t("book_areyousure")}</h1>
				<b className="text-center text-6xl">{t("booking_details")}</b>
				<div className="text-4xl mb-5 mt-5">
					<BookingDetails />
				</div>
			</div>
			<button
				className="cursor-pointer w-full rounded-xl py-10 px-10 bg-green-600 hover:bg-green-700 focus:outline-none text-7xl text-white mt-5"
				onClick={context.next}>
				{t("confirm_booking_details")}
			</button>
		</div>
		<div
			className="flex-row flex w-full gap-2 items-center justify-between">
			<BottomRowButton text={t("cancel")} onClick={() => context.setCurrentStep(0)} colorHover={"red-600"} colorIdle={"red-500"} />
			<BottomRowButton text={t("back_to_activity_view")} onClick={() => prev()} colorHover={"orange-300"} colorIdle={"orange-400"} />

		</div>

	</div>
	);
}
