import { Header } from "../KleineDingetjes";
import {BACKEND} from "../../App.tsx";
import {useQuery} from "@tanstack/react-query";
import {Provider, Context, type ContextPayload} from "./Context.ts";
import {useContext, useEffect, useState} from "react";
import type {Treaty} from "@elysiajs/eden";


export default function AdminPanel() {
	const [currentView, setView] = useState("Bewerker");
	const { isPending, error, data } = useQuery<Treaty.Data<typeof BACKEND.activities.get>>({
		queryKey: ["activities"],
		queryFn: async () => {
			const res = await BACKEND.activities.get();
			return res.data as Treaty.Data<typeof BACKEND.activities.get>;
		},
	});
	const [activities, setActivities] = useState<Treaty.Data<typeof BACKEND.activities.get>>([]);

	// Sync query data into local state once fetched
	useEffect(() => {
		if (data) {
			setActivities(data);
		}
	}, [data]);

	if (isPending) return <>Laden...</>;
	if (error) return <>Error</>;

	return (
		<Provider value={{activities, setActivities}}>
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

			<div className="inline-flex shadow-xs -space-x-px mb-2" role="group">
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
			<hr className="mb-3 w-[40%] h-[0.2em] rounded bg-gray-900"></hr>
			{currentView == "Bewerker" ? <Editor/> : null}
			{currentView == "Verwijderen" ? <Deleter/> : null}
			{currentView == "Activiteit aanmaken" ? <Creator/> : null}
		</Provider>
	)
}

function Editor() {
	const {activities, setActivities} = useContext(Context)!;

	return (
		<div>
			Hier kan je activiteiten bewerken.
		</div>
	)
}

async function deleteActivity(activity: Treaty.Data<typeof BACKEND.activities.get>[0], { setActivities }: ContextPayload) {
	await BACKEND.activities({ id: activity.id }).delete();

	setActivities(prev => prev.filter(a => a.id !== activity.id));
}


function Deleter() {
	const {activities, setActivities} = useContext(Context)!;

	return (
		<ol>
			{
				activities.map((activiteit) => {
					return (
						<>
							<div className="mb-2 border-2 p-4 rounded bg-white shadow">
								<li key={activiteit.id} className="flex">
									<span className="text-gray-700 text-lg font-medium mr-4 font-mono">{activiteit.id}</span>
									<div className="flex-1 mb-1">
										<h3 className="text-lg font-medium text-gray-800">{activiteit.title}</h3>
										{/*<p className="text-gray-600 text-base">ID: {activiteit.id}</p>*/}
										<p className="text-gray-600 text-base mb-1">{activiteit.subtitle}</p>
										<p className="text-gray-700 text-base">Capaciteit: {activiteit.capacity}</p>
										<p className="text-gray-700 text-base">Drempelwaarde: {activiteit.threshold}</p>
									</div>
								</li>
								<button
									className="bg-blue-500 hover:ring-2"
									onClick={async () => {await deleteActivity(activiteit, { activities, setActivities });}}>
									Verwijderen
								</button>
							</div>
						</>
					)
				})
			}
			Hier kan je activiteiten verwijderen.
		</ol>
	)
}


function ImageUpload() {
	const [image, setImage] = useState<string | null>(null);

	function ImageUpload() {
		return (
			<button onClick={() => {
				setImage("hoi")
			}}
				type="button" className="bg-gray-200 w-full h-full flex items-center justify-center hover:outline-5 hover:font-bold hover:outline-red-300 hover:cursor-pointer">
				Uploaden
			</button>
		)
	}

	function ImagePreview() {
		return (
			<img src="https://picsum.photos/200/300" alt="Preview" className="object-fill"/>
		)
	}

	return (
		<div>
			<h1 className="text-base font-semibold">Plaatje</h1>
			<div className="border-2 w-full min-w-[40%] h-[calc(100%-1em)]">
				{image ? <ImagePreview/> : <ImageUpload/>}
			</div>
		</div>
	)
}

function Creator() {
	const {activities, setActivities} = useContext(Context)!;

	return (<>
			<form>
				<div className="grid md:grid-cols-2 md:gap-6">
					<div>
						<div className="mb-2">
							<label htmlFor="title">Titel</label>
							<input id="title" type="text"
								   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
						</div>
						<div className="mb-2">
							<label htmlFor="subtitle">Ondertitel</label>
							<input id="subtitle" type="text"
								   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
						</div>
					</div>
					<ImageUpload/>
				</div>
				<div className="mb-2">
					<label htmlFor="price">Prijs</label>
					<input id="price" type="number"
						   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
				</div>
				<div className="mb-2">
					<label htmlFor="capacity">Capaciteit</label>
					<input id="capacity" type="number"
						   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
				</div>
				<div className="mb-2">
					<label htmlFor="threshold">Drempelbezetting</label>
					<input id="threshold" type="number"
						   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
				</div>
				<button type="submit" className="bg-blue-500 hover:ring-2">
					Toevoegen
				</button>
			</form>
		</>
	)
}