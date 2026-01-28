import "../../index.css";
import {useContext, useState} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import {BottomRowButton} from "./BookingFlowManager.tsx";
import i18n, {t} from "i18next";
import useFirstRender, {BACKEND} from "../../App.tsx";
import dayjs from "dayjs";
import {Icon} from "@iconify/react";
import {Treaty} from "@elysiajs/eden/treaty2";

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
					className="select-none rounded-t-lg bg-green-600 px-4 md:px-8 mb-1 font-semibold text-3xl md:text-5xl text-white">
                    {t("choose_an_activity")}
                </span>
			</Header>
			<div className="w-full flex justify-between gap-2 md:gap-4">
				<div className="relative w-full">
					<Icon className="absolute top-0 right-0 w-6 h-6 md:w-11 md:h-11" icon="tabler:filter-filled" color={`${activityTypeFilter ? "#2B7FFF" : "#28282B"}`} />
					<button className={`bg-green-600 hover:bg-green-700 text-white text-2xl md:text-5xl py-3 px-2 md:py-5 md:px-5 rounded-xl w-full text-center h-full ${activityTypeFilter ? "font-bold underline" : "font-semibold"}`}>{t("type")}</button>
					<select className="text-xl md:text-4xl absolute inset-0 opacity-0 w-full cursor-pointer" value={activityTypeFilter}
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
					<Icon className="absolute top-0 right-0 w-6 h-6 md:w-11 md:h-11" icon="tabler:filter-filled" color={`${activityMinAgeFilter ? "#7CCF00" : "#28282B"}`} />
					<button className={`bg-green-600 hover:bg-green-700 text-white text-2xl md:text-5xl py-3 px-2 md:py-5 md:px-5 rounded-xl w-full text-center h-full ${activityMinAgeFilter ? "font-bold underline" : "font-semibold"}`}>{t("age")}</button>
					<select className="text-xl md:text-4xl absolute inset-0 opacity-0 w-full cursor-pointer" value={activityMinAgeFilter}
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
					<Icon className="absolute top-0 right-0 w-6 h-6 md:w-11 md:h-11" icon="tabler:filter-filled" color={`${activityTargetAudienceFilter ? "#AD46FF" : "#28282B"}`} />
					<button className={`bg-green-600 hover:bg-green-700 text-white text-2xl md:text-5xl py-3 px-2 md:py-5 md:px-5 rounded-xl w-full text-center h-full ${activityTargetAudienceFilter ? "font-bold underline" : "font-semibold"}`}> {t("target_audience")}</button>
					<select className="text-xl md:text-4xl absolute inset-0 opacity-0 w-full cursor-pointer"
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
					<Icon className="absolute top-0 right-0 w-6 h-6 md:w-11 md:h-11" icon="tabler:filter-filled" color={`${activityPriceFilter ? "#FF6900" : "#28282B"}`} />
					<button className={`bg-green-600 hover:bg-green-700 text-white text-2xl md:text-5xl py-3 px-2 md:py-5 md:px-5 rounded-xl w-full text-center h-full ${activityPriceFilter ? "font-bold underline" : "font-semibold"}`}>{t("price")}</button>
					<select className="text-xl md:text-4xl absolute inset-0 opacity-0 w-full cursor-pointer" value={activityPriceFilter}
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
						.filter((activity) => (activity.type === activityTypeFilter) || activityTypeFilter == "") // Lege filter betekent: alles true (dus geen filter)
						.filter((activity) => (activity.minage === activityMinAgeFilter) || activityMinAgeFilter == "")
						.filter((activity) => (activity.targetAudience === activityTargetAudienceFilter) || activityTargetAudienceFilter == "")
						.filter((activity) => (activity.price <= Number(activityPriceFilter)) || activityPriceFilter == "")
						.sort((activity) => hasAvailableSlots(activity)? -1 : 1) // Bubbel de beschikbare activiteiten naar boven
						.sort((activity) => activity.pinned ? -1 : 1) // Bubbel de gepinde activiteiten naar boven!!!! (zo exciting :oooooo)
						.map((activiteit) => (
							<li key={activiteit.id}>
								<ActivityCard
									activiteit={activiteit}
									onSetActivityMinAgeFilter={setActivityMinAgeFilter}
									onSetActivityPriceFilter={setActivityPriceFilter}
									onSetActivityTargetAudienceFilter={setActivityTargetAudienceFilter}
									onSetActivityTypeFilter={setActivityTypeFilter}
								/>
							</li>
						))
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

// Map activity types to translation keys
const getActivityTypeKey = (type: string): string => {
	const typeMap: { [key: string]: string } = {
		"Sport/Spel": "sport_spel",
		"Educatief": "educative",
		"Eten": "food",
		"Overig": "other"
	};
	return typeMap[type] || type;
};

// Map target audiences to translation keys
const getTargetAudienceKey = (audience: string): string => {
	const audienceMap: { [key: string]: string } = {
		"Kinderen": "children",
		"Gezinnen": "families",
		"Senioren": "seniors",
		"Volwassenen": "adults"
	};
	return audienceMap[audience] || audience;
};

function ActivityCard(props: {
	activiteit: Treaty.Data<typeof BACKEND.activities.get>[0];
	onSetActivityMinAgeFilter: (value: string) => void;
	onSetActivityPriceFilter: (value: string) => void;
	onSetActivityTargetAudienceFilter: (value: string) => void;
	onSetActivityTypeFilter: (value: string) => void;
}) {
	const {
		activiteit,
		onSetActivityMinAgeFilter,
		onSetActivityPriceFilter,
		onSetActivityTargetAudienceFilter,
		onSetActivityTypeFilter
	} = props;
	const context = useContext(Context);
	const isAvailable = hasAvailableSlots(activiteit);
	return (
		<div className="mb-3">
			<div className={`bg-white shadow-md rounded-xl px-3 py-2 gap-4 w-full flex ${activiteit.pinned && "border-12 border-green-400 mb-10"}`}>
				<div className="w-4/10 flex flex-col items-stretch">
					<div className="flex flex-col h-full">
						<h3 className="text-3xl md:text-5xl lg:text-7xl font-semibold mt-2">{activiteit.title[i18n.language as "en" | "de" | "nl"]}</h3>
						<p className="text-xl md:text-3xl lg:text-4xl text-gray-800 mt-2 md:mt-5">{activiteit.subtitle[i18n.language as "en" | "de" | "nl"]}</p>
						<div className="mt-auto">
							{activiteit.price != 0 && <p className="text-xl md:text-3xl lg:text-5xl text-gray-800 mt-2 md:mt-5 mb-5 md:mb-5">{t("price_per_person", { price: activiteit.price.toFixed(2).dot2comma().replace(",00", ",-") })}</p>}
							<hr className="mt-5 mb-2 w-[95%]"/>
							<div className="flex-row flex flex-wrap gap-2 md:gap-3">
								<button
									type="button"
									onClick={() => onSetActivityMinAgeFilter(activiteit.minage)}
									className="cursor-zoom-in active:scale-120 transition inset-shadow-sm inset-shadow-lime-400 drop-shadow-lime-500 drop-shadow-sm text-lg md:text-2xl lg:text-3xl text-white bg-lime-500 w-fit p-2 md:p-3 rounded-full font-semibold"
								>
									{activiteit.minage == "0" ? t("all_ages") : t("min_age", { age: activiteit.minage })}
								</button>
								{getActivityTypeKey(activiteit.type) != "other" && (
									<button
										type="button"
										onClick={() => onSetActivityTypeFilter(activiteit.type)}
										className="cursor-zoom-in active:scale-120 transition inset-shadow-sm inset-shadow-blue-400 drop-shadow-blue-500 drop-shadow-sm text-lg md:text-2xl lg:text-3xl text-white bg-blue-500 w-fit p-2 md:p-3 rounded-full font-semibold"
									>
										{t(getActivityTypeKey(activiteit.type))}
									</button>
								)}
								<button
									type="button"
									onClick={() => onSetActivityTargetAudienceFilter(activiteit.targetAudience)}
									className="cursor-zoom-in active:scale-120 transition inset-shadow-sm inset-shadow-purple-400 drop-shadow-purple-500 drop-shadow-sm text-lg md:text-2xl lg:text-3xl text-white  bg-purple-500 w-fit p-2 md:p-3 rounded-full font-semibold"
								>
									{t(getTargetAudienceKey(activiteit.targetAudience))}
								</button>
								{activiteit.price == 0 && (
									<button
										type="button"
										onClick={() => onSetActivityPriceFilter("0")}
										className="cursor-zoom-in active:scale-120 transition inset-shadow-sm inset-shadow-orange-400 drop-shadow-orange-500 drop-shadow-sm text-lg md:text-2xl lg:text-3xl text-white bg-orange-500 w-fit p-2 md:p-3 rounded-full font-semibold"
									>
										{t("free")}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="w-6/10 relative inline-flex flex-col gap-2 items-stretch">
					<img
						className="w-full object-fill rounded-lg aspect-6/4"
                        src={`data:image/png;base64, ${activiteit.hero}`}
						alt={activiteit.title[i18n.language as "en" | "de" | "nl"]}
					/>
					{activiteit.pinned == true && (
						<div className="absolute top-2 right-2 bg-green-400 text-black text-2xl md:text-5xl font-bold px-2 py-2 md:px-3 md:py-3 rounded-lg">
							{t("pinned_activity")}
						</div>
					)}
					<button
						onClick={() => {
							context.selectActivity(activiteit);
							context.next();
						}}
						type="button"
						className={`rounded-lg py-4 md:py-8 text-white w-full text-4xl md:text-7xl transition inline-flex justify-center ${
							isAvailable
								? "bg-green-600 hover:bg-green-700 focus:outline-none cursor-pointer"
								: "bg-red-600 pointer-events-none"
						}`}
					>
						{isAvailable ? t("proceed") : <><Icon icon="mdi:alert"/>{t("not_available")}</>}
					</button>
				</div>
			</div>
		</div>
	);
}