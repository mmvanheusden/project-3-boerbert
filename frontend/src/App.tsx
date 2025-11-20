import {treaty} from '@elysiajs/eden'
import type {ElysiaApp} from "../../backend/src"
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import BookingFlow from "./components/BookingFlowManager.tsx";
import {Ping} from "./components/Connectivity.tsx";

// @ts-ignore
export const BACKEND = treaty<ElysiaApp>("localhost:3000")

const queryClient = new QueryClient()

export default function App() {
	return (
		<div>
			<QueryClientProvider client={queryClient}>
				<Ping/>
				<BookingFlow/>
			</QueryClientProvider>
		</div>
	)
}
