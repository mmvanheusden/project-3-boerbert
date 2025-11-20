import './App.css'
import { treaty } from '@elysiajs/eden'
import type {ElysiaApp} from "../../backend/src"
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from '@tanstack/react-query'

// @ts-ignore
const api = treaty<ElysiaApp>("localhost:3000")

const queryClient = new QueryClient()

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Ping />
		</QueryClientProvider>
	)
}

function Ping() {
	const { isPending, error, data } = useQuery({
		queryKey: ['ping'],
		queryFn: () =>
			api.ping.get().then(r => r.data),
	})

	if (isPending) return 'Laden...'

	if (error) return 'Fout: ' + error.message

	return (
		<div>
			<h1>Backend zegt {data}</h1>
		</div>
	)
}

