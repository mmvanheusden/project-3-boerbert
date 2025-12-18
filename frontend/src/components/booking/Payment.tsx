import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import { Girocode } from "react-girocode";
import { Icon } from "@iconify/react";
import {CancelButton} from "./BookingFlowManager.tsx";


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
                    <span>Gekozen betaalmethode: {context.selectedPaymentMethod}</span>
                    
                    
                    {(() => {
                        switch (context.selectedPaymentMethod) {
                            case "PIN" :
                                return <div className="text-center">
                        <h1 className="text-5xl font-bold mb-10">
                            Scan De QR Code AUB
                        </h1>
                                    <div className="inline-flex">
                                    <Girocode recipient="Camping Boer Bert" iban="NL50 INGB 0756 5719 60" amount={context.selectedPrice}/>
                                    </div>


                                </div>
                            case "CONTANT" :
                                return <div className="text-center">
                        <h1 className="text-5xl font-bold mb-10 mt-5">
                            Ga verder bij de balie
                        </h1>
                        <h1 className="text-3xl font-bold">
                            U krijgt daar uw bon
                        </h1>
                    </div>
                        }
                    })()}
                    
                    
                    {(() => {
                        switch (context.selectedPaymentMethod) {
                            case "PIN":
                                return <>
                                    <h1 className="font-bold text-3xl">
                                       TOT {context.selectedPrice}.00 EUR
                                    </h1>
                                    <Icon className="mt-10 border-7 rounded-full border-black cursor-pointer" icon="iconoir:hand-card" width="300" height="200"/>
                                    </>
                            case "CONTANT":
                                return <Icon className="mt-10 border-7 rounded-full border-black cursor-pointer" icon="streamline-cyber:cash-hand-4" width="300" height="300"/>
                        }
                    })()}
                </div>
            </div>
            <div className="flex">
                <CancelButton/> 

                <button
                              className={`text-5xl hover:underline hover:cursor-pointer py-3 px-10 border-black focus:outline-none text-white rounded-xl ${(context.activities != null && context.activities.length == 0) ? "disabled bg-red-500 pointer-events-none" : "bg-green-600 hover:bg-green-700"}`}
                              onClick={context.next}
                          >
                          </button>
            </div>
        </div>
    );
}
