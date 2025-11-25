import { Header } from "../KleineDingetjes";
import {BACKEND} from "../../App.tsx";
import type {Treaty} from "@elysiajs/eden";
import {useQuery} from "@tanstack/react-query";
import {Provider, Context} from "./Context.ts";
import {useContext, useState} from "react";

export default function AdminPanel() {
	const [currentView, setView] = useState("Bewerker");

	const {isPending, error, data} = useQuery<Treaty.Data<typeof BACKEND.activities.get>>({
		queryKey: ['activities'],
		queryFn: () =>
			BACKEND.activities.get().then(r => r.data as Treaty.Data<typeof BACKEND.activities.get>),
	})

	if (isPending) return 'Laden...'
	if (error) return "Error"

	return (
		<Provider value={{activities: data ?? []}}>
			<Header>
				<span className="select-none rounded-t-lg border-1 bg-red-800 px-4 font-medium text-2xl">
					Beheerderspaneel: {currentView}
				</span>
				<a href="/">
					<button
						className="hover:underline ml-4 hover:ring-2 rounded border-1 cursor-pointer bg-green-200 px-2 font-medium text-2xl -translate-y-1">
						<span>
							Hoofdpagina
						</span>
					</button>
				</a>
			</Header>

			<div className="inline-flex rounded-base shadow-xs -space-x-px cursor-pointer" role="group">
				<button onClick={() => setView("Bewerker")} type="button"
						className={`rounded-l text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-neutral-tertiary-soft font-medium leading-5 rounded-e-base text-sm px-3 py-2 ${currentView == "Bewerker" ? " bg-green-300 outline-[1px]" : null}`}>
					Bewerk activiteiten
				</button>
				<button onClick={() => setView("Verwijderen")} type="button"
						className={`text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-neutral-tertiary-soft font-medium leading-5 rounded-e-base text-sm px-3 py-2 ${currentView == "Verwijderen" ? " bg-green-300 outline-[1px]" : null}`}>
					Verwijder activiteiten
				</button>
				<button onClick={() => setView("Activiteit aanmaken")} type="button"
						className={`rounded-r text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-neutral-tertiary-soft font-medium leading-5 rounded-e-base text-sm px-3 py-2 ${currentView == "Activiteit aanmaken" ? " bg-green-300 outline-[1px]" : null}`}>
					Voeg activiteiten toe
				</button>
			</div>

			{currentView == "Bewerker" ? <Editor/> : null}
			{currentView == "Verwijderen" ? <Deleter/> : null}
			{currentView == "Activiteit aanmaken" ? <Creator/> : null}
		</Provider>
	)
}

function Editor() {
	const context = useContext(Context);

	return (
		<div>
			Hier kan je activiteiten bewerken.
		</div>
	)
}

function Deleter() {
	const context = useContext(Context);

	return (
		<div>
			Hier kan je activiteiten verwijderen.
		</div>
	)
}


function Creator() {
	const context = useContext(Context);

	return (
		<div>
			Hier kan je activiteiten toevoegen.
		</div>
	)
}