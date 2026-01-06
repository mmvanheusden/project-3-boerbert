import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import {CancelButton} from "./BookingFlowManager.tsx";
import { t } from "i18next";


export function LogIn() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
              Campingplaats doorgeven
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div className="w-full h-full not-first-of-type:overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg">
                        <h1 className="text-8xl font-bold mb-10 mt-5 mx-15 justify-center text-center">
                            Geef hier uw campingplaatsnummer door
                        </h1>

                        <Icon className="" icon="fluent:tent-16-regular" width="300" height="300"/>

                        <form>
                            <label className="text-8xl mt-5 mb-10 flex justify-center text-center">
                                <input type="number" placeholder="" className="outline mt-10 text-center"/>
                            </label>
                        </form>
                        <button
                              className={`mt-10 text-8xl hover:cursor-pointer px-15 py-15 border-black focus:outline-none text-white rounded-xl ${(context.activities != null && context.activities.length == 0) ? "disabled bg-red-500 pointer-events-none" : "bg-green-600 hover:bg-green-700"}`}
                              onClick={context.next}
                          > Doorgaan          
                        </button>

                        
                </div>

                

            </div>
                        <div className="flex-row flex w-full items-center justify-between">
                            <CancelButton/>
                            <div>
                                <button
                                    className="hover:cursor-pointer rounded-xl py-3 px-5 bg-orange-400 hover:bg-orange-300 focus:outline-none text-4xl mr-3 text-white"
                                    onClick={context.prev}>
                                    {t("Terug naar activiteitenlijst")}
                                </button>
                            </div>
                        </div>


                     
        </div>
    );
}
