import "../index.css";
import {useQuery} from "@tanstack/react-query";
import {BACKEND} from "../App.tsx";
import {useState} from "react";
import { Icon } from '@iconify/react';


function DetailsModal({ open, onClose }) {
	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-auto"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-xl font-semibold mb-4">Details</h2>

				<div className="mb-6">
				</div>
				<div>
					<div className="border rounded-md p-4 mb-4 flex items-center gap-3 bg-gray-50">
						<div className="text-sm text-gray-700">
							Kleine extra informatie of korte omschrijving hier.
						</div>
					</div>
				</div>

				<button
					onClick={onClose}
					className="px-4 py-2 bg-blue-600 text-white rounded-xl"
				>
					<Icon icon="tdesign:close-circle" width="24" height="24" />
				</button>
			</div>
		</div>
	)
}

export function ActivitiesList() {
	const [showModal, setModal] = useState(false);
	const { isPending, error, data } = useQuery({
		queryKey: ['activities'],
		queryFn: () =>
			BACKEND.activities.get().then(r => r.data),
	})


	if (isPending) return 'Laden...'

	if (error) return 'Fout: ' + error.message


	const acitvityItems = data.map((activiteit) =>
		<div className="flex flex-col bg-white shadow-md rounded-lg p-6 w-96">
			<ul>
				<li className="mb-4">
					<h3 className="text-xl font-semibold">{activiteit.title}</h3>
					<p className="text-gray-600">{activiteit.subtitle}</p>
				</li>
			</ul>
			<button onClick={
				() => {
					setModal(true)
				}
			} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-20 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Meer info</button>
		</div>
	);

	return (
		<>
			{showModal ? <DetailsModal open={open} onClose={() => setModal(false)} /> : null}
			<ul>{acitvityItems}</ul>
		</>

	);

}