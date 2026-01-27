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
                className="select-none rounded-t-lg bg-green-600 px-4 md:px-8 mb-1 font-semibold text-3xl md:text-5xl text-white">
              {t("campingspot_overview")}
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div className="w-full h-full overflow-auto flex flex-col justify-between items-center bg-white shadow-md rounded-lg py-4 md:py-7">
                        <div className="flex flex-col justify-center items-center flex-1">
                        <h1 className="text-4xl md:text-8xl font-bold mb-6 md:mb-10 mt-3 md:mt-5 mx-5 md:mx-15 justify-center text-center">
                            {t("enter_campingspot")}
                        </h1>
                        <Icon icon="fluent:tent-16-regular" className="flex-none size-[10em] md:size-[20em]"/>
                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            context.next();
                        }}>
                            <input type="number" placeholder= {t("here")} className="outline focus:ring-4 text-4xl md:text-7xl mx-5 mb-6 md:mb-10 flex justify-center text-center caret-green-800 py-1 md:py-2"
                            value={context.selectedCampingSpot}
                            onChange={(e) => context.selectCampingSpot(e.target.value)}
                            />
                        </form>
                        </div>
                        <div className="w-full px-4 md:px-7 flex flex-col gap-3 md:gap-5">

                         {context.selectedCampingSpot == "666" && (
                         <button
                             className="w-full text-4xl md:text-7xl hover:cursor-pointer py-8 md:py-15 bg-red-500 rounded-xl flex justify-center items-center text-black hover:bg-red-600"
                             onClick={async () => {
                                 context.setCurrentStep(10)}}
                         >
                           <Icon icon="game-icons:devil-mask" className="w-16 h-16 md:w-24 md:h-24" />
                           
                           </button>
                         )}
                        <button
                              className={`w-full text-4xl md:text-7xl hover:cursor-pointer py-8 md:py-15 border-black focus:outline-none text-white rounded-xl flex justify-center items-center ${(context.selectedCampingSpot == null || Number(context.selectedCampingSpot) <= 0 || Number(context.selectedCampingSpot) >= 31 ) ? "bg-gray-500 pointer-events-none" : "bg-green-600 hover:bg-green-700"}`}
                              onClick={context.next}
                          >
                             {t("proceed")}
                        </button>

                        </div>

                </div>
            </div>
                        <div className="flex-row flex w-full items-center justify-between">
                            <BottomRowButton text={t("cancel")} onClick={() => context.setCurrentStep(0)} colorHover={"red-600"} colorIdle={"red-500"} />
                            <BottomRowButton text={t("back_to_confirmation")} onClick={() => context.prev()} colorHover={"orange-300"} colorIdle={"orange-400"} />
                        </div>
        </div>
    );
}
