import "../../index.css";
import {useContext, useState} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import {CancelButton} from "./BookingFlowManager.tsx";

export function ViewActivity() {
    const {selectedActivity, prev} = useContext(Context);

    return (<>
        <Header>
            <span
                className="select-none rounded-t-lg border-2 border-black bg-green-600 px-4 mb-1 font-semibold text-3xl -translate-y-4">
              Stap 2: Bekijk activiteitdetails
            </span>
        </Header>

        <div className="w-full overflow-auto">
            <div className="w-full flex gap-6 bg-white shadow-md rounded-lg p-6 mb-2">
                <div className="text-sm text-gray-800 flex-1">
                    <h1 className="text-2xl font-semibold mb-2">
                        {selectedActivity?.title}
                    </h1>
                    <div className="font-semibold mb-2 text-gray-700">
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
                    <div>
                        <Reserveren price={selectedActivity?.price}/>
                    </div>
                </div>
                <img
                    className="w-[50%] min-h-[40vh] object-cover rounded-xl flex-shrink-0"
                    src={`data:image/png;base64, ${selectedActivity?.hero}`}
                    style={{imageRendering: "pixelated"}}
                    alt={selectedActivity?.title ?? "activity image"}
                />
            </div>
        </div>

        <div className="inline-flex w-full items-center justify-between">
            <button
                className="border-2 hover:underline hover:cursor-pointer rounded py-3 px-5 border-black bg-green-600 hover:bg-green-700 focus:outline-none text-2xl mr-5"
                onClick={prev}>
                Terug naar activiteitenlijst
            </button>
            <CancelButton/>
        </div>
    </>);
}

function Reserveren({price}: {price?: number}) {
  const [count, setCount] = useState(1);
  if (!price) return null;

  return (
    <div className="bg-white border border-black p-4 rounded-md w-full mx-auto">
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

        <div className="w-300 text-center text-6xl font-bold text-gray-800">{count}</div>

        <button
          type="button"
          className="w-full h-30 flex items-center justify-center bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors text-6xl"
          onClick={() => setCount(c => c + 1)}
        >
          +
        </button>
      
        </div>
        <div className="w-300 text-center text-lg font-bold text-gray-800">Totaalprijs: € {count*price}</div>
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
