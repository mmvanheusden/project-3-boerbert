import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import {CancelButton} from "./BookingFlowManager.tsx";

export function BetaalMethode() {
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
                                <h1 className="text-5xl font-bold mb-30">
                                    Selecteer betaalmethode
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
