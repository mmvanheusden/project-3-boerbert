import "../../index.css";
import { useContext } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import {BACKEND} from "../../App.tsx";
import dayjs from "dayjs";
import i18n from "../../i18n/config.ts";

export function PaymentStatus() {
    const context = useContext(Context);

    return (<div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg bg-green-600 px-4 md:px-8 mb-1 font-semibold text-3xl md:text-5xl text-white">
              {t("payment_status")}
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div
                    className="w-full h-full overflow-auto flex flex-col justify-between items-center bg-white shadow-md rounded-lg py-4 md:py-7">
                    <div className="flex flex-col justify-center items-center flex-1">
                    <h1 className="text-4xl md:text-8xl font-bold mb-6 md:mb-10 mt-3 md:mt-5 text-center">
                        {t("payment_successful")}
                    </h1>
                    <Icon className="mt-5 md:mt-10 cursor-pointer w-48 h-48 md:w-[600px] md:h-[600px]" icon="streamline-ultimate-color:check" />
                    </div>
                        <div className="w-full px-4 md:px-7">
                <button
                    className="hover:cursor-pointer py-4 md:py-7 w-full bg-green-600 hover:bg-green-700 rounded-xl text-4xl md:text-8xl text-white flex justify-center items-center"
                    onClick={async () => {
                        // HIER BOEKEN WE DE ACTIVITEIT FR!!1!1!!1!!
                        await BACKEND.bookings.put({
                            slotId: context.selectedSlot!.id,
                            amount: context.selectedAmount,
                            campingSpot: context.selectedCampingSpot,
                            email: context.selectedEmail === "" ? null : context.selectedEmail,
                        })
                        context.setCurrentStep (0)
                    }}
                > {t("finish_booking")}</button>
            </div>
                </div>
                        


            </div>

        </div>
    );
}

export function BookingDetails() {
	const context = useContext(Context);
	return(
		<>
		<div className="text-xl md:text-5xl flex flex-col gap-1 md:gap-3">
			<p><b>{t("activity")}: </b> {context.selectedActivity?.title[i18n.language as "en" | "de" | "nl"]}</p>
			<p><b>{t("datetime")}: </b> {dayjs(context.selectedSlot!.date).locale("nl").format("dddd D[ ]MMMM[ om ]HH:mm")}</p>
			<p><b>{t("location")}: </b>{context.selectedActivity?.location[i18n.language as "en" | "de" | "nl"]}</p>
			<p><b>{t("minimum_age")}: </b>{context.selectedActivity?.minage}</p>
			<p><b>{t("selected_amount")}: </b> {context.selectedAmount === 1 ? t("person") : t("selected_amount_persons", {amount: context.selectedAmount})}	</p>
			<p><b>{t("price_sum")}: </b>€ {context.selectedPrice!.toFixed(2).dot2comma().replace(",00", ",-")}</p>
		</div>
		</>
	)
}