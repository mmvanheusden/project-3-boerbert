import { Header } from "../KleineDingetjes";
import {BACKEND} from "../../App.tsx";
import {useQuery} from "@tanstack/react-query";
import {Provider, Context, type ContextPayload} from "./Context.tsx";
import {Component, type PropsWithChildren, useContext, useEffect, useState} from "react";
import type {Treaty} from "@elysiajs/eden";
import {Icon} from "@iconify/react";
import type * as React from "react";


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
			<div className="bg-white/90 border-2 border-black p-4 rounded-3xl">
				<Header>
					<span className="select-none rounded-t-lg border-x-2 border-t-1 bg-red-800 px-4 mr-1 font-semibold text-3xl">
						Beheerderspaneel
					</span>
					<button
						onClick={() => setView("Bewerker")}
						className={`select-none rounded-t-lg border-x-1 border-t-1 px-4 py-0 font-medium text-xl hover:underline ml-1 hover:ring-2 cursor-pointer bg-green-200  hover:outline-[2px] ${currentView == "Bewerker" ? "underline outline-[2px]" : null}`}>
						<span>
							Bewerken
						</span>
					</button>
					<button
						onClick={() => setView("Verwijderen")}
						className={`select-none rounded-t-lg border-x-1 border-t-1  px-4 py-0 font-medium text-xl hover:underline ml-1 hover:ring-2 cursor-pointer bg-green-200 hover:outline-[2px] ${currentView == "Verwijderen" ? "underline outline-[2px] " : null}`}>
						<span>
							Verwijderen
						</span>
					</button>
					<button
						onClick={() => setView("Activiteit aanmaken")}
						className={`select-none rounded-t-lg border-x-1 border-t-1 px-4 py-0 font-medium text-xl hover:underline ml-1 hover:ring-2 cursor-pointer bg-green-200  hover:outline-[2px] ${currentView == "Activiteit aanmaken" ? "underline  outline-[2px] " : null}`}>

						<span>
							Toevoegen
						</span>
					</button>
					<a href="/">
						<button
							className="inline-flex items-center hover:underline ml-4 hover:ring-2 rounded border-1  cursor-pointer bg-orange-300 px-2 font-medium text-base py-1  hover:outline-[2px]">
							<Icon icon="ion:arrow-back" width="24" height="24"/>
							<span>Terug naar hoofdpagina</span>
						</button>
					</a>
				</Header>
				{currentView == "Bewerker" ? <Editor/> : null}
				{currentView == "Verwijderen" ? <Deleter/> : null}
				{currentView == "Activiteit aanmaken" ? <Creator/> : null}
			</div>
		</Provider>
	)
}

function Editor() {
	const {activities} = useContext(Context)!;

	return (
		<div>
			<ModeDescription>
				<Icon icon="material-symbols:info-outline" width="32" height="32" className="mr-2"/>
				<p>
					Hieronder vindt u een lijst met alle activiteiten. Klik op de knop om een activiteit te bewerken.
				</p>
			</ModeDescription>
			<ActivitiesEmptyCheck activities={activities}/>
		</div>
	)
}

async function deleteActivity(activity: Treaty.Data<typeof BACKEND.activities.get>[0], { setActivities }: ContextPayload) {
	await BACKEND.activities({ id: activity.id }).delete();

	setActivities(prev => prev.filter(a => a.id !== activity.id));
}

function ActivitiesEmptyCheck(props: { activities: Treaty.Data<typeof BACKEND.activities.get> }) {
	const { activities } = props;

	return (
		<>
			{(() => {if (activities.length == 0) {
				return (
					<div className="border-2 border-black h-[60vh] w-full flex items-center justify-center text-3xl font-bold">
						Er zijn nog geen activiteiten.
					</div>
				)
			}})()}
		</>
	)
}

class ModeDescription extends Component<PropsWithChildren> {
	render() {
		return (
			<div className="border-2 w-full p-2 mb-6 rounded inline-flex items-center border-gray-500 bg-white shadow">
				{this.props.children}
			</div>
		)
	}
}


function Deleter() {
	const {activities, setActivities} = useContext(Context)!;

	return (
		<ol>
			<ModeDescription>
				<Icon icon="material-symbols:info-outline" width="32" height="32" className="mr-2"/>
				<p>
					Hieronder vindt u een lijst met alle activiteiten. Klik op de knop om een activiteit te verwijderen.
				</p>
			</ModeDescription>
			<ActivitiesEmptyCheck activities={activities}/>
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
										<p className="text-gray-700 text-base">Prijs: €{activiteit.price}</p>
										<p className="text-gray-700 text-base">Leeftijd: {activiteit.minage}</p>
										<p className="text-gray-700 text-base">Locatie: {activiteit.location}</p>
									</div>
								</li>
								<button
									className=" bg-amber-600 hover:underline ml-10  rounded border-1 cursor-pointer px-4 font-small text-1xl hover:ring-2"
									onClick={async () => {await deleteActivity(activiteit, { activities, setActivities });}}>
									Verwijderen
								</button>
							</div>
						</>
					)
				})
			}
		</ol>
	)
}


function ImageUpload() {
	const [image, setImage] = useState<string | null>(null);

	return (
		<div>
			<label htmlFor="hero" className="text-base font-semibold">Plaatje</label>
			<div className="border-2 w-full min-w-[40%] h-[calc(100%-1em)]">
				<div className={`text-black bg-gray-200/80 w-full h-full justify-center  ${!image && "hover:outline-5 hover:outline-red-300 hover:font-bold"}`}>
					{image && <img src={image} alt="Preview" className="object-fill"/>}
					<input id="hero" className={`w-full pb-0 hover:cursor-pointer hover:outline-red-300 hover:font-bold ${image && "border-t-2"} ${!image && "h-full"}`}  type="file" accept="image/*" required onChange={(e) => {
						const file = e.target.files?.[0];
						if (!file) return;
						const reader = new FileReader();
						reader.onload = (e) => setImage(e.target?.result as string);
						reader.readAsDataURL(file);
					}}>
					</input>
				</div>
			</div>
		</div>
	)
}

function Creator() {
	function insertActivity(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const form = event.currentTarget
		// Zet de formdata om naar een JSON object. TODO: Deserialiseer naar een voorgedefineerd model: https://www.epicreact.dev/how-to-type-a-react-form-on-submit-handler

		const parsedFormData = {
			// @ts-ignore
			title: String(form.elements["title"]?.value || ""),
			// @ts-ignore
			subtitle: String(form.elements["subtitle"]?.value || ""),
			// @ts-ignore
		 	description: String(form.elements["description"]?.value || ""),
			// @ts-ignore
			price: Number(form.elements["price"]?.value || 0),
			// @ts-ignore
			capacity: Number(form.elements["capacity"]?.value || 0),
			// @ts-ignore
			threshold: Number(form.elements["threshold"]?.value || 0),
			// @ts-ignore
			minage: Number(form.elements["minage"]?.value || 0),
			// @ts-ignore
			location: String(form.elements["location"]?.value || ""),
			// @ts-ignore
			hero: (form.elements["hero"] as HTMLInputElement)?.files?.[0] as File,
		};

		console.trace(parsedFormData);
		BACKEND.activities.put(parsedFormData)
	}

	return (<>
			<ModeDescription>
				<Icon icon="material-symbols:info-outline" width="32" height="32" className="mr-2"/>
				<p>
					Vul de details van de activiteit hieronder in. Klik op de knop om de activiteit toe te voegen.
				</p>
			</ModeDescription>
			<form onSubmit={insertActivity}>
				<div className="grid md:grid-cols-2 md:gap-6">
					<div>
						<div className="mb-2">
							<label htmlFor="title">Titel</label>
							<input id="title" type="text" required placeholder="Bijv. 'Boogschieten'"
								   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
						</div>
						<div className="mb-2">
							<label htmlFor="subtitle">Ondertitel</label>
							<input id="subtitle" type="text" required placeholder="Bijv. 'Leer boogschieten met onze instructeurs'"
								   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
						</div>
						<div className="mb-2">
							<label htmlFor="description">Beschrijving</label>
							<textarea id="description" required placeholder="Bijv. 'In deze activiteit leer je boogschieten onder begeleiding van onze ervaren instructeurs...'"
								   className="min-h-48 block w-full p-2.5 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
						</div>
					</div>
					<ImageUpload/>
				</div>
				<div className="mb-2">
					<label htmlFor="minage">Minimumleeftijd (optioneel)</label>
					<input id="minage" type="number" placeholder="Bijv. 4 - leeg laten = alle leeftijden"
						   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
				</div>
				<div className="mb-2">
					<label htmlFor="price">Prijs</label>
					<input id="price" type="number" required placeholder="Bijv. '€4,50'"
						   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
				</div>
				<div className="mb-2">
					<label htmlFor="location">Locatie</label>
					<input id="location" type="text" required placeholder="Bijv. 'Boerderijplein'"
						   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
				</div>
				<div className="mb-2">
					<label htmlFor="capacity">Capaciteit</label>
					<input id="capacity" type="number" required placeholder="Bijv. '20'"
						   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
				</div>
				<div className="mb-2">
					<label htmlFor="threshold">Drempelbezetting</label>
					<input id="threshold" type="number" required placeholder="Bijv. '5'"
						   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
				</div>
				<button type="submit" className=" bg-green-700 ml-1 rounded border-1 border-black cursor-pointer px-4 font-small text-[1.2em] hover:ring hover:underline hover:ring-black ">
					Toevoegen
				</button>
			</form>
		</>
	)
}