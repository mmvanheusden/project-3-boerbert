import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import {CancelButton} from "./BookingFlowManager.tsx";


export function ActivitiesList() {
	const context = useContext(Context);

	// De kaarten met activiteiten.
	const activityItems = context.activities!.map((activiteit) =>
		<>
			<div className="flex items-center bg-white shadow-md rounded-lg p-6 w-full mb-2">
				<img className="border-2 w-100 h-60 mr-5 rounded-xl" src={`data:image/png;base64, ${activiteit.hero}`}
				     style={{imageRendering: "pixelated"}}
				></img>
				<div className="flex-col">
					<span className="text-gray-600 font-mono font-semibold text-sm select-none">ACTIVITEIT</span>
					<ul>
						<li className="mb-4">
							<h3 className="text-xl font-semibold">{activiteit.title}</h3>
							<p className="text-gray-600">{activiteit.subtitle}</p>
							<p className="text-gray-600">Let op: Vanaf {activiteit.minage} jaar oud</p>
						</li>
					</ul>
					<button onClick={
						() => {
							/*Sla de gekozen activiteit op in de context en ga naar de volgende stap. Die haalt de activiteit dan uit de context, en geeft deze weer.*/
							context.selectActivity(activiteit);
							console.log(context.selectedActivity)
							context.next()
						}
					} type="button"
					        className="border-2 hover:underline hover:cursor-pointer rounded py-2 px-8 border-black bg-green-600 hover:bg-green-700 focus:outline-none text-2xl">Bekijken
					</button>
				</div>
			</div>
		</>,
	);

	return (
		<>
			<Header>
					<span
						className="select-none rounded-t-lg border-2 border-black bg-green-600 px-4 mb-1 font-semibold text-3xl">
						Stap 1: Kies een activiteit
					</span>
			</Header>
			<ul>{activityItems}</ul>

			<div className="flex justify-end">
				<CancelButton/>
			</div>
		</>

	);

}