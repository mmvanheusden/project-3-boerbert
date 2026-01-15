import "../../index.css";
import { useContext } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import { BottomRowButton } from "./BookingFlowManager.tsx";
import { t } from "i18next";
import {BACKEND} from "../../App.tsx";

export function PaymentStatus() {
    const context = useContext(Context);

    return (<div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
              {t("payment_status")}
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div
                    className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg">
                    <h1 className="text-8xl font-bold mb-10 mt-5">
                        {t("payment_successful")}
                    </h1>
                    <Icon className="mt-10  cursor-pointer" icon="streamline-ultimate-color:check" width="800"
                          height="800"/>
                </div>


            </div>
            <div className="flex-row flex w-full items-center justify-end">
                <button
                    className="inline-flex items-center h-full hover:cursor-pointer py-7 px-7 bg-green-600 hover: rounded-xl text-5xl text-white"
                    onClick={async () => {
                        // HIER BOEKEN WE DE ACTIVITEIT FR!!1!1!!1!!
                        await BACKEND.bookings.put({
                            slotId: context.selectedSlot!.id,
                            amount: context.selectedAmount,
                            campingSpot: context.selectedCampingSpot,
                        })
                        context.setCurrentStep (9)
                    }}
                > {t("proceed")}</button>
            </div>
        </div>
    );
}
