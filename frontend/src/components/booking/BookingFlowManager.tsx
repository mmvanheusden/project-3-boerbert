import { useState } from "react";
import { Provider } from "./Context.tsx";
import {Slideshow} from "../Slideshow.tsx";
import {ActivitiesList} from "./ActivitiesList.tsx";
import {BACKEND} from "../../App.tsx";
import {useQuery} from "@tanstack/react-query";
import type {Treaty} from "@elysiajs/eden";

// Bron: https://codesandbox.io/p/sandbox/react-multi-step-form-dyujr?file=%2Fsrc%2FMultiStepForm%2FMultiStepForm.jsx%3A16%2C30

const renderStep = (step: number) => {
	return (
		<>
			<div>
				{(() => {switch (step) {
					case 0:
						return <Slideshow/>;
					case 1:
						return <ActivitiesList/>;
					default:
						return null;
				}})()}

			</div>
		</>
	)

};

const BookingFlow = () => {
	const [currentStep, setCurrentStep] = useState(0); // Dit is de huidige stap als opgeslagen in het manager-component. Deze wordt synchroon gehouden met de context.
	// Haal de activiteiten alvast op (en stop in de gedeelde context). Scheelt laadtijd later.
	const {isPending, error, data} = useQuery<Treaty.Data<typeof BACKEND.activities.get>>({
		queryKey: ['activities'],
		queryFn: () =>
			BACKEND.activities.get().then(r => r.data as Treaty.Data<typeof BACKEND.activities.get>),
	})
	if (isPending) return 'Laden...'
	if (error) return 'Fout: ' + error.message


	const next = () => {
		if (currentStep === 1) {
			// Stap 1 naar 2 -> reset naar stap 0
			setCurrentStep(0);
			return;
		} else setCurrentStep(currentStep + 1);
	};
	const prev = () => setCurrentStep(currentStep - 1);

	return (
		<Provider value={{ currentStep, setCurrentStep, next, prev, availableActivities: data ?? [] }}>
			<main>{renderStep(currentStep)}</main> {/* <---- Hier staat de stap content.*/}
			<a>
				<button className="border-2 hover:underline hover:cursor-pointer rounded py-3 px-2.5 border-red-400" onClick={() => next()}>
					Volgende stap
				</button>
			</a>
		</Provider>
	);
};
export default BookingFlow;
