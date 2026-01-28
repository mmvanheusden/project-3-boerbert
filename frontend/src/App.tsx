import { treaty } from '@elysiajs/eden'
import type { ElysiaApp } from "../../backend/src"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BookingFlow from "./components/booking/BookingFlowManager.tsx";
import { ConnectivityCheck } from "./components/ConnectivityCheck.tsx";
import Router, { Route, Switch } from "crossroad";
import AdminPanel from "./components/admin/AdminPanel.tsx";
import { Component, type PropsWithChildren, useRef } from "react";

// @ts-ignore
export const BACKEND = treaty<ElysiaApp>(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000")

export const queryClient = new QueryClient()

export function App() {
	return (
		<Router>
			<QueryClientProvider client={queryClient}>
				<main className={`h-full`}>
					<Switch redirect="/">
						<Route path="/" component={BookingFlow} />
						<Route path="/admin" component={AdminPanel} />
					</Switch>
				</main>
			</QueryClientProvider>
		</Router>
	)
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
