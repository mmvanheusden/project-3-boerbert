import {Header} from "../KleineDingetjes";
import {BACKEND, queryClient} from "../../App.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Provider, Context} from "./Context.tsx";
import {Component, type PropsWithChildren, useContext, useEffect, useState} from "react";
import type {Treaty} from "@elysiajs/eden";
import {Icon} from "@iconify/react";
import type * as React from "react";


export default function AdminPanel() {
	const [currentView, setView] = useState("Activiteiten");
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

	if (isPending || slideshowPending)  return <LoadingSpinner loading={true} text="GEGEVENS OPHALEN..."/>;
	if (error || slideshowError) return <div className="bg-white p-5 rounded border font-medium">Server is onbereikbaar! Storing...</div>;


	function ActivitiesEditor() {
		const {activities} = useContext(Context)!;
		const [activityEditing, setActivityEditing] = useState<Treaty.Data<typeof BACKEND.activities.get>[0] | null>(null);
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
						<button type="submit" className="bg-green-700 hover:underline mt-1 rounded border-1 cursor-pointer px-4 font-small text-xl hover:ring-2 font-bold">
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
				<Helper>
					<Icon icon="material-symbols:info-outline" width="32" height="32" className="mr-2"/>
					<p>
						Hieronder vindt u een lijst met alle activiteiten. Met de knoppen kunt u ze aanpassen, verwijderen, of nieuwe aanmaken
					</p>
				</Helper>
				{creatingActivity ?
					<>
						<button
							className="inline-flex items-center hover:underline hover:ring-2 rounded border-1 cursor-pointer bg-orange-300 px-2 font-medium text-xl mb-3 py-1  hover:outline-[2px]"
							onClick={() => setCreatingActivity(false)}
						>
							<Icon icon="mdi:cancel-bold" width="24" height="24" />
							<span>Annuleren</span>
						</button>
						<Creator/>
					</>
					:
					<>
						<button
							className="inline-flex items-center hover:underline hover:ring-2 rounded border-1 cursor-pointer bg-green-700 px-2 font-medium text-xl mb-3 py-1  hover:outline-[2px]"
							onClick={() => setCreatingActivity(true)}
						>
							<Icon icon="mdi:add-bold" width="24" height="24" />
							<span>Activiteit aanmaken</span>
						</button>
						<ActivitiesEmptyCheck activities={activities}/>
						<ol>
							{
								activities.map((activiteit) => {
									return (
										<>
											<div className="mb-2 border-2 p-4 rounded bg-white shadow">
												{activityEditing && activityEditing.id == activiteit.id
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
															className="bg-green-700 hover:underline ml-10 rounded border-1 cursor-pointer px-4 font-small text-xl hover:ring-2 font-bold"
															onClick={async () => {
																await updateActivity(activityEditing);
															}}>
															Opslaan
														</button>
														<button
															className="bg-orange-400 hover:underline ml-4  rounded border-1 cursor-pointer px-4 font-small text-xl hover:ring-2"
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
																<h3 className="text-lg font-medium text-gray-800">{activiteit.title}</h3>
																<p className="text-gray-600 text-base mb-1">{activiteit.subtitle}</p>
																<p className="text-gray-700 text-base">Capaciteit: {activiteit.capacity}</p>
																<p className="text-gray-700 text-base">Drempelwaarde: {activiteit.threshold}</p>
																<p className="text-gray-700 text-base">Prijs: €{activiteit.price}</p>
																<p className="text-gray-700 text-base">Leeftijd: {activiteit.minage}</p>
																<p className="text-gray-700 text-base">Locatie: {activiteit.location}</p>
															</div>
															<img
																className="max-h-70 right-0 max-w-[50%] object-cover rounded-xl border-2 ml-auto"
																src={`data:image/png;base64, ${activiteit?.hero}`}
																style={{imageRendering: "pixelated"}}
																alt={activiteit?.title ?? "activity image"}
															/>
														</li>
														<button
															className="bg-green-700 hover:underline ml-10  rounded border-1 cursor-pointer px-4 font-small text-xl hover:ring-2"
															onClick={() => {setActivityEditing(activiteit)}}>
															Bewerken
														</button>
														<button
															className="bg-red-700 hover:underline ml-4  rounded border-1 cursor-pointer px-4 font-small text-xl hover:ring-2"
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
					<button type="submit" className="bg-green-700 hover:underline rounded border-1 cursor-pointer px-4 font-small text-xl hover:ring-2 font-bold mt-1">
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
							className="inline-flex items-center hover:underline hover:ring-2 rounded border-1 cursor-pointer bg-orange-300 px-2 font-medium text-xl mb-3 py-1  hover:outline-[2px]"
							onClick={() => setCreatingSlide(false)}
						>
							<Icon icon="mdi:cancel-bold" width="24" height="24" />
							<span>Annuleren</span>
						</button>
						<SlideCreator/>
					</>
					:
					<>
						<button
							className="inline-flex items-center hover:underline hover:ring-2 rounded border-1 cursor-pointer bg-green-700 px-2 font-medium text-xl mb-3 py-1  hover:outline-[2px]"
							onClick={() => setCreatingSlide(true)}
						>
							<Icon icon="mdi:add-bold" width="24" height="24" />
							<span>Slide toevoegen</span>
						</button>
						{slides.length === 0 ?
							<div className="border-2 border-black h-[40vh] w-full flex items-center justify-center text-3xl font-bold select-none cursor-not-allowed hover:border-red-500">
								Er zijn nog geen slides. Maak er een aan met de knop bovenaan!
							</div>
							:
							<ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
								{slides.map((slide) => (
									<li key={slide.id} className="border-2 p-4 rounded bg-white shadow">
										<p className="text-gray-700 font-mono text-sm mb-2">{slide.id}</p>
										<div className="mb-2">
											<img
												className="w-full h-48 object-cover rounded-lg border-2"
												src={`data:image/jpeg;base64, ${slide.image}`}
												alt={slide.alt}
											/>
										</div>
										<p className="text-base mb-2">{slide.alt}</p>
										<button
											className="bg-red-700 hover:underline rounded border-1 cursor-pointer px-4 font-small text-xl hover:ring-2"
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
			<div className="bg-white/90 border-2 border-black p-4 rounded-3xl">
				<Header>
					<span className="select-none rounded-t-lg border-x-2 border-t-1 bg-red-800 px-4 mr-1 font-semibold text-3xl">
						Beheerderspaneel
					</span>
					<button
						onClick={() => setView("Activiteiten")}
						className={`select-none rounded-t-lg border-x-1 border-t-1 px-4 py-0 font-medium text-xl hover:underline ml-1 hover:ring-2 cursor-pointer bg-green-200  hover:outline-[2px] ${currentView == "Activiteiten" ? "underline outline-[2px]" : null}`}>
						<span>
							Activiteiten
						</span>
					</button>
					<button
						onClick={() => setView("Slideshow")}
						className={`select-none rounded-t-lg border-x-1 border-t-1  px-4 py-0 font-medium text-xl hover:underline ml-1 hover:ring-2 cursor-pointer bg-green-200 hover:outline-[2px] ${currentView == "Slideshow" ? "underline outline-[2px] " : null}`}>
						<span>
							Slideshow
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
				{currentView == "Activiteiten" && <ActivitiesEditor/>}
				{currentView == "Slideshow" && <SlideshowEditor/>}
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
					<div className="border-2 border-black h-[40vh] w-full flex items-center justify-center text-3xl font-bold select-none cursor-not-allowed hover:border-red-500">
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
			<div className="border-2 w-full p-2 mb-6 rounded inline-flex items-center border-gray-500 bg-white shadow">
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
			<div className="border-2 w-full min-w-[40%] h-[100%] min-h-[10em]">
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
			<div className="border-2 border-black bg-white p-4 rounded-xl aspect-3/2 flex flex-col justify-center z-10">
				<Icon icon="line-md:loading-alt-loop" className="mx-auto" width="128" height="128" style={{color: "blue"}} />
				<p className="text-black text-center text-3xl font-bold">{props.text || "ACTIE VERWERKEN..."}</p>
			</div>
		</div>
	)
}