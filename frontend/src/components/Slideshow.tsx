import {useQuery} from "@tanstack/react-query";
// import {useContext} from "react";
// import FormContext from "./FormContext.tsx";

export function Slideshow() {
	// const { next } = useContext(FormContext); // <- Hiermee haal je context op.

	const { isPending, error, data } = useQuery({
		queryKey: ['news'],
		queryFn: () => { /*Haal hier nieuws op van de backend*/ return "In deze stap komt de slideshow!!!" },
	})

	if (isPending) return 'Laden...'

	if (error) return 'Fout: ' + error.message

	return (
		<>
			<p>{data}</p>
		</>
	)
}