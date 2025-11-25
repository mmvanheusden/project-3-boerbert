import { Header } from "../KleineDingetjes";

export default function AdminPanel() {
	return (
		<>
			<Header>
				<span className="hover:underline hover:ring-2 select-none rounded-t-lg border-1 bg-red-800 px-4 font-medium text-2xl">
						Beheerderspaneel
				<span className="select-none rounded-t-lg border-1 bg-red-800 px-4 font-medium text-2xl">
				</span>
				<a href="/">
					<button
						className="hover:underline ml-4 hover:ring-2 rounded border-1 cursor-pointer bg-green-200 px-2 font-medium text-2xl -translate-y-1">
						<span>
							Hoofdpagina
						</span>

					</button>
				</a>
			</Header>
			Hier komt het beheerderspaneel :O
		</>
	)
}