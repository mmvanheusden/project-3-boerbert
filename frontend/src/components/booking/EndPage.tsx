import "../../index.css";
import { useContext } from "react";
import Context from "./Context.tsx";
import { BookingDetails, Header } from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import { BACKEND } from "../../App.tsx";
import { BottomRowButton } from "./BookingFlowManager.tsx";
import { t } from "i18next";


export function Endpage() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
              Betalingsstatus
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div
                    className="w-full h-full overflow-auto flex flex-col items-center bg-white shadow-md rounded-lg">
                    <div className="mb-10 mt-5">
                        <h1 className="text-5xl font-bold">
                            Uw boeking is successvol!
                        </h1>
                        <b className="text-center text-4xl">Boekingsdetails:</b>
                        <hr></hr>
                        <BookingDetails/>
                    </div>
                    <Icon className="mt-10  cursor-pointer" icon="streamline-ultimate-color:check" width="300" height="300"/>
                </div>

            </div>
            <div className="flex justify-end">
                <BottomRowButton text={t("back_to_start")} onClick={() => context.setCurrentStep(0)} colorHover={"green-500"} colorIdle={"green-600"}/>
            </div>
        </div>
    );
}
