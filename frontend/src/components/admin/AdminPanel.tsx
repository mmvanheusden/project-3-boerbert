import { Header } from "../KleineDingetjes";
import { BACKEND, queryClient } from "../../App.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { Context, Provider } from "./Context.tsx";
import type * as React from "react";
import { Component, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import type { Treaty } from "@elysiajs/eden";
import { Icon } from "@iconify/react";
import "dayjs/locale/nl"
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { UpdateActivityRequestBody } from "../../../../backend/src/activities/model.ts";

type ActivityCompact = Treaty.Data<typeof BACKEND.activities.compact.get>[0];
type ActivityFull = Treaty.Data<typeof BACKEND.activities.get>[0];
type Slot = Treaty.Data<typeof BACKEND.slots.get>[0];
type Slide = Treaty.Data<typeof BACKEND.slideshow.get>[0];

export default function AdminPanel() {
	const [currentView, setView] = useState<"Activiteiten" | "Slideshow">("Activiteiten");
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

	const { isPending: compactActivitiesPending, error: compactActivitiesError, data: compactActivitiesData } = useQuery<Treaty.Data<typeof BACKEND.activities.compact.get>>({
		queryKey: ["compactActivities"],
		queryFn: async () => {
			const res = await BACKEND.activities.compact.get();
			return res.data as Treaty.Data<typeof BACKEND.activities.compact.get>;
		},
	});

	/* Tanstack Query mutaties, hiermee invalideren we de cache wanneer we de activiteiten willen muteren, zodat de site de ge-update lijst met activiteiten ophaalt. */
	const ActivityPatchMutator = useMutation({
		mutationFn: (activity: any) => BACKEND.activities({ id: activity.id }).patch(activity),
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

	useEffect(() => {
		if (compactActivitiesData) {
			setCompactActivities(compactActivitiesData);
		}
	}, [compactActivitiesData]);
	const [compactActivities, setCompactActivities] = useState<Treaty.Data<typeof BACKEND.activities.compact.get>>([]);


	if (isPending || slideshowPending || compactActivitiesPending || slotsPending) return <LoadingSpinner loading={true} text="GEGEVENS OPHALEN..." />;
	if (error || slideshowError || compactActivitiesError || slotsError) return <div className="bg-white p-5 rounded border font-medium">Server is onbereikbaar! Storing...</div>;

	return (
		<Provider value={{ activities, setActivities }}>
			<LoadingSpinner loading={ActivityInsertMutator.isPending || ActivityPatchMutator.isPending || ActivityDeleteMutator.isPending || SlideInsertMutator.isPending || SlideDeleteMutator.isPending || isPending} />
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
							<Icon icon="ion:arrow-back" width="24" height="24" />
							<span>Terug naar hoofdpagina</span>
						</button>
					</a>
				</Header>
				<div className="flex-1 overflow-auto px-2 pb-8">
					{currentView == "Activiteiten" && (
						<ActivitiesEditor
							searchQuery={searchQuery}
							setSearchQuery={search}
							compactActivities={compactActivities}
							slots={slots}
							ActivityInsertMutator={ActivityInsertMutator}
							ActivityPatchMutator={ActivityPatchMutator}
							ActivityDeleteMutator={ActivityDeleteMutator}
							SlotInsertMutator={SlotInsertMutator}
							SlotDeleteMutator={SlotDeleteMutator}
						/>
					)}
					{currentView == "Slideshow" && (
						<SlideshowEditor
							slides={slides}
							SlideInsertMutator={SlideInsertMutator}
							SlideDeleteMutator={SlideDeleteMutator}
						/>
					)}
				</div>
			</div>
		</Provider>
	)
}

function ActivitiesEditor(props: {
	searchQuery: string;
	setSearchQuery: (q: string) => void;
	compactActivities: Treaty.Data<typeof BACKEND.activities.compact.get>;
	slots: Treaty.Data<typeof BACKEND.slots.get>;
	ActivityInsertMutator: UseMutationResult<any, unknown, any, unknown>;
	ActivityPatchMutator: UseMutationResult<any, unknown, any, unknown>;
	ActivityDeleteMutator: UseMutationResult<any, unknown, any, unknown>;
	SlotInsertMutator: UseMutationResult<any, unknown, any, unknown>;
	SlotDeleteMutator: UseMutationResult<any, unknown, any, unknown>;
}) {
	const { activities } = useContext(Context)!;
	const {
		searchQuery,
		setSearchQuery,
		compactActivities,
		slots,
		ActivityInsertMutator,
		ActivityPatchMutator,
		ActivityDeleteMutator,
		SlotInsertMutator,
		SlotDeleteMutator
	} = props;

	const [activityEditing, setActivityEditing] = useState<typeof UpdateActivityRequestBody | null>(null);
	const [activityScheduling, setActivityScheduling] = useState<ActivityFull | null>(null);
	const [slotPlanning, setSlotPlanning] = useState(false);
	const [creatingActivity, setCreatingActivity] = useState(false);

	const filteredActivities = useMemo(
		() => compactActivities.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase())),
		[compactActivities, searchQuery]
	);

	const updateActivity = async (activiteit: typeof activityEditing) => {
		const updatedActivity = {
			id: activiteit?.id,
			title: activiteit?.title,
			subtitle: activiteit?.subtitle,
			description: activiteit?.description,
			price: activiteit?.price,
			capacity: activiteit?.capacity,
			threshold: activiteit?.threshold,
			minage: activiteit?.minage,
			location: activiteit?.location,
		};

		if (confirm(`Weet je zeker dat je activiteit "${activiteit?.title}" wilt aanpassen? Dit kan niet ongedaan worden gemaakt.`)) {
			ActivityPatchMutator.mutate(updatedActivity);
			setActivityEditing(null);
		}
	};

	return (
		<div>
			<nav className="sticky top-0">
				<Helper>
					<Icon icon="material-symbols:info-outline" width="32" height="32" className="mr-2" />
					<p>
						Hieronder vindt u een lijst met alle activiteiten. Met de knoppen kunt u ze aanpassen, verwijderen, of nieuwe aanmaken
					</p>
				</Helper>
			</nav>

			{creatingActivity ? (
				<>
					<button
						className="text-white inline-flex items-center hover:bg-orange-500 hover:ring-2 rounded cursor-pointer bg-orange-400 px-2 font-medium text-xl mb-3 py-1"
						onClick={() => setCreatingActivity(false)}
					>
						<Icon icon="mdi:cancel-bold" width="24" height="24" />
						<span>Annuleren</span>
					</button>
					<ActivityCreator
						onCancel={() => setCreatingActivity(false)}
						onCreate={async (parsedFormData) => {
							await ActivityInsertMutator.mutateAsync(parsedFormData, {
								onError: () => alert("FOUT: Activiteit met deze titel bestaal al!"),
								onSuccess: () => setCreatingActivity(false),
							});
						}}
					/>
				</>
			) : (
				<>
					<div className="flex items-center justify-between w-full gap-4">
						<button
							className="text-white inline-flex items-center hover:bg-green-700 hover:ring-2 rounded cursor-pointer bg-green-600 px-2 font-medium text-4xl mb-3 py-1"
							onClick={() => setCreatingActivity(true)}
						>
							<Icon icon="mdi:add-bold" width="24" height="24" />
							<span>Activiteit aanmaken</span>
						</button>

						<SearchBar
							onSubmit={(value) => setSearchQuery(value)}
						/>
					</div>

					<ActivitiesEmptyCheck activities={activities} />
					<ol>
						{filteredActivities.map((activiteit) => {
							console.trace(compactActivities);
							const isEditing = activityEditing && activityEditing.id === activiteit.id;
							const displayData = isEditing ? activityEditing : activiteit;

							return (
								<>
									<div className="mb-2 p-4 rounded bg-white shadow">
										<ActivityListItem
											activiteit={activiteit}
											displayData={displayData}
											isEditing={!!isEditing}
											activityEditing={activityEditing}
											setActivityEditing={setActivityEditing}
											activityScheduling={activityScheduling}
											setActivityScheduling={setActivityScheduling}
											slotPlanning={slotPlanning}
											setSlotPlanning={setSlotPlanning}
											slots={slots}
											updateActivity={updateActivity}
											ActivityDeleteMutator={ActivityDeleteMutator}
											SlotInsertMutator={SlotInsertMutator}
											SlotDeleteMutator={SlotDeleteMutator}
											compactActivities={compactActivities}
										/>
									</div>
								</>
							)
						})}
					</ol>
				</>
			)}
		</div>
	)
}

function ActivityCreator(props: {
	onCancel: () => void;
	onCreate: (data: {
		title: string;
		subtitle: string;
		description: string;
		type: string;
		price: number;
		capacity: number;
		threshold: number;
		minage: number;
		location: string;
		hero: File;
	}) => void | Promise<void>;
}) {
	async function insertActivity(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const form = event.currentTarget

		const parsedFormData = {
			// @ts-ignore
			title: String(form.elements["title"]?.value || ""),
			// @ts-ignore
			subtitle: String(form.elements["subtitle"]?.value || ""),
			// @ts-ignore
			description: String(form.elements["description"]?.value || ""),
			// @ts-ignore
			type: String(form.elements["type"]?.value || ""),
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
			await props.onCreate(parsedFormData);
		}
	}

	return (
		<form onSubmit={insertActivity}>
			<div className="grid md:grid-cols-2 md:gap-6">
				<div>
					<div className="mb-2">
						<label htmlFor="title">Titel</label>
						<input id="title" type="text" required placeholder="Bijv. 'Boogschieten'"
							className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500" />
					</div>
					<div className="mb-2">
						<label htmlFor="subtitle">Ondertitel</label>
						<input id="subtitle" type="text" required placeholder="Bijv. 'Leer boogschieten met onze instructeurs'"
							className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500" />
					</div>
					<div className="mb-2">
						<label htmlFor="description">Beschrijving</label>
						<textarea id="description" required placeholder="Bijv. 'In deze activiteit leer je boogschieten onder begeleiding van onze ervaren instructeurs...'"
							className="min-h-48 block w-full p-2.5 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500" />
					</div>
				</div>
				<ImageUpload />
			</div>
			<div className="mb-2">
				<label htmlFor="type">Type activiteit</label>
				<select id="type" className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500">
					<option value="sport/spel">Sport/Spel</option>
					<option value="educatief">Educatief</option>
					<option value="eten">Eten</option>
					<option value="overig">Overig</option>
				</select>

			</div>
			<div className="mb-2">
				<label htmlFor="minage">Minimumleeftijd</label>
				<select id="minage" className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500">
					<option value="al">Alle leeftijden</option>
					<option value="3+">Vanaf 3 jaar</option>
					<option value="7+">Vanaf 7 jaar</option>
					<option value="12+">Vanaf 12 jaar</option>
				</select>
			</div>
			<div className="mb-2">
				<label htmlFor="location">Locatie</label>
				<select id="location" className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500">
					<option value="gp">Grote Plein</option>
					<option value="ds">De Schuur</option>
					<option value="kb">Kleine Bos</option>
					<option value="hw">Het Weiland</option>
				</select>
			</div>
			<div className="mb-2">
				<label htmlFor="capacity">Capaciteit</label>
				<input id="capacity" type="number" required placeholder="Bijv. '20'"
					className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500" />
			</div>
			<div className="mb-2">
				<label htmlFor="threshold">Drempelbezetting</label>
				<input id="threshold" type="number" required placeholder="Bijv. '5'"
					className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500" />
			</div>
			<div className="mb-2">
				<label htmlFor="price">Prijs</label>
				<input id="price" type="number" required placeholder="'Bijv. '€4,50'"
					className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500" />
			</div>
			<button type="submit" className="text-white bg-green-600 hover:bg-green-700 mt-1 rounded cursor-pointer px-4 font-small text-xl hover:ring-2">
				Toevoegen
			</button>
		</form>
	)
}

function SearchBar(props: { onSubmit: (value: string) => void }) {
	const [value, setValue] = useState("");
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				props.onSubmit(value);
			}}
			className="mb-3">
			<label htmlFor="search" className="sr-only">Search</label>
			<div className="flex items-center gap-2">
				<div className="relative flex-1">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<Icon icon="icon-park-outline:search" width="20" height="20" />
					</div>
					<input
						type="search"
						id="search"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						className="bg-white border -full pl-10 pr-3 py-2.5 bg-neutral-secondary-medium text-heading text-sm rounded focus:ring-brand shadow-xs placeholder:text-body"
						placeholder="Zoek"
					/>
				</div>
				<button
					type="submit"
					className="bg-white border whitespace-nowrap px-4 py-2.5 text-black bg-brand hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium rounded text-sm focus:outline-none">
					Zoek
				</button>
			</div>
		</form>
	)
}

function ActivityListItem(props: {
	activiteit: ActivityCompact;
	displayData: any;
	isEditing: boolean;
	activityEditing: typeof UpdateActivityRequestBody | null;
	setActivityEditing: React.Dispatch<React.SetStateAction<typeof UpdateActivityRequestBody | null>>;
	activityScheduling: ActivityFull | null;
	setActivityScheduling: (a: ActivityFull | null) => void;
	slotPlanning: boolean;
	setSlotPlanning: (v: boolean) => void;
	slots: Slot[];
	updateActivity: (a: typeof UpdateActivityRequestBody | null) => Promise<void>;
	ActivityDeleteMutator: UseMutationResult<any, unknown, any, unknown>;
	SlotInsertMutator: UseMutationResult<any, unknown, any, unknown>;
	SlotDeleteMutator: UseMutationResult<any, unknown, any, unknown>;
	compactActivities: Treaty.Data<typeof BACKEND.activities.compact.get>;
}) {
	const {
		activiteit,
		displayData,
		isEditing,
		activityEditing,
		setActivityEditing,
		activityScheduling,
		setActivityScheduling,
		slotPlanning,
		setSlotPlanning,
		slots,
		updateActivity,
		ActivityDeleteMutator,
		SlotInsertMutator,
		SlotDeleteMutator,
		compactActivities
	} = props;

	// Scheduling view
	if (activityScheduling && activityScheduling.id == activiteit.id) {
		return (
			<>
				<div className="flex-1">
					<div className="min-h-50">
						{slotPlanning ? (
							<>
								<form onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
									event.preventDefault();
									const form = event.currentTarget

									const parsedFormData = {
										// @ts-ignore
										duration: String(form.elements["slotDuration"]?.value || ""),
										// @ts-ignore
										date: String(form.elements["slotDate"]?.value || ""),
										// @ts-ignore
										activityId: activiteit.id,
									};
									dayjs.extend(customParseFormat);

									if (dayjs(`${parsedFormData.date}`, 'YYYY-MM-DDTHH:mm', true).isBefore(dayjs())) {
										return alert("Kan niet. Wij leven niet in het verleden!")
									}

									SlotInsertMutator.mutate(parsedFormData);
								}}>
									<div>
										<label className="ml-10 text-2xl" htmlFor="slotDate">Datum + begintijd</label>
										<input className="ml-10 text-2xl block p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" required id="slotDate" type="datetime-local"></input>
									</div>
									<div>
										<label className="ml-10 text-2xl" htmlFor="slotDuration">Tijdsduur activiteit (in uren)</label>
										<input className="ml-10 text-2xl block p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" required id="slotDuration" type="number"></input>
									</div>
									<div className="flex">
										<button
											className="text-white ml-10 flex mt-3 mr-3 bg-orange-400 hover:bg-orange-500 rounded cursor-pointer py-5 px-5 text-2xl "
											onClick={() => {
												setActivityScheduling(null);
												setSlotPlanning(false);
											}}>
											{slotPlanning ? "Annuleren" : "Sluiten"}
										</button>
										<button className="text-white mr-10 text-2xl rounded mt-3 bg-green-600 hover:bg-green-700 px-5 py-5" type="submit">Voeg tijdslot toe</button>

									</div>
								</form>
							</>
						) : (
							<>
								<div className="flex-col text-3xl font-bold mb-1 ml-3 bg-gray-200">
									<b>{activiteit.title}</b>
								</div>
								<table className="table-fixed text-left w-full text-2xl ml-3">
									<thead className="bg-gray-100">
										<tr>
											<th>Datum en begintijd</th>
											<th>Duur</th>
										</tr>
									</thead>
									<tbody className="overflow-y-auto">
										{slots
											.filter((slot) => (slot.activityId == activiteit.id))
											.map((slot) => {
												return (
													<>
														<tr key={slot.id}>
															<td className="flex flex-row items-center mb-1">

																{dayjs(slot.date).locale("nl").format("D[ ]MMMM[ om ]HH:mm")}
															</td>
															<td>{slot.duration} u</td>
															<button
																className="size-8 cursor-pointer border-2 border-blue-500 flex flex-row justify-center items-center hover:border-3 hover:border-red-400 mr-2"
																onClick={(e) => {
																	e.stopPropagation();
																	if (confirm(`Weet je zeker dat je dit tijdslot wilt verwijderen?`)) {
																		SlotDeleteMutator.mutate(slot);
																	}
																}}
															>
																<Icon icon="line-md:trash" width="32" height="32" color="black" />
															</button>
														</tr>
													</>
												)
											})}
										<tr
											className="hover:ring-2 hover:ring-red-400 hover:cursor-pointer hover:font-bold"
											onClick={() => setSlotPlanning(true)}
										>
											<td className="text-blue-700">Toevoegen</td>
										</tr>
									</tbody>
								</table>
							</>
						)}
					</div>
				</div>


			</>
		)
	}

	// Editing view
	if (isEditing && activityEditing && activityEditing.id == activiteit.id) {
		return (
			<>
				<li key={activiteit.id} className="flex">
					<span className="text-gray-700 text-lg font-medium mr-4 font-mono">{activiteit.id}</span>
					<div className="flex-1 mb-1">
						<div className="flex-1 mb-1">
							<div className="mb-2">
								<label htmlFor="title">Titel</label>
								<input
									id="title"
									type="text"
									value={displayData.title}
									onChange={(e) => {
										props.setActivityEditing(prev => ({ ...prev!, title: e.target.value }));
									}}
									className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							<div className="mb-2">
								<label htmlFor="description">Beschrijving</label>
								<textarea
									id="description"
									value={displayData.description}
									onChange={(e) => {
										props.setActivityEditing(prev => ({ ...prev!, description: e.target.value }));
									}}
									required
									placeholder="Bijv. 'In deze activiteit leer je boogschieten onder begeleiding van onze ervaren instructeurs...'"
									className="min-h-48 block w-full p-2.5 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500" />
							</div>
							<div className="mb-2">
								<label htmlFor="subtitle">Ondertitel</label>
								<input
									id="subtitle"
									type="text"
									value={displayData.subtitle}
									onChange={(e) => {
										props.setActivityEditing(prev => ({ ...prev!, subtitle: e.target.value }));
									}}
									className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							<div className="mb-2">
								<label htmlFor="type">Type activiteit</label>
								<select
									id="type"
									value={displayData.type}
									onChange={(e) => {
										props.setActivityEditing(prev => ({ ...prev!, type: e.target.value }));
									}}
									className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="sport/spel">Sport/Spel</option>
									<option value="educatief">Educatief</option>
									<option value="eten">Eten</option>
									<option value="overig">Overig</option>
								</select>
							</div>
							<div className="mb-2">
								<label htmlFor="minage">Leeftijd</label>
								<select
									id="minage"
									value={displayData.minage}
									onChange={(e) => {
										props.setActivityEditing(prev => ({ ...prev!, minage: e.target.value }));
									}}
									className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="0">Alle leeftijden</option>
									<option value="3">Vanaf 3 jaar oud</option>
									<option value="7">Vanaf 7 jaar oud</option>
									<option value="12">Vanaf 12 jaar oud</option>
								</select>
							</div>
							<div className="mb-2">
								<label htmlFor="location">Locatie</label>
								<select
									id="location"
									value={displayData.location}
									onChange={(e) => {
										props.setActivityEditing(prev => ({ ...prev!, location: e.target.value }));
									}}
									className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="gp">Grote Plein</option>
									<option value="ds">De Schuur</option>
									<option value="kb">Kleine Bos</option>
									<option value="hw">Het Weiland</option>
								</select>
							</div>
							<div className="mb-2">
								<label htmlFor="capacity">Capaciteit</label>
								<input
									id="capacity"
									type="number"
									value={displayData.capacity}
									onChange={(e) => {
										props.setActivityEditing(prev => ({ ...prev!, capacity: e.target.value }));
									}}
									className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							<div className="mb-2">
								<label htmlFor="threshold">Drempelwaarde</label>
								<input
									id="threshold"
									type="number"
									value={displayData.threshold}
									onChange={(e) => {
										props.setActivityEditing(prev => ({ ...prev!, threshold: e.target.value }));
									}}
									className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							<div className="mb-2">
								<label htmlFor="price">Prijs</label>
								<input
									id="price"
									type="number"
									value={displayData.price}
									onChange={(e) => {
										props.setActivityEditing(prev => ({ ...prev!, price: e.target.value }));
									}}
									className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						</div>
					</div>
				</li>
				<button
					className="text-white bg-green-500 hover:bg-green-600 ml-10 rounded cursor-pointer px-4 py-4 font-small text-2xl hover:ring-2"
					onClick={async () => {
						// @ts-ignore
						await updateActivity(activityEditing);
					}}>
					Opslaan
				</button>
				<button
					className="text-white bg-orange-500 hover:bg-orange-600 ml-4 rounded cursor-pointer px-4 py-4 font-small text-2xl hover:ring-2"
					onClick={() => {
						props.setActivityEditing(null);
					}}>
					Annuleren
				</button>
			</>
		)
	}

	// Readonly view
	return (
		<>
			<li key={activiteit.id} className="flex">
				<span className="text-gray-700 text-lg font-medium mr-4 font-mono">{activiteit.id}</span>
				<div className="flex-1 mb-1">
					<h3 className="text-4xl font-medium text-gray-800">{activiteit?.title}</h3>
					<p className="text-2xl text-gray-600 mb-1">{activiteit?.subtitle}</p>
					<p className="text-xl text-gray-700">Capaciteit: {activiteit.capacity}</p>
					<p className="text-xl text-gray-700">Drempelwaarde: {activiteit.threshold}</p>
					<p className="text-xl text-gray-700">Prijs: €{activiteit.price}</p>
					<p className="text-xl text-gray-700">Leeftijd: {activiteit.minage}</p>
					<p className="text-xl text-gray-700">Locatie: {activiteit?.location}</p>
				</div>
				<img
					className="max-h-70 right-0 max-w-[50%] object-cover rounded-xl ml-auto"
					src={`data:image/png;base64, ${activiteit?.hero}`}
					style={{ imageRendering: "pixelated" }}
					alt={activiteit?.title ?? "activity image"}
				/>
			</li>
			<button
				className="text-white bg-green-600 h-20 w-50 hover:bg-green-700 ml-10  rounded cursor-pointer px-4 font-small text-4xl hover:ring-2"
				onClick={() => { // @ts-ignore
					props.setActivityEditing(activiteit)
				}}>
				Bewerken
			</button>
			<button
				className="text-white bg-green-600 h-20 w-50 hover:bg-green-700 ml-4  rounded cursor-pointer px-4 font-small text-4xl hover:ring-2"
				onClick={() => { props.setActivityScheduling(activiteit as unknown as ActivityFull) }}>
				Plannen
			</button>
			<button
				className="text-white bg-red-600 h-20 w-50 hover:bg-red-700 ml-4  rounded cursor-pointer px-4 font-small text-4xl hover:ring-2"
				onClick={async () => {
					if (confirm(`Weet je zeker dat je activiteit "${activiteit.title}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) {
						props.ActivityDeleteMutator.mutate(activiteit);
						props.compactActivities.splice(props.compactActivities.findIndex(a => a.id === activiteit.id), 1);
					}
				}}>
				Verwijderen
			</button>
		</>
	)
}

function SlideshowEditor(props: {
	slides: Treaty.Data<typeof BACKEND.slideshow.get>;
	SlideInsertMutator: UseMutationResult<any, unknown, any, unknown>;
	SlideDeleteMutator: UseMutationResult<any, unknown, any, unknown>;
}) {
	const { slides, SlideInsertMutator, SlideDeleteMutator } = props;
	const [creatingSlide, setCreatingSlide] = useState(false);

	return (
		<>
			<Helper>
				<Icon icon="material-symbols:info-outline" width="32" height="32" />
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
					<SlideCreator
						onCreate={async (data) => {
							await SlideInsertMutator.mutateAsync(data, {
								onError: () => alert("FOUT: Een slide met dit plaatje bestaat al!"),
								onSuccess: () => setCreatingSlide(false),
							});
						}}
					/>
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

function SlideCreator(props: {
	onCreate: (data: { image: File; alt: string }) => void | Promise<void>;
}) {
	async function insertSlide(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const form = event.currentTarget

		const parsedFormData = {
			image: (form.elements.namedItem("image") as HTMLInputElement)?.files?.[0] as File,
			alt: String((form.elements.namedItem("alt") as HTMLInputElement)?.value || ""),
		};

		if (confirm(`Weet je zeker dat je deze slide wilt toevoegen?`)) {
			await props.onCreate(parsedFormData);
		}
	}

	return (
		<form onSubmit={insertSlide}>
			<ImageUpload fieldName="image" />
			<div className="mb-2">
				<label htmlFor="alt">Alt-tekst (beschrijving van de afbeelding)</label>
				<input id="alt" type="text" required placeholder="Bijv. 'Kinderen die boogschieten op het veld'"
					className="block w-full p-2 text-gray-900 border border-gray-500 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500" />
			</div>
			<button type="submit" className="bg-green-700 hover:underline rounded cursor-pointer px-4 font-small text-xl hover:ring-2 font-bold mt-1">
				Toevoegen
			</button>
		</form>
	)
}

function ActivitiesEmptyCheck(props: { activities: Treaty.Data<typeof BACKEND.activities.get> }) {
	const { activities } = props;

	return (
		<>
			{(() => {
				if (activities.length == 0) {
					return (
						<div className="h-[40vh] w-full flex items-center justify-center text-3xl font-bold select-none cursor-not-allowed hover:border-red-500">
							Er zijn nog geen activiteiten. Maak er een aan met de knop bovenaan!
						</div>
					)
				}
			})()}
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
			<div className="w-full min-w-[40%] h-full min-h-[10em]">
				<div className={`text-black bg-gray-200/80 w-full justify-center  ${!image && "hover:outline-5 hover:outline-red-300 hover:font-bold"} h-full`}>
					{image && <img src={image} alt="Preview" className="object-fill" />}
					<input id={fieldName} className={`w-full pb-0 hover:cursor-pointer hover:outline-red-300 hover:font-bold ${image && "border-t-2"} ${!image && "h-full"}`} type="file" accept="image/*" required onChange={(e) => {
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
			<div className="absolute inset-0 bg-black/20 backdrop-grayscale" /> {/*De achtergrond.*/}
			<div className="bg-white p-4 rounded-xl aspect-3/2 flex flex-col justify-center z-10">
				<Icon icon="line-md:loading-alt-loop" className="mx-auto" width="128" height="128" style={{ color: "blue" }} />
				<p className="text-black text-center text-3xl font-bold">{props.text || "ACTIE VERWERKEN..."}</p>
			</div>
		</div>
	)
}