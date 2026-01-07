import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import {CancelButton} from "./BookingFlowManager.tsx";
import { t } from "i18next";


export function RememberMail() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
            Mail updates ontvangen
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg">
                        <h1 className="text-8xl font-bold mb-10 mt-5 mx-15 justify-center text-center">
                            Wilt u updates ontvangen via mail?
                        </h1>
                            <Icon className="mt-5  cursor-pointer" icon="lucide:calendar-clock" width="300" height="300"/>
                        
                        <form>
                            <label className="text-7xl mt-5 mb-10 flex justify-center">
                                <input type="text" placeholder=" Voer uw e-mailadres in" className="outline mt-10 text-center"/>
                                <input type="checkbox" className="outline w-30 h-30 ml-5 mt-10"/> 
                            </label>
                        </form>
                        <div className="flex items-center justify-evenly">
                          <button
                              className={`w-50% mt-10 mx-5 text-7xl hover:cursor-pointer px-15 py-15 border-black focus:outline-none text-white rounded-xl bg-red-500 hover:bg-red-600 ${(context.activities != null && context.activities.length == 0) ? "" : ""}`}
                              onClick={context.next}
                          > Doorgaan zonder emailupdates
                        </button>
                         <button
                              className={`w-50% mt-10 mx-5 text-7xl hover:cursor-pointer px-15 py-15 border-black focus:outline-none text-white rounded-xl bg-green-600 hover:bg-green-700 ${(context.activities != null && context.activities.length == 0) ? "" : ""}`}
                              onClick={context.next}
                          > Ik ontvang graag updates via de mail
                        </button>
                        </div>
                        
                </div>
            </div>


            <div 
                    className="flex-row flex w-full items-center justify-between">
                    <CancelButton/>
                <div>
                    <button
                        className="hover:cursor-pointer rounded-xl py-3 px-5 bg-orange-400 hover:bg-orange-300 focus:outline-none text-4xl mr-3 text-white"
                        onClick={context.prev}>
                        {t("Terug naar campingplaats invoeren")}
                    </button>
                </div>
            </div>
        </div>
    );
}
