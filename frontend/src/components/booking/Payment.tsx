import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";

export function Payment() {
    const context = useContext(Context);

    return (<>
        <Header>
            <span
                className="select-none rounded-t-lg border-2 border-black bg-green-600 px-4 mb-1 font-semibold text-3xl -translate-y-4">
              Stap 3: Selecteer betaalmethode
            </span>
        </Header>

        <div className="w-full overflow-auto">
                <div className="flex flex-col min-h-screen justify-center items-center bg-white shadow-md rounded-lg p-0 mb-2">
                    Gekozen betaalmethode: {context.selectedPaymentMethod}
                    <div>
                        <h1 className="text-5xl font-bold mb-30">
                        Scan je betaalpas
                        </h1>
                        <h1 className="text-3xl font-bold mb-30">
                        Volg de instructies op de automaat
                        </h1>
                    </div>
                    <div className="inline-flex">
                        <Icon className="ml-10 border-7 rounded-full border-black cursor-pointer" icon="iconoir:hand-card" width="300" height="300"/>
                    </div>
                </div>
        </div>

        <div className="inline-flex w-full items-center justify-between">
            <button
                className="border-2 hover:underline hover:cursor-pointer rounded py-3 px-5 border-black bg-green-600 hover:bg-green-700 focus:outline-none text-2xl mr-5"
                onClick={context.prev}>
                Afbreken
            </button>
        </div>

        
    </>);
}
