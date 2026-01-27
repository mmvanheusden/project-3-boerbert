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
                className="select-none rounded-t-lg bg-green-600 px-4 md:px-8 mb-1 font-semibold text-3xl md:text-5xl text-white">
              Betalingsstatus
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div
                    className="w-full h-full overflow-auto flex flex-col items-center bg-white shadow-md rounded-lg p-4 md:p-10">
                    <div className="mb-6 md:mb-10 mt-3 md:mt-5">
                        <h1 className="text-3xl md:text-5xl font-bold">
                            Uw boeking is successvol!
                        </h1>
                        <b className="text-center text-2xl md:text-4xl">Boekingsdetails:</b>
                        <hr className="my-2 md:my-4"></hr>
                        <BookingDetails/>
                    </div>
                    <Icon className="mt-5 md:mt-10 cursor-pointer w-32 h-32 md:w-64 md:h-64" icon="streamline-ultimate-color:check" />
                </div>

            </div>
            <div className="flex justify-end">
                <BottomRowButton text={t("back_to_start")} onClick={() => context.setCurrentStep(0)} colorHover={"green-500"} colorIdle={"green-600"}/>
            </div>
        </div>
    );
}
