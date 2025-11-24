import {Component, type PropsWithChildren} from "react";

export class Header extends Component<PropsWithChildren> {
	render(){
		return (
			<p className="mb-2 relative">
				{this.props.children}
				{/*<hr className="h-[2px] w-[110%] absolute left-1/2 -translate-x-1/2 border-0 rounded-sm bg-black top-full" />*/}
				<hr className="-mx-2 w-[calc(100%+1rem)] border-0 z-100 h-[2px] bg-black" />
			</p>
		)
	}
}