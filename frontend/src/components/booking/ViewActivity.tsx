import "../../index.css";
import {BACKEND} from "../../App.tsx";
import {useContext, useState} from "react";
import {Icon} from '@iconify/react';
import type {Treaty} from "@elysiajs/eden";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";


interface DetailsModalProps {
	onClose: () => void,
}


export function ViewActivity() {
	const [showModal, setModal] = useState(false);
	const [modalActivity, setModalActivity] = useState<Treaty.Data<typeof BACKEND.activities.get>[0]>(); // Hierin staat welke activiteit er weergegeven zou moeten worden voor de modal.
	const context = useContext(Context);

	return (
		<>
			<Header>
					<span
						className="select-none rounded-t-lg border-2 border-white bg-green-600 px-4 mb-1 font-semibold text-3xl">
						Stap 2: Kies een activiteit
					</span>
			</Header>
			hllo
		</>

	);

}