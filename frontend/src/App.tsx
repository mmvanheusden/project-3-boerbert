import { treaty } from '@elysiajs/eden'
import type { ElysiaApp } from "../../backend/src"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BookingFlow from "./components/booking/BookingFlowManager.tsx";
import { ConnectivityCheck } from "./components/ConnectivityCheck.tsx";
import Router, { Route, Switch } from "crossroad";
import AdminPanel from "./components/admin/AdminPanel.tsx";
import { Component, type PropsWithChildren, useRef } from "react";

// @ts-ignore
export const BACKEND = treaty<ElysiaApp>("http://localhost:3000")

export const queryClient = new QueryClient()

export function App() {
	return (
		<Router>
			<QueryClientProvider client={queryClient}>
				<main className="pb-20 h-full">
					<Switch redirect="/">
						<Route path="/" component={BookingFlow} />
						<Route path="/admin" component={AdminPanel} />
					</Switch>
				</main>
			</QueryClientProvider>
		</Router>
	)
}


export class Footer extends Component<PropsWithChildren> {
	render() {
		return (
			<Router>
				<QueryClientProvider client={queryClient}>
					<div className="bg-white fixed bottom-0 left-0 z-20 w-full p-4 bg-neutral-primary-soft border-t border-default shadow-sm md:flex md:items-center md:justify-between md:p-6">
						<span className="text-sm text-body sm:text-center">
							2025 Squad Skyr™
						</span>
						<span className="flex flex-wrap items-center mt-3 text-sm font-medium text-body sm:mt-0">
							{process.env.NODE_ENV !== "production" &&
								<>
									<div className="me-4 md:me-6">
										<ConnectivityCheck/>
									</div>
									<nav>
										<a href="/admin">
											<button className="hover:underline ml-2 rounded cursor-pointer bg-green-500 px-4 font-medium text-2xl hover:ring-2">
												Beheerderspaneel
											</button>
										</a>
									</nav>
								</>
							}
						</span>
					</div>
				</QueryClientProvider>
			</Router>
		)
	}
}

// Source - https://stackoverflow.com/a/79257253
// Posted by Maksim I. Kuzmin
// Retrieved 2026-01-06, License - CC BY-SA 4.0
export default function useFirstRender(callback: () => void) {
	const ref = useRef(true);

	if (ref.current) {
		callback();
	}

	ref.current = false;
}
