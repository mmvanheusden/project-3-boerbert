import "../../index.css";
import { useContext } from "react";
import Context from "./Context.tsx";
import { EvilHeader } from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import { BottomRowButton } from "./BookingFlowManager.tsx";
import { t } from "i18next";

export function Evil() {
    const context = useContext(Context);

    return (
        <div className="bg-gray-900/90 border-2 h-full border-gray-800 p-4 rounded-3xl select-none">
            <div className="flex flex-col gap-3 h-full">
            <style>{`
                body {
                    background: url(/evil.jpg); !important
                }`}
            </style>
            <EvilHeader>
            <span
                className="select-none rounded-t-lg bg-red-600 px-8 mb-1 font-semibold text-5xl text-white">
              {t("choose_payment_method")}
            </span>
            </EvilHeader>
            <div className="flex-1 overflow-auto">
                    <div className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-black shadow-md rounded-lg">
                            <div>
                                <h1 className="text-8xl font-bold">
                                    {t("select_payment_method")}
                                </h1>
                            </div>

                            <div  className="text-red-600 text-7xl mt-20 ">
                                EVIL BERT CURSES U
                            </div>
                            <div className="">
                                <img src="./evilbert.png" className="scale-85"/>
                            </div>
                            
                    </div>
            </div>
            <div className="flex-row flex w-full items-center justify-between">
                <BottomRowButton text={t("cancel")} onClick={() => context.setCurrentStep(0)} colorHover={"red-600"} colorIdle={"red-500"}/>
            </div>
        </div>
        </div>
        
        );
}






