import "../../index.css";
import { useContext, useState } from "react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";
import { CancelButton } from "./BookingFlowManager.tsx";
import { t } from "i18next";

export function ViewActivity() {
    const {selectedActivity, prev, next} = useContext(Context);

  return (
    <>
      <Header>
        <span
          className="select-none rounded-t-lg border-2 border-black bg-green-600 px-4 mb-1 font-semibold text-3xl -translate-y-4">
          {t("step2_title")}
        </span>
      </Header>

      <div className="">
        <div className="bg-white shadow-md rounded-lg p-6 mb-2">
           <div className="grid grid-cols-3 gap-6">
            <div>
              <img
                className="w-full h-auto object-cover rounded-xl border-2"
                src={`data:image/png;base64, ${selectedActivity?.hero}`}
                style={{ imageRendering: "pixelated" }}
                alt={selectedActivity?.title ?? "activity image"}
              />
            </div>

            <div className="col-span-2 flex flex-col justify-between">
              <div className="text-sm text-gray-800">
                <h1 className="text-2xl font-semibold mb-2">{selectedActivity?.title}</h1>

                <div className="font-semibold mb-2 text-gray-700">{selectedActivity?.subtitle}</div>

                <div className="mb-2">{selectedActivity?.description}</div>

                <div className="mb-1">{t("max_participants", { capacity: selectedActivity?.capacity })}</div>

                <div className="mb-1">{t("location_label", { location: selectedActivity?.location })}</div>

                <div className="mb-1">{t("min_age_note", { minage: selectedActivity?.minage })}</div>

                <div className="mb-1">{t("price_per_ticket", { price: selectedActivity?.price })}</div>
              </div>

              <div className="mt-6 max-w-xs">
                <Reserveren price={selectedActivity?.price} />
              </div>
            </div>
          </div>
        </div>

        <div className="inline-flex w-full items-center justify-between">
            <button
                className="border-2 hover:underline hover:cursor-pointer rounded py-3 px-5 border-black bg-green-600 hover:bg-green-700 focus:outline-none text-2xl mr-5"
                onClick={prev}>
                {t("back_to_list")}
            </button>
            <button
                className="border-2 hover:underline hover:cursor-pointer rounded py-3 px-5 border-black bg-green-600 hover:bg-green-700 focus:outline-none text-2xl mr-5"
                onClick={next}>
                Betalen
            </button>
            <CancelButton/>
        </div>
      </div>
    </>
  );
}

function Reserveren({ price }: { price?: number }) {
  const [count, setCount] = useState(1);
  const context = useContext(Context);
  if (!price) return null;

  return (
    <div className="bg-white border border-black p-4 rounded-md w-full">
      <h1 className="text-center text-xl font-semibold mb-3">
        Voor hoeveel mensen wil u reserveren?
      </h1>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          className="w-full h-30 flex items-center justify-center bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition-colors text-6xl"
          onClick={() => setCount(c => Math.max(1, c - 1))}
        >
          -
        </button>

        <div className="text-center text-6xl font-bold text-gray-800">{count}</div>

        <button
          type="button"
          className="w-full h-30 flex items-center justify-center bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors text-6xl"
          onClick={() => setCount(c => c + 1)}
        >
          +
        </button>

      </div>
      <div className="text-center text-lg font-bold text-gray-800">Totaalprijs: € {count * price}</div>
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          className="mt-3 w-full h-30 flex items-center justify-center bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors text-6xl"
          onClick={
            () => {
              context.next()
              // Hier zou je de reserveringslogica toevoegen
            }
          }
        >
          Reserveer nu!
        </button>

      </div>
    </div>
  );
}
