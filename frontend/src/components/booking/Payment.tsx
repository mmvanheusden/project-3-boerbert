import "../../index.css";
import { useContext, useRef, useEffect } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { Girocode } from "react-girocode";
import { Icon } from "@iconify/react";
import { BottomRowButton } from "./BookingFlowManager.tsx";
import { t } from "i18next";

export function Payment() {
    const context = useContext(Context);

   

    const cash = "cash sound-effect.mp3";

    const audioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        audioRef.current = new Audio(cash);
        audioRef.current.preload = "auto";
        audioRef.current.volume = 0.7;
        return () => {
            audioRef.current = null;
        };
    }, [cash]);

    function playClickSound() {
        try {
            if (!audioRef.current) return;
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        } catch {
            /* silent fallback */
        }
    }

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
                <span
                    className="select-none rounded-t-lg bg-green-600 px-4 md:px-8 mb-1 font-semibold text-3xl md:text-5xl text-white">
                    Betaling
                </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div
                    className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-4 md:p-10">

                    {(() => {
                        switch (context.selectedPaymentMethod) {
                            case "PIN":
                                return <div className="text-center">
                                    <h1 className="text-4xl md:text-7xl font-bold mb-10 md:mb-70">
                                        {t("scan_qrcode")}
                                    </h1>
                                    <div className="scale-125 md:scale-250 inline-block py-10">
                                        <Girocode recipient="Camping Boer Bert" iban="NL50 INGB 0756 5719 60" amount={context.selectedPrice} />
                                    </div>
                                </div>
                            case "CONTANT":
                                return <div className="text-center">
                                    <h1 className="text-4xl md:text-8xl font-bold mb-6 md:mb-10 mt-3 md:mt-5">
                                        {t("proceed_at_counter")}
                                    </h1>
                                </div>
                        }
                    })()}


                    {(() => {
                        switch (context.selectedPaymentMethod) {
                            case "PIN":
                                return <>
                                    <h1 className="font-bold text-3xl md:text-6xl mt-10 md:mt-60">
                                        <p><b>{t("price_sum")}: € </b> {context.selectedPrice!.toFixed(2).dot2comma().replace(",00", ",-")}</p>
                                    </h1>
                                        <button
                                            className={`mt-6 md:mt-10 text-4xl md:text-7xl hover:cursor-pointer px-8 md:px-15 py-6 md:py-15 border-black focus:outline-none text-white rounded-xl bg-green-600`}
                                            onClick={() => { playClickSound(); context.next(); }}
                                            >
                                        {t("proceed")}
                                        </button>
                                </>
                            case "CONTANT":
                                return <><Icon className="mt-5 md:mt-10 w-48 h-48 md:w-[600px] md:h-[600px]" icon="bi:cash-coin" />
                                    <h1 className="font-bold text-3xl md:text-6xl mt-10 md:mt-20">
                                        <p><b>{t("price_sum")}: € </b> {context.selectedPrice!.toFixed(2).dot2comma().replace(",00", ",-")}</p>
                                    </h1>
                                    <label className="text-4xl md:text-7xl mt-3 md:mt-5 mb-6 md:mb-10 flex justify-center">
                                        <input type="number"  inputMode="numeric" placeholder= {t("verification")} className="outline-2 outline-offset-2 rounded-xl mt-6 md:mt-10 text-center"
                                               value={context.selectedCode}
                                               onChange={(e) => context.selectCode(e.target.value)}
                                        />
                                    </label>
                                    <button
                                        className={`mt-6 md:mt-10 text-4xl md:text-7xl hover:cursor-pointer px-8 md:px-15 py-6 md:py-15 border-black focus:outline-none text-white rounded-xl ${(context.selectedCode == null || context.selectedCode != "6767"  ) ? "bg-gray-500 pointer-events-none" : "bg-green-600"}`}
                                        onClick={() => { if (context.selectedCode != null && context.selectedCode === "6767") { playClickSound(); context.next(); } }}
                                    >
                                        {t("proceed")}
                                    </button>
                                    </>
                        }
                    })()}
                </div>
            </div>
            <div className="flex-row flex w-full items-center justify-between">
                <BottomRowButton text={t("cancel")} onClick={() => context.setCurrentStep(0)} colorHover={"red-600"} colorIdle={"red-500"}/>
                <BottomRowButton text={t("back_to_paymentmethod")} onClick={() => context.prev()} colorHover={"orange-300"} colorIdle={"orange-400"}/>
            </div>

        </div>
    );
}
