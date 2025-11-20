import {useQuery} from "@tanstack/react-query";
import {BACKEND} from "../App.tsx";

export function Ping() {
	const { isPending, error, data } = useQuery({
		queryKey: ['ping'],
		queryFn: () =>
			BACKEND.ping.get().then(r => r.data),
	})

	if (isPending) return 'Laden...'

	if (error) return 'Fout: ' + error.message

	return (
		<>
			<h1>Backend zegt {data}</h1>
		</>
	)
}