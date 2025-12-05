import {Component, type PropsWithChildren} from "react";

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
					{/*<hr className="h-[2px] w-[110%] absolute left-1/2 -translate-x-1/2 border-0 rounded-sm bg-black top-full" />*/}
					<hr className="-mx-2 w-[calc(100%+1rem)] border-1 z-100 h-[2px] bg-white translate-y-0.5"/>
				</div>

			</>
		)
	}
}