import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import {CancelButton} from "./BookingFlowManager.tsx";
import { t } from "i18next";

export function ViewActivity() {
    const {selectedActivity, prev} = useContext(Context);

    return (<>
        <Header>
            <span
                className="select-none rounded-t-lg border-2 border-black bg-green-600 px-4 mb-1 font-semibold text-3xl -translate-y-4">
              {t("step2_title")}
            </span>
        </Header>

        <div className="w-full overflow-auto">
            <div className="inline-flex w-full items-start gap-6 bg-white shadow-md rounded-lg p-6 mb-2">
                <div className="text-sm text-gray-800">
                    <h1 className="text-2xl font-semibold mb-2">
                        {selectedActivity?.title}
                    </h1>
                    <div className="font-semibold mb-2 text-gray-700">
                        {selectedActivity?.subtitle}
                    </div>

                    <div className="mb-2">{selectedActivity?.description}</div>

                    <div className="mb-1">{t("price_per_ticket", { price: selectedActivity?.price })}</div>
                    <div className="mb-1">
                        {t("max_participants", { capacity: selectedActivity?.capacity })}
                    </div>
                    <div className="mb-1">
                        {t("location_label", { location: selectedActivity?.location })}
                    </div>
                    <div className="mb-1">
                        {t("min_age_note", { minage: selectedActivity?.minage })}
                    </div>
                </div>
                <img
                    className="w-[50%] right-0 min-h-[40vh] object-cover rounded-xl border-2 ml-auto"
                    src={`data:image/png;base64, ${selectedActivity?.hero}`}
                    style={{imageRendering: "pixelated"}}
                    alt={selectedActivity?.title ?? "activity image"}
                />
            </div>
        </div>

        <div className="inline-flex w-full items-center justify-between">
            <button
                className="border-2 hover:underline hover:cursor-pointer rounded py-3 px-5 border-black bg-green-600 hover:bg-green-700 focus:outline-none text-2xl mr-5"
                onClick={prev}>
               {t("back_to_list")}
            </button>
            <CancelButton/>
        </div>
    </>);
}
