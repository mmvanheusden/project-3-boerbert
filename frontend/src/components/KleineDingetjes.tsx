import {Component, type PropsWithChildren, useContext} from "react";
import Context from "./booking/Context.tsx";
import dayjs from "dayjs";
import i18n from "i18next";

// Source - https://stackoverflow.com/a/77764153
// Posted by Victor Zamanian, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-03, License - CC BY-SA 4.0

export function omit<T extends Record<string, any>, K extends keyof T>(
	obj: T,
	...keys: K[]
): Omit<T, K> {
	// I'm sure this could be done in a better way,
	// but if we don't do this we run into issues with
	// the interaction between Object.entries() and
	// Set<string | number | symbol>.
	const omitKeys = new Set(keys as string[]);

	return Object.fromEntries(
		Object.entries(obj).filter(([k]) => !omitKeys.has(k)),
	) as Omit<T, K>;
}

export class Header extends Component<PropsWithChildren> {
	render(){
		return (
			<>
				<div className="mb-2 relative w-full flex items-center justify-center bg-green-600 rounded-t-3xl py-4 px-8">
					{this.props.children}
				</div>

			</>
		)
	}
}


export function BookingDetails() {
	const context = useContext(Context);
	return(
		<>
		<div className="text-5xl flex flex-col gap-3 my-10">
			<p><b>Activiteit: </b> {context.selectedActivity?.title[i18n.language as "en" | "de" | "nl"]}</p>
			<p><b>Datum en tijd: </b> {dayjs(context.selectedSlot!.date).locale("nl").format("dddd D[ ]MMMM[ om ]HH:mm")}</p>
			<p><b>Locatie: </b>{context.selectedActivity?.location[i18n.language as "en" | "de" | "nl"]}</p>
			<p><b>Leeftijd: </b>{context.selectedActivity?.minage}</p>
			<p><b>Aantal personen: </b> {context.selectedAmount}</p>
			<p><b>Totaalprijs: </b> € {context.selectedPrice}</p>
		</div>
		</>
	)
}