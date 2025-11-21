import "../index.css";
import {useQuery} from "@tanstack/react-query";
import {BACKEND} from "../App.tsx";
import {useState} from "react";


function DetailsModal() {
	return (
		<div className="border">

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
			{showModal ? <DetailsModal/> : null}
			<ul>{acitvityItems}</ul>
		</>

	);

}