import "../../index.css";
import { useContext } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { Girocode } from "react-girocode";
import { Icon } from "@iconify/react";
import { CancelButton } from "./BookingFlowManager.tsx";
import { t } from "i18next";

export function Payment() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
                <span
                    className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
                    Betaling
                </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div
                    className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg">

                    {(() => {
                        switch (context.selectedPaymentMethod) {
                            case "PIN":
                                return <div className="text-center">
                                    <h1 className="text-7xl font-bold mb-70">
                                        U kunt nu de QR-code scannen via uw telefooncamera
                                    </h1>
                                    <div className="scale-250 inline-flex">
                                        <Girocode recipient="Camping Boer Bert" iban="NL50 INGB 0756 5719 60" amount={context.selectedPrice} />
                                    </div>


                                </div>
                            case "CONTANT":
                                return <div className="text-center">
                                    <h1 className="text-8xl font-bold mb-10 mt-5">
                                        Ga verder bij de balie
                                    </h1>
                                    <h1 className="text-7xl font-bold mb-20">
                                        U krijgt daar uw bon
                                    </h1>
                                </div>
                        }
                    })()}


                    {(() => {
                        switch (context.selectedPaymentMethod) {
                            case "PIN":
                                return <>
                                    <h1 className="font-bold text-6xl mt-60">
                                        Totaalprijs: €{context.selectedPrice},00
                                    </h1>
                                </>
                            case "CONTANT":
                                return <><Icon className="mt-10" icon="bi:cash-coin" width="600" height="600" />
                                    <h1 className="font-bold text-6xl mt-20">
                                        Totaalprijs: €{context.selectedPrice},00
                                    </h1>
                                    </>
                        }
                    })()}
                </div>
            </div>
            <div
                className="flex-row flex w-full items-center justify-between">
                <CancelButton />
                <div>
                    <button
                        className="hover:cursor-pointer rounded-xl py-3 px-5 bg-orange-400 hover:bg-orange-300 focus:outline-none text-4xl mr-3 text-white"
                        onClick={context.prev}>
                        {t("Terug naar betaalmethode kiezen")}
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
