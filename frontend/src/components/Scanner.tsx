import {useQuery} from "@tanstack/react-query";
// import {useContext} from "react";
// import FormContext from "./FormContext.tsx";

export function Scanner() {
	// const { next } = useContext(FormContext); // <- Hiermee haal je context op.

	const { isPending, error, data } = useQuery({
		queryKey: ['scanner'],
		queryFn: () => { /*Haal iets op van de backend ofzo*/ return "In deze stap laat ie de activiteiten zien!!!" },
	})

	if (isPending) return 'Laden...'

	if (error) return 'Fout: ' + error.message

	return (
		<>
			<p>{data}</p>
		</>
	)
}