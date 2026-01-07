import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import {CancelButton} from "./BookingFlowManager.tsx";
import { t } from "i18next";

export function PaymentStatus() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
              Betalingsstatus
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg">
                        <h1 className="text-5xl font-bold mb-10 mt-5">
                            Betaling is gelukt
                        </h1>
                        <Icon className="mt-10  cursor-pointer" icon="streamline-ultimate-color:check" width="300" height="300"/>
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
                <button
                              className={`text-5xl hover:cursor-pointer py-3 px-10 border-black focus:outline-none text-white rounded-xl ${(context.activities != null && context.activities.length == 0) ? "disabled bg-red-500 pointer-events-none" : "bg-green-600 hover:bg-green-700"}`}
                              onClick={context.next}
                          > Verder (secret admin mode)          
                </button>
            </div>
    );
}
