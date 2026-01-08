import "../../index.css";
import { useContext } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { CancelButton } from "./BookingFlowManager.tsx";
import { t } from "i18next";
import i18n from "../../i18n/config.ts";
import dayjs from "dayjs";

export function ViewActivity() {
    const {selectedActivity, prev, selectedAmount} = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
                <span
                    className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
                  {t("step2_title")}
                </span>
            </Header>
            <div className="rounded-4xl bg-white/50 flex-1 overflow-auto">
                <div className="p-5">
                    <div className="w-full flex flex-col gap-6">
                        <div>
                            <div className="w-full h-[20vh] max-h-[20vh] overflow-hidden rounded-xl">
                                <img
                                    className="w-full h-full object-cover object-center"
                                    src={`data:image/png;base64, ${selectedActivity?.hero}`}
                                    style={{ imageRendering: "pixelated" }}
                                    alt={selectedActivity?.title[i18n.language as "en" | "de" | "nl"] ?? "activity image"}
                                />
                            </div>
                        </div>

                        <div className="text-gray-800">
                            <h1 className="text-8xl font-semibold mb-5">{selectedActivity?.title[i18n.language as "en" | "de" | "nl"]}</h1>
                            <div className="text-5xl font-semibold text-gray-700 mb-5">{selectedActivity?.subtitle[i18n.language as "en" | "de" | "nl"]}</div>
                            <div className="text-4xl mb-5">{selectedActivity?.description[i18n.language as "en" | "de" | "nl"]}</div>
                            <div className="text-4xl mb-5">{t("max_participants", {capacity: selectedActivity?.capacity})}</div>
                            <div className="text-4xl mb-5">{t("location_label", {location: selectedActivity?.location[i18n.language as "en" | "de" | "nl"]})}</div>
                            <div className="text-4xl mb-5">{t("min_age_note", {minage: selectedActivity?.minage})}</div>
                            <div className="text-4xl mb-1">{t("price_per_ticket", {price: selectedActivity?.price})}</div>
                        </div>

                        <div>
                            <div className="text-5xl font-semibold text-gray-700">Selecteer een tijdslot</div>
                            <hr></hr> 
                            <SlotSelector selectedAmount={selectedAmount}/>
                        </div>

                        <div>
                            <Aantalmensen selectedAmount={selectedAmount}/>
                        </div>

                        <div>
                            <Reserveren price={selectedActivity?.price!} />
                        </div>

                        
                    </div>
                </div>
            </div>
            <div className="flex-row flex w-full items-center justify-between">
                <CancelButton/>
                <div>
                    <button
                        className="hover:cursor-pointer rounded-xl py-3 px-5 bg-orange-400 hover:bg-orange-300 focus:outline-none text-4xl mr-3 text-white"
                        onClick={prev}>
                        {t("back_to_list")}
                    </button>
                </div>
            </div>
        </div>
    ); 
}

function SlotSelector({selectedAmount}: {selectedAmount: number}) {
    const {selectedActivity, selectSlot, selectedSlot} =  useContext(Context);

    return (
        <div className="flex flex-row space-x-3 py-3 px-2 scroll-my-6 overflow-x-auto text-xl scroll-py-5">
            {selectedActivity?.slots
            .sort((slot, nextSlot) => dayjs(slot.date).isAfter(dayjs(nextSlot.date)) ? 1 : -1) // Sorteer de datums
            .filter((slot) => dayjs(slot.date).isAfter(dayjs())) // Slot moet na nu zijn.
            .map((slot) => (
                <div
                    className={`border-2 rounded-md min-h-50 text-nowrap px-1.5 w-fit hover:cursor-pointer transition flex flex-col ${(selectedSlot?.id == slot.id) && "bg-green-500 scale-103"}`}
                    onClick={() => selectSlot({
                        id: slot.id,
                        activityId: selectedActivity?.id,
                        date: slot.date,
                        duration: slot.duration
                    })}
                >
                    <div className="flex-1">
                        <div className="h-full w-full">
                            <div>
                                <p>{dayjs(slot.date).locale("nl").format("dddd D[ ]MMM[ om ]HH:mm")}</p>
                                <hr></hr>
                            </div>
                            <p><b>Tijdsduur: </b>{slot.duration} uur</p>

                        </div>
                    </div>
                    <div className="">
                        {(selectedSlot?.id == slot.id) && <p className="text-blue-700">Na reserveren nog {selectedActivity.capacity - slot.bookings - selectedAmount} plekken beschikbaar</p>}
                        <p className="text-3xl flex justify-end font-bold">
                            {(selectedActivity.capacity - slot.bookings)} / {selectedActivity.capacity}
                        </p>
                    </div>
                </div>

            ))}
        </div>
    )
}

function Reserveren({ price }: { price: number | undefined }) {
  const context = useContext(Context);
  if (!price) return null;

    return (
      <div className="items-center justify-center">
        <div className="text-5xl mb-10 text-center font-bold text-gray-800 min-w-70">Totaalprijs €{context.selectedAmount * price}</div>

        <button
          type="button"
          className="w-full h-40 flex items-center justify-center bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors text-6xl"
          onClick={
            () => {
                context.selectPrice(context.selectedAmount * price);
                context.next()
            }
          }   
        >
          Reserveer nu!
        </button>
      </div>
)}

function Aantalmensen({ selectedAmount }: { selectedAmount: number | undefined }) {
  const context = useContext(Context);
  if (!selectedAmount) return null;

    return (
      <div className="p-4 w-full">
      <h1 className="text-center text-5xl font-semibold mb-10">
        Voor hoeveel mensen wil u reserveren?
      </h1>

      <div className="flex items-center justify-evenly">
        <button
          type="button"
          className="w-full h-40 flex items-center justify-center bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors text-6xl"
          onClick={() => context.selectAmount(Math.max(1, context.selectedAmount! - 1))}
        >
          -
        </button>

        <div className="mx-15 abolute min-w-10 text-center flex items-center justify-center text-6xl font-bold text-gray-800">{context.selectedAmount}</div>

        <button
          type="button"
          className={`w-full h-40 flex items-center justify-center bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors text-6xl ${context.selectedSlot != null && (context.selectedActivity!.capacity - context.selectedActivity!.slots.find((slot) => slot.id == context.selectedSlot!.id).bookings) <= context.selectedAmount! ? "bg-red-500 pointer-events-none"  : null}`}
          onClick={() => context.selectAmount(context.selectedAmount! + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}