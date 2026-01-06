import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import {CancelButton} from "./BookingFlowManager.tsx";


export function LogIn() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
              Geef uw campingplaats door
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg">
                        <h1 className="text-5xl font-bold mb-10 mt-5">
                            Wilt u updates ontvangen?
                        </h1>

                        <h1 className="text-2xl  mt-2">
                            Voer hier uw mail in om updates te ontvangen over de activiteiten
                        </h1>
                        <Icon className="mt-5  cursor-pointer" icon="lucide:calendar-clock" width="300" height="300"/>

                        <form>
                            <label>
                                Mail: <input type="text" className="outline mt-10"/>
                            </label>
                        </form>
                </div>

                

            </div>
            <div className="flex">
                <CancelButton/> 

                <button
                              className={`text-5xl hover:underline hover:cursor-pointer py-3 px-10 border-black focus:outline-none text-white rounded-xl ${(context.activities != null && context.activities.length == 0) ? "disabled bg-red-500 pointer-events-none" : "bg-green-600 hover:bg-green-700"}`}
                              onClick={context.next}
                          > Verder
                          </button>
            </div>
        </div>
    );
}
