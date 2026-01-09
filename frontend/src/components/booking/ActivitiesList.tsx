import "../../index.css";
import { useContext } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { CancelButton } from "./BookingFlowManager.tsx";
import i18n, { t } from "i18next";

export function ActivitiesList() {
    const context = useContext(Context);

    // De kaarten met activiteiten.
    const activityItems = context.activities!.map((activiteit) => (
        <li key={activiteit.id ?? activiteit.title.toString()} className="mb-2">
            <div className="bg-white shadow-md rounded-lg p-2 w-full">
                <div className="w-full inline-flex gap-2 items-stretch px-3 py-2">
                    <div className="min-w-1/3">
                        <h3 className="text-7xl font-semibold mb-8">{activiteit.title[i18n.language as "en" | "de" | "nl"]}</h3>
                        <p className="text-6xl text-gray-600 mt-3">{activiteit.subtitle[i18n.language as "en" | "de" | "nl"]}</p>
                        <p className="text-5xl text-gray-600 mt-3">{activiteit.minage == "0" ? t("all_ages") : t("min_age", { age: activiteit.minage })}</p>
                        <p className="text-5xl text-gray-600 mt-3">{t("price_per_person", {price: activiteit.price})}</p>
                    </div>
                    <div className="relative min-w-2/3">
                        <img
                            className="w-full object-fill rounded-xl aspect-3/2"
                            src={`data:image/png;base64, ${activiteit.hero}`}
                            alt={activiteit.title[i18n.language as "en" | "de" | "nl"]}
                        />
                        <button
                            onClick={() => {
                                context.selectActivity(activiteit);
                                context.next();
                            }}
                            type="button"
                            className="rounded-xl mt-3 py-2 text-white w-full  bg-green-600 hover:bg-green-700 focus:outline-none text-7xl"
                        >
                            {t("proceed")}
                        </button>
                    </div>
                </div>
            </div>
        </li>
    ));

	return (
		<div className="flex flex-col gap-3 h-full">
			<Header>
					<span
						className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
						{t("choose_an_activity")}
					</span>
			</Header>
            <div className="w-full flex justify-center">
                <button className="bg-green-600 hover:bg-green-700 text-white text-5xl font-semibold py-5 px-5 rounded-xl mr-5 w-full">Type activiteit ↓</button>
                <button className="bg-green-600 hover:bg-green-700 text-white text-5xl font-semibold py-5 px-5 rounded-xl mr-2.5 w-full">Minimumleeftijd ↓</button>
                <button className="bg-green-600 hover:bg-green-700 text-white text-5xl font-semibold py-5 px-5 rounded-xl ml-2.5 w-full">Locatie ↓</button>
                <button className="bg-green-600 hover:bg-green-700 text-white text-5xl font-semibold py-5 px-5 rounded-xl ml-5 w-full">Beschikbare plekken ↓</button>
            </div>

			<div className="flex-1 overflow-auto">
				<ul>{activityItems}</ul>
			</div>
			<div className="flex">
				<CancelButton/>
			</div>
		</div>
	);
}