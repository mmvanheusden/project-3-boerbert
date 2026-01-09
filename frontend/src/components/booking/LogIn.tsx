import "../../index.css";
import { useContext } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import { BottomRowButton } from "./BookingFlowManager.tsx";
import { t } from "i18next";


export function LogIn() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
              {t("campingspot_overview")}
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg">
                        <h1 className="text-8xl font-bold mb-10 mt-5 mx-15 justify-center text-center">
                            {t("enter_campingspot")}
                        </h1>
                        <Icon icon="fluent:tent-16-regular" className="flex-none size-[20em]"/>
                        <form>
                            <input type="number" className="outline focus:ring-4 text-7xl mx-5 mb-10 flex justify-center text-center caret-green-800 py-2"/>
                        </form>
                        <button
                              className={`mt-10 text-7xl hover:cursor-pointer px-15 py-15 border-black focus:outline-none text-white rounded-xl ${(context.activities != null && context.activities.length == 0) ? "disabled bg-red-500 pointer-events-none" : "bg-green-600 hover:bg-green-700"}`}
                              onClick={context.next}
                          > {t("proceed")}
                        </button>
                </div>
            </div>
                        <div className="flex-row flex w-full items-center justify-between">
                            <BottomRowButton text={t("cancel")} onClick={() => context.setCurrentStep(0)} colorHover={"red-600"} colorIdle={"red-500"} />
                            <BottomRowButton text={t("back_to_confirmation")} onClick={() => context.prev()} colorHover={"orange-300"} colorIdle={"orange-400"} />
                        </div>
        </div>
    );
}
