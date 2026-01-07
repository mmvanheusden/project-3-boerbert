import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import {CancelButton} from "./BookingFlowManager.tsx";
import { t } from "i18next";

export function PaymentMethod() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
              Selecteer betaalmethode
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                    <div className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg">
                            <div>
                                <h1 className="text-8xl font-bold mb-30">
                                    Selecteer betaalmethode
                                </h1>
                            </div>
                            <div className="inline-flex">
                                <div>
                                <Icon className="mr-20" icon="bi:cash-coin" width="450" height="450" />
                                <button className="ml-10 mr-10 mt-10 text-6xl hover:cursor-pointer px-15 py-15 text-white rounded-xl bg-green-600 hover:bg-green-700 cursor-pointer" onClick={() => {
                                    context.selectPaymentMethod("CONTANT")
                                    context.next()
                                }}>Met contant bij de balie</button>

                                </div>
                                <div>
                                <Icon className="ml-20" icon="cib:ideal" width="450" height="450"/>
                                <button className="ml-10 mr-10 mt-10 text-6xl hover:cursor-pointer px-15 py-15 text-white rounded-xl bg-green-600 hover:bg-green-700 cursor-pointer" onClick={() => {
                                    context.selectPaymentMethod("PIN")
                                    context.next()
                                }}>Met iDeal via QR-code</button>
                                </div>
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
                                    {t("Terug naar mailupdates")}
                                </button>
                            </div>
                        </div>
        </div>
        );
}
