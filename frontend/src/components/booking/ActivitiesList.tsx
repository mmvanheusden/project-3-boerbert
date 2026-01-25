import "../../index.css";
import { useContext, useState } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { BottomRowButton } from "./BookingFlowManager.tsx";
import i18n, { t } from "i18next";
import useFirstRender, {BACKEND} from "../../App.tsx";
import dayjs from "dayjs";
import {Icon} from "@iconify/react";
import { Treaty } from "@elysiajs/eden/treaty2";

export function ActivitiesList() {
	const context = useContext(Context);
	const [activityTypeFilter, setActivityTypeFilter] = useState("");
	const [activityMinAgeFilter, setActivityMinAgeFilter] = useState("");
	const [activityTargetAudienceFilter, setActivityTargetAudienceFilter] = useState("");
	const [activityPriceFilter, setActivityPriceFilter] = useState("");

	useFirstRender(() => {
		// Elke x dat we naar deze stap gaan, moeten we even de data uit de backend op de achtergrond opnieuw ophalen. Zo is alles up-to-date.
		context.refetchData();

		// Wis de context, zodat we geen data van de vorige sessie hebben.
		context.clearPreviousSession();
	})

	return (
		<div className="flex flex-col gap-3 h-full">
			<Header>
                <span
					className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
                    {t("choose_an_activity")}
                </span>
			</Header>
			<div className="w-full flex justify-between gap-3">
				<div className="relative w-full">
					<button className={`bg-green-600 hover:bg-green-700 text-white text-5xl font-semibold py-5 px-5 rounded-xl w-full text-center h-full ${activityTypeFilter != "" && "ring-5 ring-orange-500"}`}>{t("type")}</button>
					<select className="text-4xl absolute inset-0 opacity-0 w-full cursor-pointer" value={activityTypeFilter}
							onChange={(e) => setActivityTypeFilter(e.target.value)}>
						<option hidden selected value="">{t("type")}</option>
						<option value="">{t("all")}</option>
						<option value="Sport/Spel">{t("sport_spel")}</option>
						<option value="Educatief">{t("educative")}</option>
						<option value="Eten">{t("food")}</option>
						<option value="Overig">{t("other")}</option>
					</select>
				</div>

				<div className="relative w-full">
					<button className={`bg-green-600 hover:bg-green-700 text-white text-5xl font-semibold py-5 px-5 rounded-xl w-full text-center h-full ${activityMinAgeFilter != "" && "ring-5 ring-orange-500"}`}>{t("age")}</button>
					<select className="text-4xl absolute inset-0 opacity-0 w-full cursor-pointer" value={activityMinAgeFilter}
							onChange={(e) => setActivityMinAgeFilter(e.target.value)}>
						<option hidden selected value="">{t("age")}</option>
						<option value="">{t("all")}</option>
						<option value="3">{t("age_3")}</option>
						<option value="7">{t("age_7")}</option>
						<option value="12">{t("age_12")}</option>
						<option value="0">{t("all_ages")}</option>
					</select>
				</div>

				<div className="relative w-full">
					<button className={`bg-green-600 hover:bg-green-700 text-white text-5xl font-semibold py-5 px-5 rounded-xl w-full text-center h-full ${activityTargetAudienceFilter != "" && "ring-5 ring-orange-500"}`}> {t("target_audience")}</button>
					<select className="text-4xl absolute inset-0 opacity-0 w-full cursor-pointer"
							value={activityTargetAudienceFilter}
							onChange={(e) => setActivityTargetAudienceFilter(e.target.value)}>
						<option hidden selected value="">{t("target_audience")}</option>
						<option value="">Alles</option>
						<option value="Kinderen">{t("children")}</option>
						<option value="Gezinnen">{t("families")}</option>
						<option value="Senioren">{t("seniors")}</option>
						<option value="Volwassenen">{t("adults")}</option>
					</select>
				</div>
				<div className="relative w-full">
					<button className={`bg-green-600 hover:bg-green-700 text-white text-5xl font-semibold py-5 px-5 rounded-xl w-full text-center h-full ${activityPriceFilter != "" && "ring-5 ring-orange-500"}`}>{t("price")}</button>
					<select className="text-4xl absolute inset-0 opacity-0 w-full cursor-pointer" value={activityPriceFilter}
							onChange={(e) => setActivityPriceFilter(e.target.value)}>
						<option hidden selected value="">{t("price")}</option>
						<option value="">{t("all")}</option>
						<option value="3.5">{t("max_3_50_euro")}</option>
						<option value="5">{t("max_5_euro")}</option>
						<option value="10">{t("max_10_euro")}</option>
						<option value="0">{t("free")}</option>
					</select>
				</div>
			</div>

			<div className="flex-1 overflow-auto">
				<ul>
					{
						context.activities!
						.filter((activity) => (activity.type === activityTypeFilter) || activityTypeFilter == "")
						.filter((activity) => (activity.minage === activityMinAgeFilter) || activityMinAgeFilter == "")
						.filter((activity) => (activity.targetAudience === activityTargetAudienceFilter) || activityTargetAudienceFilter == "")
						.filter((activity) => (activity.price <= Number(activityPriceFilter)) || activityPriceFilter == "")
						.sort((activity) => activity.pinned ? -1 : 1) // Bubbel de gepinde activiteiten naar boven!!!! (zo exciting :oooooo)
						.map((activiteit) => <li key={activiteit.id}><ActivityCard activiteit={activiteit} /></li>)
					}
				</ul>
			</div>

			<div className="flex">
				<BottomRowButton text={t("cancel")} onClick={() => context.setCurrentStep(0)} colorHover={"red-600"} colorIdle={"red-500"} />
			</div>
		</div>
	);
}

// Check of een activiteit zichtbaar moet zijn
const hasAvailableSlots = (activity: Treaty.Data<typeof BACKEND.activities.get>[0]) => {
	if (!activity.slots || activity.slots.length === 0) return false;
	return activity.slots.some((slot: any) => {
		const isAfterNow = dayjs(slot.date).isAfter(dayjs());
		const hasCapacity = activity.capacity - slot.bookings > 0;
		return isAfterNow && hasCapacity;
	});
};

function ActivityCard(props: { activiteit: Treaty.Data<typeof BACKEND.activities.get>[0]}) {
	const { activiteit } = props;
	const context = useContext(Context);
	const isAvailable = hasAvailableSlots(activiteit);
	return (
		<div className="mb-2">
			<div className={`bg-white shadow-md rounded-xl p-2 w-full flex ${activiteit.pinned && "border-12 border-green-400"}`}>
				<div className="w-full inline-flex gap-2 items-stretch break-all px-3 py-3">
					<div className="min-w-1/3">
						<h3 className="text-7xl font-semibold mb-8 overflow:hidden text-ellipsis">{activiteit.title[i18n.language as "en" | "de" | "nl"]}</h3>
						<p className="text-6xl text-gray-600 mt-3 overflow:hidden text-ellipsis">{activiteit.subtitle[i18n.language as "en" | "de" | "nl"]}</p>
						<p className="text-5xl text-gray-600 mt-3 overflow:hidden trunctate text-ellipsis">{activiteit.type}</p>
						<p className="text-5xl text-gray-600 mt-3 overflow:hidden trunctate text-ellipsis">{activiteit.targetAudience}</p>
						<p className="text-5xl text-gray-600 mt-3">{activiteit.minage == "0" ? t("all_ages") : t("min_age", { age: activiteit.minage })}</p>
						<p className="text-5xl text-gray-600 mt-3">{t("price_per_person", { price: activiteit.price.toFixed(2).dot2comma().replace(",00", ",-") })}</p>
					</div>
					<div className="relative min-w-2/3">
						<img
							className="w-full object-fill rounded-lg aspect-6/4"
                            src={`data:image/png;base64, ${activiteit.hero}`}
							alt={activiteit.title[i18n.language as "en" | "de" | "nl"]}
						/>
						{activiteit.pinned == true && (
							<div className="absolute top-2 right-2 bg-green-400 text-black text-5xl font-bold px-3 py-3 rounded-lg">
								{t("pinned_activity")}
							</div>
						)}
						<button
							onClick={() => {
								context.selectActivity(activiteit);
								context.next();
							}}
							type="button"
							className={`rounded-lg mt-3 py-8 text-white w-full text-7xl transition-colors inline-flex justify-center  ${
								isAvailable
									? "bg-green-600 hover:bg-green-700 focus:outline-none"
									: "bg-red-600 pointer-events-none"
							}`}
						>
							{isAvailable ? t("proceed") : <><Icon icon="mdi:alert"/>{t("not_available")}</>}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}