import "../../index.css";
import { useContext } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import { BottomRowButton } from "./BookingFlowManager.tsx";
import { t } from "i18next";


export function RememberMail() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg bg-green-600 px-4 md:px-8 mb-1 font-semibold text-3xl md:text-5xl text-white">
            {t("email_updates")}
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div className="w-full h-full overflow-auto flex flex-col justify-between items-center bg-white shadow-md rounded-lg py-4 md:py-7">
                        <div className="flex flex-col justify-center items-center flex-1">
                        <h1 className="text-4xl md:text-8xl font-bold mb-6 md:mb-10 mt-3 md:mt-5 mx-5 md:mx-15 justify-center text-center">
                            {t("receive_email_updates")}
                        </h1>
                            <Icon className="mt-2 md:mt-5 cursor-pointer w-32 h-32 md:w-64 md:h-64" icon="lucide:calendar-clock" />
                        
                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            context.next()
                        }}>
                            <label className="text-4xl md:text-7xl mt-3 md:mt-5 mb-6 md:mb-10 flex">
                                <input type="email" placeholder= {t("email_placeholder")} className="outline-2 outline-offset-2 rounded-xl mt-6 md:mt-10 text-center"
                                        value={context.selectedEmail}
                                       onChange={(e) => context.selectEmail(e.target.value)}
                                />
                            </label>
                        </form>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-evenly w-full px-4 md:px-7 gap-3 md:gap-5">
                          <button
                              className="flex-1 w-full h-full text-2xl md:text-7xl hover:cursor-pointer px-4 md:px-15 py-6 md:py-15 border-black focus:outline-none text-white rounded-2xl bg-red-500 hover:bg-red-600 flex justify-center items-center"
                              onClick={() => {
                                  context.selectEmail(""); // Zorg dat we de email in de context legen.
                                  context.next();
                              }}
                          > {t("proceed_without_email_updates")}
                        </button>
                         <button
                              className={`flex-1 w-full h-full text-4xl md:text-7xl hover:cursor-pointer px-4 md:px-15 py-6 md:py-15 border-black focus:outline-none text-white rounded-2xl flex justify-center items-center ${(context.selectedEmail.includes("@") && context.selectedEmail.includes(".")) ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 pointer-events-none"}`}
                              onClick={context.next}
                          > {t("proceed")}
                        </button>
                        </div>

                </div>
            </div>


            <div className="flex-row flex w-full items-center justify-between">
                <BottomRowButton text={t("cancel")} onClick={() => context.setCurrentStep(0)} colorHover={"red-600"} colorIdle={"red-500"}/>
                <BottomRowButton text={t("back_to_campingspot")} onClick={() => context.prev()} colorHover={"orange-300"} colorIdle={"orange-400"}/>
            </div>
        </div>
    );
}
