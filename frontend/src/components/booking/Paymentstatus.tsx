import "../../index.css";
import { useContext } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import { BottomRowButton } from "./BookingFlowManager.tsx";
import { t } from "i18next";

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
            <div className="flex-row flex w-full items-center justify-between">
                <BottomRowButton text={t("cancel")} onClick={() => context.setCurrentStep(0)} colorHover={"red-600"} colorIdle={"red-500"}/>
                <BottomRowButton text={t("proceed")} onClick={() => context.next()} colorHover={"green-600"} colorIdle={"green-600"}/>
            </div>
        </div>
    );
}
