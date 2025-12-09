import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import {CancelButton} from "./BookingFlowManager.tsx";

export function Payment() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg border-2 border-black bg-green-600 px-4 mb-1 font-semibold text-3xl -translate-y-4">
              Stap 3: Selecteer betaalmethode
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div
                    className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg">
                    <span>Gekozen betaalmethode: {context.selectedPaymentMethod}</span>
                    <div className="text-center">
                        <h1 className="text-5xl font-bold">
                            Scan je betaalpas
                        </h1>
                        <h1 className="text-3xl font-bold">
                            Volg de instructies op de automaat
                        </h1>
                    </div>
                    <Icon className="mt-10 border-7 rounded-full border-black cursor-pointer" icon="iconoir:hand-card" width="300" height="300"/>
                </div>
            </div>
            <div className="flex">
                <CancelButton/>
            </div>
        </div>
    );
}
