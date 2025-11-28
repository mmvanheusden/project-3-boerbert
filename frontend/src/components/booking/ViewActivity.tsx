import "../../index.css";
import {useContext} from "react";
import {Icon} from '@iconify/react';
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";


export function ViewActivity() {
	/*We halen de gekozen activiteit die is opgeslagen in de context in de vorige stap uit de context, en laten deze zien.*/
	const {selectedActivity, prev} = useContext(Context);

	return (<>
			<Header>
					<span
						className="select-none rounded-t-lg border-2 border-white bg-green-600 px-4 mb-1 font-semibold text-3xl">
						Stap 2: Bekijk activiteitdetails
					</span>
			</Header>
			<div className="w-full shadow-xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
				<h1 className="text-xl font-semibold mb-4">{selectedActivity?.title}</h1>
				<div className="border rounded-md p-4 mb-4 flex items-center gap-3 bg-gray-50">
					<div className="text-sm text-gray-700">
						{selectedActivity?.subtitle}
						<div>
							{selectedActivity?.description}
						</div>
						<div>
							<span>€ {selectedActivity?.price} per kaartje</span>
						</div>
						<div>
							<span>Maximaal aantal deelnemers: {selectedActivity?.capacity}</span>
						</div>
						<div>
							<span>Locatie:</span>
						</div>
						<div> 
							<img className="border-2 w-100 h-60 mr-5 rounded-xl" src={`data:image/png;base64, ${selectedActivity?.hero}`}
				     		style={{imageRendering: "pixelated"}}
							></img>
						</div>
					</div>
				</div>
				<button onClick={prev} className="px-4 py-2 bg-green-500 text-black rounded-xl">
					<Icon icon="tdesign:close-circle" width="24" height="24" color="black"/>
				</button>
			</div>
		</>
	);
}