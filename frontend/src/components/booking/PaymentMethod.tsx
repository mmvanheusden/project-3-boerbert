import "../../index.css";
import { useContext } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import { BottomRowButton } from "./BookingFlowManager.tsx";
import { t } from "i18next";

export function PaymentMethod() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg bg-green-600 px-4 md:px-8 mb-1 font-semibold text-3xl md:text-5xl text-white">
              {t("choose_payment_method")}
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                    <div className="w-full h-full overflow-auto flex flex-col justify-between items-center bg-white shadow-md rounded-lg py-4 md:py-7">
                            <div>
                                <h1 className="text-4xl md:text-8xl text-center font-bold mb-10 md:mb-30">
                                    {t("select_payment_method")}
                                </h1>
                            </div>
                            <div className="flex flex-col md:flex-row gap-5 md:gap-10 w-full justify-center items-center">
                                <div className="flex-1 flex flex-col justify-center items-center">
                                <Icon className="w-32 h-32 md:w-96 md:h-96" icon="bi:cash-coin" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center items-center">
                                <Icon className="w-32 h-32 md:w-96 md:h-96" icon="cib:ideal" />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-3 md:gap-10 w-full px-4 md:px-7 mt-5">
                                <button className="flex-1 text-3xl md:text-6xl hover:cursor-pointer px-4 md:px-15 py-6 md:py-15 text-white rounded-xl bg-green-600 hover:bg-green-700 cursor-pointer flex justify-center items-center" onClick={() => {
                                    context.selectPaymentMethod("CONTANT")
                                    context.next()
                                }}>{t("pay_cash")}</button>

                                <button className="flex-1 text-3xl md:text-6xl hover:cursor-pointer px-4 md:px-15 py-6 md:py-15 text-white rounded-xl bg-green-600 hover:bg-green-700 cursor-pointer flex justify-center items-center" onClick={() => {
                                    context.selectPaymentMethod("PIN")
                                    context.next()
                                }}>{t("pay_digital")}</button>
                            </div>
                    </div>
            </div>
            <div className="flex-row flex w-full items-center justify-between">
                <BottomRowButton text={t("cancel")} onClick={() => context.setCurrentStep(0)} colorHover={"red-600"} colorIdle={"red-500"}/>
                <BottomRowButton text={t("back_to_email")} onClick={() => context.prev()} colorHover={"orange-300"} colorIdle={"orange-400"}/>
            </div>
        </div>
        );
}
