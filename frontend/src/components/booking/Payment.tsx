import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import {CancelButton} from "./BookingFlowManager.tsx";
import { t } from "i18next";

export function Payment() {
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
                <div
                    className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg">
                    <span>{t("selected_payment_method", { selectedPaymentMethod: context.selectedPaymentMethod })}</span>
                    
                    
                    {(() => {
                        switch (context.selectedPaymentMethod) {
                            case "PIN" :
                                return <div className="text-center">
                        <h1 className="text-5xl font-bold mb-10 mt-5">
                            {t("scan_payment_card")}
                        </h1>
                        
                    </div>
                            case "CONTANT" :
                                return <div className="text-center">
                        <h1 className="text-5xl font-bold mb-10 mt-5">
                            {t("proceed_to_counter")}
                        </h1>
                        <h1 className="text-3xl font-bold">
                            {t("receipt_at_counter")}
                        </h1>
                    </div>
                        }
                    })()}
                    
                    
                    {(() => {
                        switch (context.selectedPaymentMethod) {
                            case "PIN":
                                return <Icon className="mt-10 border-7 rounded-full border-black cursor-pointer" icon="iconoir:hand-card" width="300" height="300"/>
                            case "CONTANT":
                                return <Icon className="mt-10 border-7 rounded-full border-black cursor-pointer" icon="streamline-cyber:cash-hand-4" width="300" height="300"/>
                        }
                    })()}
                </div>
            </div>
            <div className="flex">
                <CancelButton/>
            </div>
        </div>
    );
}
