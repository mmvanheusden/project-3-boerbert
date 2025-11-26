import "../../index.css";
import {BACKEND} from "../../App.tsx";
import {useContext, useState} from "react";
import {Icon} from '@iconify/react';
import type {Treaty} from "@elysiajs/eden";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";


interface DetailsModalProps {
	onClose: () => void,
}


export function ActivitiesList() {
	const [showModal, setModal] = useState(false);
	const [modalActivity, setModalActivity] = useState<Treaty.Data<typeof BACKEND.activities.get>[0]>(); // Hierin staat welke activiteit er weergegeven zou moeten worden voor de modal.
	const context = useContext(Context);

	// Het modal dat de details van de activiteit laat zien.
	function DetailsModal({onClose}: DetailsModalProps) {
		return (
			<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-auto" onClick={onClose}>
				<div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
					<h1 className="text-xl font-semibold mb-4">{modalActivity?.title}</h1>
					<div className="border rounded-md p-4 mb-4 flex items-center gap-3 bg-gray-50">
						<div className="text-sm text-gray-700">
							{modalActivity?.subtitle}
							<div>
								Beschrijving: {modalActivity?.description}
							</div>
							<div>
								<span>Prijs: {modalActivity?.price}</span>
							</div>
							<div>
								<span>locatie:</span>
							</div>
							<div>
								<span>aantal personen: {modalActivity?.capacity}</span>
							</div>
						</div>
					</div>
					<button onClick={onClose} className="px-4 py-2 bg-white text-white rounded-xl">
						<Icon icon="tdesign:close-circle" width="24" height="24"/>
					</button>
				</div>
			</div>
		)
	}

	// De kaarten met activiteiten.
	const activityItems = context.activities!.map((activiteit) =>
		<>
			{showModal ? <DetailsModal onClose={() => setModal(false)}/> : null}
			<div className="flex flex-col bg-white shadow-md rounded-lg p-6 w-full mb-2">
				<span className="text-gray-600 font-mono font-semibold text-sm select-none">ACTIVITEIT</span>
				<ul>
					<li className="mb-4">
						<h3 className="text-xl font-semibold">{activiteit.title}</h3>
						<p className="text-gray-600">{activiteit.subtitle}</p>
					</li>
				</ul>
				<button onClick={
					() => {
						setModal(true)
						setModalActivity(activiteit)
					}
				} type="button" className="text-white bg-green-700 hover:bg-green-900 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-20 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">Meer info</button>
			</div>
		</>,
	);

	return (
		<>
			<Header>
					<span
						className="select-none rounded-t-lg border-2 border-white bg-green-600 px-4 mb-1 font-medium text-2xl">
						Stap 1: Kies een activiteit
					</span>
			</Header>
			<ul>{activityItems}</ul>
		</>

	);

}