import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import {CancelButton} from "./BookingFlowManager.tsx";
import { t } from "i18next";


export function ActivitiesList() {
	const context = useContext(Context);

	// De kaarten met activiteiten.
	const activityItems = context.activities!.map((activiteit) => (
        <li key={activiteit.id ?? activiteit.title} className="mb-2">
            <div className="bg-white shadow-md rounded-lg p-6 w-full">
                <div className="w-full grid grid-cols-3 gap-6 items-center">
                    <div>
                        <img
                            className="w-95 h-100 object-cover rounded-xl"
                            src={`data:image/png;base64, ${activiteit.hero}`}
                            style={{ imageRendering: "pixelated" }}
                            alt={activiteit.title}
                        />
                    </div>

                    <div>
                        <span className="text-2xl text-gray-600 font-mono font-semibold select-none">{t("activity_label")}</span>
                        <h3 className="text-6xl font-semibold mt-2 mb-8">{activiteit.title}</h3>
                        <p className="text-4xl text-gray-600 mt-3">{activiteit.subtitle}</p>
                        <p className="text-4xl text-gray-600 mt-3">{t("min_age_note", { minage: activiteit.minage })}</p>
                        <p className="text-4xl text-gray-600 mt-3">€{activiteit.price} per persoon</p>
                    </div>

                    <div className="flex justify-end h-full">
                        <button
                            onClick={() => {
                                context.selectActivity(activiteit);
                                context.next();
                            }}
                            type="button"
                            className="w-full rounded-3xl py-2 px-6 text-white bg-green-600 hover:bg-green-700 focus:outline-none text-8xl"
                        >
                            {t("book")}
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
						{t("stap_1")}
					</span>
			</Header>
			<div className="flex-1 overflow-auto">
				<ul>{activityItems}</ul>
			</div>
			<div className="flex">
				<CancelButton/>
			</div>
		</div>
	);

}