import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import {CancelButton} from "./BookingFlowManager.tsx";
import { t } from "i18next";

export function BetaalMethode() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg border-2 border-black bg-green-600 px-4 mb-1 font-semibold text-3xl -translate-y-4">
              {t("stap_3")}
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                    <div className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg">
                            <div>
                                <h1 className="text-5xl font-bold mb-30">
                                    {t("select_payment_method")}
                                </h1>
                            </div>
                            <div className="inline-flex">
                                <button onClick={() => {
                                    context.selectPaymentMethod("CONTANT")
                                    context.next()
                                }}><Icon className="mr-10 border-7 rounded-full border-black cursor-pointer" icon="streamline-cyber:cash-hand-4" width="300" height="300" /></button>

                                <button onClick={() => {
                                    context.selectPaymentMethod("PIN")
                                    context.next()
                                }}><Icon className="ml-10 border-7 rounded-full border-black cursor-pointer" icon="iconoir:hand-card" width="300" height="300"/></button>
                            </div>
                    </div>
            </div>
            <div className="flex">
                <CancelButton/>
            </div>
        </div>
        );
}
