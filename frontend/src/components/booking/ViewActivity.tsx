import "../../index.css";
import { useContext, useState } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { CancelButton } from "./BookingFlowManager.tsx";
import { t } from "i18next";

export function ViewActivity() {
    const {selectedActivity, prev, next} = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
                <span
                    className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
                  {t("step2_title")}
                </span>
            </Header>
            <div className="rounded-4xl bg-white/50 flex-1 overflow-auto">
                <div>
                    <div className="w-full flex flex-col gap-6">
                        <div>
                            <div className="w-full h-[20vh] max-h-[20vh] overflow-hidden rounded-xl">
                                <img
                                    className="w-full h-full object-cover object-center"
                                    src={`data:image/png;base64, ${selectedActivity?.hero}`}
                                    style={{ imageRendering: "pixelated" }}
                                    alt={selectedActivity?.title ?? "activity image"}
                                />
                            </div>
                        </div>

                        <div className="text-gray-800 ml-5 mr-5">
                            <h1 className="text-8xl font-semibold mb-5">{selectedActivity?.title}</h1>

                            <div className="text-5xl font-semibold text-gray-700 mb-5">{selectedActivity?.subtitle}</div>

                            <div className="text-4xl mb-5">{selectedActivity?.description}</div>

                            <div className="text-4xl mb-5">{t("max_participants", {capacity: selectedActivity?.capacity})}</div>

                            <div className="text-4xl mb-5">{t("location_label", {location: selectedActivity?.location})}</div>

                            <div className="text-4xl mb-5">{t("min_age_note", {minage: selectedActivity?.minage})}</div>

                            <div className="text-4xl mb-1">{t("price_per_ticket", {price: selectedActivity?.price})}</div>
                        </div>

                        <div className="mt-6">
                            <Reserveren price={selectedActivity?.price}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-row flex w-full items-center justify-between">
                <CancelButton/>
                <div>
                    <button
                        className="hover:underline hover:cursor-pointer rounded-xl py-3 px-5 bg-green-600 hover:bg-green-700 focus:outline-none text-4xl mr-3 text-white"
                        onClick={prev}>
                        {t("back_to_list")}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Reserveren({ price }: { price?: number }) {
  const [count, setCount] = useState(1);
  const context = useContext(Context);
  if (!price) return null;

    return (
      <div className="p-4 w-full">
      <h1 className="text-center text-5xl font-semibold mb-3">
        Voor hoeveel mensen wil u reserveren?
      </h1>

      <div className="flex items-center justify-evenly">
        <button
          type="button"
          className="w-full h-40 flex items-center justify-center bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors text-6xl"
          onClick={() => setCount(c => Math.max(1, c - 1))}
        >
          -
        </button>

        <div className="mx-15 abolute min-w-10 text-center flex items-center justify-center text-6xl font-bold text-gray-800">{count}</div>

        <button
          type="button"
          className="w-full h-40 flex items-center justify-center bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors text-6xl"
          onClick={() => setCount(c => c + 1)}
        >
          +
        </button>

      </div>
      
      <div className="flex items-center justify-center">
        <div className="text-5xl mt-5 text-center font-bold text-gray-800 min-w-70">Totaalprijs €{count * price}</div>
        <button
          type="button"
          className="mt-3 w-full h-40 flex items-center justify-center bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors text-6xl"
          onClick={
            () => {
              context.next()
            }
          }
        >
          Reserveer nu!
        </button>
        
      </div>
    </div>
  );
}
