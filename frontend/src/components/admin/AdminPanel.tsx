import {Header} from "../KleineDingetjes";
import {BACKEND, queryClient} from "../../App.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Provider, Context} from "./Context.tsx";
import {Component, type PropsWithChildren, useContext, useEffect, useState} from "react";
import type {Treaty} from "@elysiajs/eden";
import {Icon} from "@iconify/react";
import type * as React from "react";
import "dayjs/locale/nl"
import dayjs from "dayjs";


export default function AdminPanel() {
	const [currentView, setView] = useState("Activiteiten");
	const [searchQuery, search] = useState("");
	const { isPending, error, data } = useQuery<Treaty.Data<typeof BACKEND.activities.get>>({
		queryKey: ["activities"],
		queryFn: async () => {
			const res = await BACKEND.activities.get();
			return res.data as Treaty.Data<typeof BACKEND.activities.get>;
		},
	});

	const { isPending: slideshowPending, error: slideshowError, data: slideshowData } = useQuery<Treaty.Data<typeof BACKEND.slideshow.get>>({
		queryKey: ["slideshow"],
		queryFn: async () => {
			const res = await BACKEND.slideshow.get();
			return res.data as Treaty.Data<typeof BACKEND.slideshow.get>;
		},
	});

	const { isPending: slotsPending, error: slotsError, data: slotsData } = useQuery<Treaty.Data<typeof BACKEND.slots.get>>({
		queryKey: ["slots"],
		queryFn: async () => {
			const res = await BACKEND.slots.get();
			return res.data as Treaty.Data<typeof BACKEND.slots.get>;
		},
	});

	/* Tanstack Query mutaties, hiermee invalideren we de cache wanneer we de activiteiten willen muteren, zodat de site de ge-update lijst met activiteiten ophaalt. */
	const ActivityPatchMutator = useMutation({
		mutationFn: (activity: any) => BACKEND.activities({id: activity.id}).patch(activity),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
	})
	const ActivityInsertMutator = useMutation({
		mutationFn: async (activity: any) => {
			let response = await BACKEND.activities.put(activity)
			if (response.status == 409) {
				return Promise.reject("Activiteit met deze titel bestaat al!")
			}
			return response.data
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
	})
	const ActivityDeleteMutator = useMutation({
		mutationFn: (activity: any) => BACKEND.activities({ id: activity.id }).delete(),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
	})

	/* Tanstack Query mutaties voor slideshow */
	const SlideInsertMutator = useMutation({
		mutationFn: async (slide: any) => {
			let response = await BACKEND.slideshow.put(slide)
			if (response.status == 409) {
				return Promise.reject("Een slide met dit plaatje bestaat al!")
			}
			return response.data
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["slideshow"] }),
	})
	const SlideDeleteMutator = useMutation({
		mutationFn: (slide: any) => BACKEND.slideshow({ id: slide.id }).delete(),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["slideshow"] }),
	})


	const SlotInsertMutator = useMutation({
		mutationFn: (slot: any) => BACKEND.slots.put(slot),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["slots"] }),
	})
	const SlotDeleteMutator = useMutation({
		mutationFn: (slot: any) => BACKEND.slots({ id: slot.id }).delete(),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["slots"] }),
	})


	// Sync query data into local state once fetched
	useEffect(() => {
		if (data) {
			setActivities(data);
		}
	}, [data]);
	const [activities, setActivities] = useState<Treaty.Data<typeof BACKEND.activities.get>>([]);

	useEffect(() => {
		if (slideshowData) {
			setSlides(slideshowData);
		}
	}, [slideshowData]);
	const [slides, setSlides] = useState<Treaty.Data<typeof BACKEND.slideshow.get>>([]);

	useEffect(() => {
		if (slotsData) {
			setSlots(slotsData);
		}
	}, [slotsData]);
	const [slots, setSlots] = useState<Treaty.Data<typeof BACKEND.slots.get>>([]);

	if (isPending || slideshowPending || slotsPending)  return <LoadingSpinner loading={true} text="GEGEVENS OPHALEN..."/>;
	if (error || slideshowError || slotsError) return <div className="bg-white p-5 rounded border font-medium">Server is onbereikbaar! Storing...</div>;


	function ActivitiesEditor() {
		const {activities} = useContext(Context)!;
		const [activityEditing, setActivityEditing] = useState<Treaty.Data<typeof BACKEND.activities.get>[0] | null>(null);
		const [activityScheduling, setActivityScheduling] = useState<Treaty.Data<typeof BACKEND.activities.get>[0] | null>(null);
		const [slotPlanning, setSlotPlanning] = useState(false);
		const [creatingActivity, setCreatingActivity] = useState(false);

		function Creator() {
			async function insertActivity(event: React.FormEvent<HTMLFormElement>) {
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
				if (parsedFormData.threshold > parsedFormData.capacity) {
					return alert("Drempelbezetting kan nooit hoger zijn dan de capaciteit!")
				}

				if (confirm(`Weet je zeker dat je activiteit "${parsedFormData.title}" wilt toevoegen?`)) {
					await ActivityInsertMutator.mutateAsync(parsedFormData, {
						onError: () => {
							return alert("FOUT: Activiteit met deze titel bestaal al!");
						},
						onSuccess: () => {
							setCreatingActivity(false);
						}
					});
				}
			}

			return (<>
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
							<label htmlFor="minage">Minimumleeftijd</label>
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
						<button type="submit" className="text-white bg-green-600 hover:bg-green-700 mt-1 rounded cursor-pointer px-4 font-small text-xl hover:ring-2">
							Toevoegen
						</button>
					</form>
				</>
			)
		}

		const updateActivity = async (activiteit: Treaty.Data<typeof BACKEND.activities.get>[0]) => {
			const updatedActivity = {
				id: activiteit.id,
				title: activiteit.title,
				subtitle: activiteit.subtitle,
				description: activiteit.description,
				price: activiteit.price,
				// hero: new File([new Blob(["hi"], {type: "image/png"})], "hello.png"),
				capacity: activiteit.capacity,
				threshold: activiteit.threshold,
				minage: activiteit.minage,
				location: activiteit.location,
			};

			if (confirm(`Weet je zeker dat je activiteit "${activiteit.title}" wilt aanpassen? Dit kan niet ongedaan worden gemaakt.`)) {
				ActivityPatchMutator.mutate(updatedActivity);
				setActivityEditing(null);
			}
		};
		return (
			<div>
				<nav className="sticky top-0">
					<Helper>
						<Icon icon="material-symbols:info-outline" width="32" height="32" className="mr-2"/>
						<p>
							Hieronder vindt u een lijst met alle activiteiten. Met de knoppen kunt u ze aanpassen, verwijderen, of nieuwe aanmaken
						</p>
					</Helper>
				</nav>

				{creatingActivity ?
					<>
						<button
							className="text-white inline-flex items-center hover:bg-orange-500 hover:ring-2 rounded cursor-pointer bg-orange-400 px-2 font-medium text-xl mb-3 py-1"
							onClick={() => setCreatingActivity(false)}
						>
							<Icon icon="mdi:cancel-bold" width="24" height="24" />
							<span>Annuleren</span>
						</button>
						<Creator/>
					</>
					:
					<>
						<div className="flex items-center justify-between w-full gap-4">
							<button
								className="text-white inline-flex items-center hover:bg-green-700 hover:ring-2 rounded cursor-pointer bg-green-600 px-2 font-medium text-xl mb-3 py-1"
								onClick={() => setCreatingActivity(true)}
							>
								<Icon icon="mdi:add-bold" width="24" height="24"/>
								<span>Activiteit aanmaken</span>
							</button>

							<form
								onSubmit={() => search((document.getElementById("search") as HTMLInputElement)?.value)}
								className="mb-3">
								<label htmlFor="search" className="sr-only">Search</label>
								<div className="flex items-center gap-2">
									<div className="relative flex-1">
										<div
											className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
											<Icon icon="icon-park-outline:search" width="20" height="20"/>
										</div>
										<input type="search" id="search"
											   className="bg-white border -full pl-10 pr-3 py-2.5 bg-neutral-secondary-medium text-heading text-sm rounded focus:ring-brand shadow-xs placeholder:text-body"
											   placeholder="Zoek"/>
									</div>
									<button type="submit"
											className="bg-white border whitespace-nowrap px-4 py-2.5 text-black bg-brand hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium rounded text-sm focus:outline-none">
										Zoek
									</button>
								</div>
							</form>
						</div>

						<ActivitiesEmptyCheck activities={activities}/>
						<ol>
							{
								activities.filter((activiteit) => activiteit.title.toLowerCase().includes(searchQuery.toLowerCase()))
								.map((activiteit) => {
									return (
										<>
											<div className="mb-2 p-4 rounded bg-white shadow">
												{
													activityScheduling && activityScheduling.id == activiteit.id ?
														<>

															<div className="flex-1">
																<div className="min-h-50">
																	{slotPlanning ?
																		<>
																			<form onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
																				event.preventDefault();
																				const form = event.currentTarget
																				// Zet de formdata om naar een JSON object. TODO: Deserialiseer naar een voorgedefineerd model: https://www.epicreact.dev/how-to-type-a-react-form-on-submit-handler

																				const parsedFormData = {
																					// @ts-ignore
																					startTime: String(form.elements["slotTime"]?.value || ""),
																					// @ts-ignore
																					duration: String(form.elements["slotDuration"]?.value || ""),
																					// @ts-ignore
																					date: String(form.elements["slotDate"]?.value || ""),
																					// @ts-ignore
																					activityId: activiteit.id,
																				};
																				if (parsedFormData.date < String(2025) ) {
																					return alert("Kan niet. We leven in 2025!")
																				}

																				SlotInsertMutator.mutate(parsedFormData);
																			}}>

																				<div>
																					<label htmlFor="slotTime">Start</label>
																					<input required id="slotTime" type="time"></input>
																				</div>
																				<div>
																					<label
																						htmlFor="slotDate">Datum</label>
																					<input required id="slotDate"
																						   type="date"></input>
																				</div>
																				<div>
																					<label
																						htmlFor="slotDuration">Lengte</label>
																					<input required id="slotDuration"
																						   type="number"></input>
																				</div>
																				<button className="rounded mt-8 border bg-green-400 hover:underline" type="submit">Verstuur slot</button>
																			</form>
																		</>
																		: <>
																			<div className="flex-col">
																				<b>{activiteit.title}</b>
																			</div>
																			<table className="table-fixed text-left w-full">
																				<thead className="bg-gray-400">
																				<tr>
																					<th>Datum</th>
																					<th>Starttijd</th>
																					<th>Duur</th>
																				</tr>
																				</thead>
																				<tbody className="overflow-y-auto">
																					<tr className="hover:ring-2 hover:ring-red-400 hover:cursor-pointer hover:font-bold"
																						onClick={() => setSlotPlanning(true)}
																					>
																						<td>Toevoegen</td>
																					</tr>
																					{slots
																						.filter((slot) => (slot.activityId == activiteit.id))
																						.map((slot) => {
																						return (<>
																							<tr key={slot.id}>
																								<td className="flex flex-row items-center mb-2">
																									<button
																										className="size-8 cursor-pointer border-2 border-blue-500 flex flex-row justify-center items-center hover:border-3 hover:border-red-400 mr-2"
																										onClick={(e) => {
																											e.stopPropagation();
																											if (confirm(`Weet je zeker dat je dit tijdslot wilt verwijderen?`)) {
																												SlotDeleteMutator.mutate(slot);
																											}
																										}}
																									>
																										<Icon icon="line-md:trash" width="32" height="32" color="black"/>
																									</button>
																									{dayjs(slot.date).locale("nl").format("D[ ]MMMM")}
																								</td>
																								<td>{slot.startTime}</td>
																								<td>{slot.duration} u</td>
																							</tr>
																						</>)
																					})}
																				</tbody>
																			</table>
																		</>
																	}


																</div>
															</div>

															<button
																className="flex bg-orange-400 hover:underline rounded border-1 cursor-pointer px-4 font-small text-xl hover:ring-2"
																onClick={() => {
																	setActivityScheduling(null);
																	setSlotPlanning(false);
																}}>
																{slotPlanning ? "Annuleren" : "Sluiten"}
															</button>
														</>
													: activityEditing && activityEditing.id == activiteit.id
													? <>
														<li key={activiteit.id} className="flex">
															<span className="text-gray-700 text-lg font-medium mr-4 font-mono">{activiteit.id}</span>
															<div className="flex-1 mb-1">
																<div className="flex-1 mb-1">
																	<div className="mb-2">
																		<label htmlFor="title">Titel</label>
																		<input
																			id="title"
																			type="text"
																			value={activityEditing.title}
																			onChange={(e) => {
																				setActivityEditing(prev => prev ? { ...prev, title: e.target.value } : { ...activiteit, title: e.target.value });
																			}}
																			className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
																		/>
																	</div>
																	<div className="mb-2">
																		<label htmlFor="description">Beschrijving</label>
																		<textarea
																			id="description"
																			value={activityEditing?.description ?? activiteit.description}
																			onChange={(e) => {
																				setActivityEditing(prev => prev ? { ...prev, description: e.target.value } : { ...activiteit, description: e.target.value });
																			}}
																			required
																			placeholder="Bijv. 'In deze activiteit leer je boogschieten onder begeleiding van onze ervaren instructeurs...'"
																			className="min-h-48 block w-full p-2.5 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
																	</div>
																	<div className="mb-2">
																		<label htmlFor="subtitle">Ondertitel</label>
																		<input
																			id="subtitle"
																			type="text"
																			value={activiteit.subtitle}
																			onChange={(e) => {
																				setActivityEditing(prev => prev ? { ...prev, subtitle: e.target.value } : { ...activiteit, subtitle: e.target.value });
																			}}
																			className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
																		/>
																	</div>
																	<div className="mb-2">
																		<label htmlFor="capacity">Capaciteit</label>
																		<input
																			id="capacity"
																			type="number"
																			value={activiteit.capacity}
																			onChange={(e) => {
																				setActivityEditing(prev => prev ? { ...prev, capacity: Number(e.target.value) } : { ...activiteit, capacity: Number(e.target.value) });
																			}}
																			className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
																		/>
																	</div>
																	<div className="mb-2">
																		<label htmlFor="threshold">Drempelwaarde</label>
																		<input
																			id="threshold"
																			type="number"
																			value={activiteit.threshold}
																			onChange={(e) => {
																				setActivityEditing(prev => prev ? { ...prev, threshold: Number(e.target.value) } : { ...activiteit, threshold: Number(e.target.value) });
																			}}
																			className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
																		/>
																	</div>
																	<div className="mb-2">
																		<label htmlFor="price">Prijs</label>
																		<input
																			id="price"
																			type="number"
																			value={activiteit.price}
																			onChange={(e) => {
																				setActivityEditing(prev => prev ? { ...prev, price: Number(e.target.value) } : { ...activiteit, price: Number(e.target.value) });
																			}}
																			className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
																		/>
																	</div>
																	<div className="mb-2">
																		<label htmlFor="minage">Leeftijd</label>
																		<input
																			id="minage"
																			type="number"
																			value={activiteit.minage}
																			onChange={(e) => {
																				setActivityEditing(prev => prev ? { ...prev, minage: Number(e.target.value) } : { ...activiteit, minage: Number(e.target.value) });
																			}}
																			className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
																		/>
																	</div>
																	<div className="mb-2">
																		<label htmlFor="location">Locatie</label>
																		<input
																			id="location"
																			type="text"
																			value={activiteit.location}
																			onChange={(e) => {
																				setActivityEditing(prev => prev ? { ...prev, location: e.target.value } : { ...activiteit, location: e.target.value });
																			}}
																			className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
																		/>
																	</div>
																</div>
															</div>
														</li>
														<button
															className="text-white bg-green-500 hover:bg-green-600 ml-10 rounded cursor-pointer px-4 font-small text-2xl hover:ring-2"
															onClick={async () => {
																await updateActivity(activityEditing);
															}}>
															Opslaan
														</button>
														<button
															className="text-white bg-orange-500 hover:bg-orange-600 ml-4 rounded cursor-pointer px-4 font-small text-2xl hover:ring-2"
															onClick={() => {
																setActivityEditing(null);
															}}>
															Annuleren
														</button>
													</>
													: <>
														<li key={activiteit.id} className="flex">
															<span className="text-gray-700 text-lg font-medium mr-4 font-mono">{activiteit.id}</span>
															<div className="flex-1 mb-1">
																<h3 className="text-4xl font-medium text-gray-800">{activiteit.title}</h3>
																<p className="text-2xl text-gray-600 mb-1">{activiteit.subtitle}</p>
																<p className="text-xl text-gray-700">Capaciteit: {activiteit.capacity}</p>
																<p className="text-xl text-gray-700">Drempelwaarde: {activiteit.threshold}</p>
																<p className="text-xl text-gray-700">Prijs: €{activiteit.price}</p>
																<p className="text-xl text-gray-700">Leeftijd: {activiteit.minage}</p>
																<p className="text-xl text-gray-700">Locatie: {activiteit.location}</p>
															</div>
															<img
																className="max-h-70 right-0 max-w-[50%] object-cover rounded-xl ml-auto"
																src={`data:image/png;base64, ${activiteit?.hero}`}
																style={{imageRendering: "pixelated"}}
																alt={activiteit?.title ?? "activity image"}
															/>
														</li>
														<button
															className="text-white bg-green-600 h-20 w-50 hover:bg-green-700 ml-10  rounded cursor-pointer px-4 font-small text-2xl hover:ring-2"
															onClick={() => {setActivityEditing(activiteit)}}>
															Bewerken
														</button>
														<button
															className="text-white bg-green-600 h-20 w-50 hover:bg-green-700 ml-4  rounded cursor-pointer px-4 font-small text-2xl hover:ring-2"
															onClick={() => {setActivityScheduling(activiteit)}}>
															Plannen
														</button>
														<button
															className="text-white bg-red-600 h-20 w-50 hover:bg-red-700 ml-4  rounded cursor-pointer px-4 font-small text-2xl hover:ring-2"
															onClick={async () => {
																if (confirm(`Weet je zeker dat je activiteit "${activiteit.title}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) {
																	ActivityDeleteMutator.mutate(activiteit);
																}
																// await deleteActivity(activiteit, { activities, setActivities })
																// location.reload();
															}}>
															Verwijderen
														</button>
													</>
												}
											</div>
										</>
									)
								})
							}
						</ol>
					</>
				}
			</div>
		)
	}

	function SlideshowEditor() {
		const [creatingSlide, setCreatingSlide] = useState(false);

		function SlideCreator() {
			async function insertSlide(event: React.FormEvent<HTMLFormElement>) {
				event.preventDefault()
				const form = event.currentTarget

				const parsedFormData = {
					image: (form.elements.namedItem("image") as HTMLInputElement)?.files?.[0] as File,
					alt: String((form.elements.namedItem("alt") as HTMLInputElement)?.value || ""),
				};

				if (confirm(`Weet je zeker dat je deze slide wilt toevoegen?`)) {
					await SlideInsertMutator.mutateAsync(parsedFormData, {
						onError: () => {
							return alert("FOUT: Een slide met dit plaatje bestaat al!");
						},
						onSuccess: () => {
							setCreatingSlide(false);
						}
					});
				}
			}

			return (
				<form onSubmit={insertSlide}>
					<ImageUpload fieldName="image"/>
					<div className="mb-2">
						<label htmlFor="alt">Alt-tekst (beschrijving van de afbeelding)</label>
						<input id="alt" type="text" required placeholder="Bijv. 'Kinderen die boogschieten op het veld'"
							   className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
					</div>
					<button type="submit" className="bg-green-700 hover:underline rounded cursor-pointer px-4 font-small text-xl hover:ring-2 font-bold mt-1">
						Toevoegen
					</button>
				</form>
			)
		}

		return (
			<>
				<Helper>
					<Icon icon="material-symbols:info-outline" width="32" height="32"/>
					<p>
						Hieronder vindt u een lijst met alle slides in de slideshow. Met de knoppen kunt u ze verwijderen of nieuwe aanmaken.
					</p>
				</Helper>
				{creatingSlide ?
					<>
						<button
							className="text-white inline-flex items-center hover:bg-orange-500 hover:ring-2 rounded cursor-pointer bg-orange-400 px-2 font-medium text-xl mb-3 py-1"
							onClick={() => setCreatingSlide(false)}
						>
							<Icon icon="mdi:cancel-bold" width="24" height="24" />
							<span >Annuleren</span>
						</button>
						<SlideCreator/>
					</>
					:
					<>
						<button
							className="text-white inline-flex items-center hover:underline hover:ring-2 rounded cursor-pointer bg-green-600 px-2 font-medium text-xl mb-3 py-1"
							onClick={() => setCreatingSlide(true)}
						>
							<Icon icon="mdi:add-bold" width="24" height="24" />
							<span>Slide toevoegen</span>
						</button>
						{slides.length === 0 ?
							<div className="h-[40vh] w-full flex items-center justify-center text-3xl font-bold select-none cursor-not-allowed hover:border-red-500">
								Er zijn nog geen slides. Maak er een aan met de knop bovenaan!
							</div>
							:
							<ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
								{slides.map((slide) => (
									<li key={slide.id} className="p-4 rounded bg-white shadow">
										<p className="text-gray-700 font-mono text-sm mb-2">{slide.id}</p>
										<div className="mb-2">
											<img
												className="w-full h-48 object-cover rounded-lg"
												src={`data:image/jpeg;base64, ${slide.image}`}
												alt={slide.alt}
											/>
										</div>
										<p className="text-base mb-2">{slide.alt}</p>
										<button
											className="text-white bg-red-500 hover:underline rounded cursor-pointer px-4 font-small text-xl hover:ring-2"
											onClick={async () => {
												if (confirm(`Weet je zeker dat je deze slide wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) {
													SlideDeleteMutator.mutate(slide);
												}
											}}>
											Verwijderen
										</button>
									</li>
								))}
							</ul>
						}
					</>
				}
			</>
		)
	}

	return (
		<Provider value={{activities, setActivities}}>
			<LoadingSpinner loading={ActivityInsertMutator.isPending || ActivityPatchMutator.isPending || ActivityDeleteMutator.isPending || SlideInsertMutator.isPending || SlideDeleteMutator.isPending || isPending}/>
			<div className="flex flex-col gap-3 h-full bg-white/90 p-4 px-4 rounded-3xl">
				<Header>
					<span className="text-white select-none rounded-t-lg bg-blue-500 px-4 mr-1 font-semibold text-4xl">
						Beheerderspaneel
					</span>
					<button
						onClick={() => setView("Activiteiten")}
						className={`text-white select-none rounded-t-lg px-4 py-0 font-medium text-xl ml-1 hover:bg-green-600 cursor-pointer bg-green-500  ${currentView == "Activiteiten" ? "bg-green-700" : null}`}>
						<span>
							Activiteiten
						</span>
					</button>
					<button
						onClick={() => setView("Slideshow")}
						className={`text-white select-none rounded-t-lg px-4 py-0 font-medium text-xl ml-1 hover:bg-green-600 cursor-pointer bg-green-500 ${currentView == "Slideshow" ? "bg-green-700" : null}`}>
						<span>
							Slideshow
						</span>
					</button>
					<a href="/">
						<button
							className="text-white inline-flex items-center hover:underline ml-4 hover:ring-2 rounded cursor-pointer bg-orange-500 px-2 font-medium text-base py-1">
							<Icon icon="ion:arrow-back" width="24" height="24"/>
							<span>Terug naar hoofdpagina</span>
						</button>
					</a>
				</Header>
				<div className="flex-1 overflow-auto px-2 pb-8">
					{currentView == "Activiteiten" && <ActivitiesEditor/>}
					{currentView == "Slideshow" && <SlideshowEditor/>}
				</div>
			</div>
		</Provider>
	)
}

function ActivitiesEmptyCheck(props: { activities: Treaty.Data<typeof BACKEND.activities.get> }) {
	const { activities } = props;

	return (
		<>
			{(() => {if (activities.length == 0) {
				return (
					<div className="h-[40vh] w-full flex items-center justify-center text-3xl font-bold select-none cursor-not-allowed hover:border-red-500">
						Er zijn nog geen activiteiten. Maak er een aan met de knop bovenaan!
					</div>
				)
			}})()}
		</>
	)
}

class Helper extends Component<PropsWithChildren> {
	render() {
		return (
			<div className="w-full p-2 mb-6 rounded inline-flex items-center border-gray-500 bg-white">
				{this.props.children}
			</div>
		)
	}
}

function ImageUpload(props?: { fieldName?: string }) {
	const fieldName = props?.fieldName || "hero";
	const [image, setImage] = useState<string | null>(null);

	return (
		<div>
			<label htmlFor={fieldName} className="text-base font-semibold">Plaatje</label>
			<div className="w-full min-w-[40%] h-[100%] min-h-[10em]">
				<div className={`text-black bg-gray-200/80 w-full justify-center  ${!image && "hover:outline-5 hover:outline-red-300 hover:font-bold"} h-full`}>
					{image && <img src={image} alt="Preview" className="object-fill"/>}
					<input id={fieldName} className={`w-full pb-0 hover:cursor-pointer hover:outline-red-300 hover:font-bold ${image && "border-t-2"} ${!image && "h-full"}`}  type="file" accept="image/*" required onChange={(e) => {
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

function LoadingSpinner(props: { loading?: boolean, text?: string }) {
	if (!props.loading) return null;
	return (
		<div className="pointer-events-auto cursor-progress select-none mx-auto z-100 justify-center items-center top-0 left-0 right-0 bottom-0 flex fixed">
			<div className="absolute inset-0 bg-black/20 backdrop-grayscale"/> {/*De achtergrond.*/}
			<div className="bg-white p-4 rounded-xl aspect-3/2 flex flex-col justify-center z-10">
				<Icon icon="line-md:loading-alt-loop" className="mx-auto" width="128" height="128" style={{color: "blue"}} />
				<p className="text-black text-center text-3xl font-bold">{props.text || "ACTIE VERWERKEN..."}</p>
			</div>
		</div>
	)
}