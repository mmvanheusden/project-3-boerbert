import "../../index.css";
import { useContext, useState } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { BottomRowButton } from "./BookingFlowManager.tsx";
import i18n, { t } from "i18next";
import useFirstRender from "../../App.tsx";

export function ActivitiesList() {
    const context = useContext(Context);
    const [activityTypeFilter, setActivityTypeFilter] = useState("");
    const [activityMinAgeFilter, setActivityMinAgeFilter] = useState("");
    const [activityGroupFilter, setActivityGroupFilter] = useState("");
    const [activityPriceFilter, setActivityPriceFilter] = useState("");

    useFirstRender(() => {
        // Elke x dat we naar deze stap gaan, moeten we even de data uit de backend op de achtergrond opnieuw ophalen. Zo is alles up-to-date.
        context.refetchData();

        // Wis de context, zodat we geen data van de vorige sessie hebben.
        context.clearPreviousSession();
    })

    // De kaarten met activiteiten.
    const activityItems = context.activities!
        .filter((activity) => (activity.type === activityTypeFilter) || activityTypeFilter == "")
        .filter((activity) => (activity.minage === activityMinAgeFilter) || activityMinAgeFilter == "")
        .filter((activity) => (activity.targetaudience === activityTargetAudienceFilter) || activityTargetAudienceFilter == "")
        .filter((activity) => (activity.price <= Number(activityPriceFilter)) || activityPriceFilter == "")
        .map((activiteit) => (
            <li key={activiteit.id ?? activiteit.title.toString()} className="mb-2">
                <div className="bg-white shadow-md rounded-xl p-2 w-full">
                    <div className="w-full inline-flex gap-2 items-stretch break-all px-3 py-3">
                        <div className="min-w-1/3">
                            <h3 className="text-7xl font-semibold mb-8">{activiteit.title[i18n.language as "en" | "de" | "nl"]}</h3>
                            <p className="text-6xl text-gray-600 mt-3">{activiteit.subtitle[i18n.language as "en" | "de" | "nl"]}</p>
                            <p className="text-5xl text-gray-600 mt-3">{activiteit.minage == "0" ? t("all_ages") : t("min_age", { age: activiteit.minage })}</p>
                            <p className="text-5xl text-gray-600 mt-3">{t("price_per_person", { price: activiteit.price })}</p>
                            <p className="text-5xl text-gray-600 mt-3">{t("locationlist", { location: activiteit.location })}</p>
                        </div>
                        <div className="relative min-w-2/3">
                            <img
                                className="w-full object-fill rounded-lg aspect-6/4"
                                src={`data:image/png;base64, ${activiteit.hero}`}
                                alt={activiteit.title[i18n.language as "en" | "de" | "nl"]}
                            />
                            <button
                                onClick={() => {
                                    context.selectActivity(activiteit);
                                    context.next();
                                }}
                                type="button"
                                className="rounded-lg mt-3 py-8 text-white w-full  bg-green-600 hover:bg-green-700 focus:outline-none text-8xl"
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
            <div className="w-full flex justify-between gap-3">
                <select className="bg-green-600 hover:bg-green-700 text-white text-5xl font-semibold py-5 px-5 rounded-xl w-full" value={activityTypeFilter} onChange={(e) => setActivityTypeFilter(e.target.value)}>
                    <option selected hidden value="">Type</option>
                    <option value="Sport/Spel">Sport/Spel</option>
                    <option value="Educatief">Educatief</option>
                    <option value="Eten">Eten</option>
                    <option value="Overig">Overig</option>
                </select>

                <select className="bg-green-600 hover:bg-green-700 text-white text-5xl font-semibold py-5 px-5 rounded-xl w-full" value={activityMinAgeFilter} onChange={(e) => setActivityMinAgeFilter(e.target.value)}>
                    <option selected hidden value="">Leeftijd</option>
                    <option value="0">Alle leeftijden</option>
                    <option value="3">3+</option>
                    <option value="7">7+</option>
                    <option value="12">12+</option>
                </select>
                <select className="bg-green-600 hover:bg-green-700 text-white text-5xl font-semibold py-5 px-5 rounded-xl w-full" value={activityTargetAudienceFilter} onChange={(e) => setActivityTargetAudienceFilter(e.target.value)}>
                    <option selected hidden value="">Doelgroep</option>
                    <option value="Kinderen">Kinderen</option>
                    <option value="Gezinnen">Gezinnen</option>
                    <option value="Senioren">Senioren</option>
                    <option value="Volwassenen">(Jong)volwassenen</option>
                </select>
                <select className="bg-green-600 hover:bg-green-700 text-white text-5xl font-semibold py-5 px-5 rounded-xl w-full" value={activityPriceFilter} onChange={(e) => setActivityPriceFilter(e.target.value)}>
                    <option selected hidden value="">Prijs</option>
                    <option value="3.5">Max. 3,50 euro</option>
                    <option value="5">Max. 5 euro</option>
                    <option value="10">Max. 10 euro</option>
                    <option value="0">Gratis</option>
                </select>
              
            </div>

            <div className="flex-1 overflow-auto">
                <ul>{activityItems}</ul>
            </div>
            <div className="flex">
                <BottomRowButton text={t("cancel")} onClick={() => context.setCurrentStep(0)} colorHover={"red-600"} colorIdle={"red-500"} />
            </div>
        </div>
    );
}