import "../../index.css";
import { useContext } from "react";
import { Icon } from "@iconify/react";
import Context from "./Context.tsx";
import { Header } from "../KleineDingetjes.tsx";

export function ViewActivity() {
  const { selectedActivity, prev } = useContext(Context);

  return (
    <>
      <Header>
        <span className="select-none rounded-t-lg border-2 border-white bg-green-600 px-4 mb-1 font-semibold text-3xl">
          Stap 2: Bekijk activiteitdetails
        </span>
      </Header>

      <div
        className="w-full shadow-xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-xl font-semibold mb-4">
          {selectedActivity?.title}
        </h1>

        <div className="border rounded-md p-4 mb-4 bg-gray-50">
          <div className="inline-flex items-start gap-6 bg-white shadow-md rounded-lg p-6 mb-2">
            
            <div className="text-sm text-gray-700 max-w-[60%]">
              <div className="font-semibold mb-2">
                {selectedActivity?.subtitle}
              </div>

              <div className="mb-2">{selectedActivity?.description}</div>

              <div className="mb-1">€ {selectedActivity?.price} per kaartje</div>
              <div className="mb-1">
                Maximaal aantal deelnemers: {selectedActivity?.capacity}
              </div>
              <div className="mb-1">
                Locatie: {selectedActivity?.location}
              </div>
              <div className="mb-1">
                Let op: Vanaf {selectedActivity?.minage} jaar oud
              </div>
            </div>

            <img
              className="w-48 h-40 object-cover rounded-xl border-2"
              src={`data:image/png;base64, ${selectedActivity?.hero}`}
              style={{ imageRendering: "pixelated" }}
              alt={selectedActivity?.title ?? "activity image"}
            />

          </div>
        </div>

        <button onClick={prev} className="px-4 py-2 bg-green-50 text-black rounded-xl">
          <Icon icon="tdesign:close-circle" width="24" height="24" color="black" />
        </button>
      </div>
    </>
  );
}
