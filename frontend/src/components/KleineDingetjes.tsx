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
				<div className="mb-2 relative">
					{this.props.children}
					<hr className="-mx-2 w-[calc(100%+1rem)]  z-100 h-0.5 bg-white translate-y-0.5"/>
				</div>

			</>
		)
	}
}


export function BookingDetails() {
	const context = useContext(Context);
	return(
		<>
			<p><b>Activiteit: </b> {context.selectedActivity?.title[i18n.language as "en" | "de" | "nl"]} @ {context.selectedActivity?.location[i18n.language as "en" | "de" | "nl"]}</p>
			<p><b>Tijdslot: </b> {dayjs(context.selectedSlot!.date).locale("nl").format("dddd D[ ]MMMM[ om ]HH:mm")} voor {context.selectedAmount} personen</p>
			<p><b>Totaalprijs: </b> € {context.selectedPrice}</p>
		</>
	)
}