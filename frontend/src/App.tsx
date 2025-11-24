import {treaty} from '@elysiajs/eden'
import type {ElysiaApp} from "../../backend/src"
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import BookingFlow from "./components/booking/BookingFlowManager.tsx";
import {ConnectivityCheck} from "./components/ConnectivityCheck.tsx";
import Router, {Route, Switch} from "crossroad";
import AdminPanel from "./components/admin/AdminPanel.tsx";

// @ts-ignore
export const BACKEND = treaty<ElysiaApp>("localhost:3000")

const queryClient = new QueryClient()

export function App() {
	return (
		<Router>
			<QueryClientProvider client={queryClient}>
				<Switch redirect="/">
					<Route path="/" component={BookingFlow} />
					<Route path="/admin" component={AdminPanel} />
				</Switch>
			</QueryClientProvider>
		</Router>
	)
}


export function Footer() {
	return (
		<Router>
			<QueryClientProvider client={queryClient}>
				<footer className="bg-gray-400 fixed bottom-0 left-0 z-20 w-full p-4 bg-neutral-primary-soft border-t border-default shadow-sm md:flex md:items-center md:justify-between md:p-6">
					<span className="text-sm text-body sm:text-center">
						2025 Squad Skyr™
					</span>
					<ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-body sm:mt-0">
						<li className="me-4 md:me-6">
							<ConnectivityCheck/>
						</li>
						<nav>
							<a href="/admin">
								<button className="hover:underline ml-2 rounded border-1 cursor-pointer bg-blue-500 px-4 font-medium text-2xl">
									Beheerderspaneel
								</button>
							</a>
						</nav>
					</ul>
				</footer>
			</QueryClientProvider>
		</Router>
	)
}
