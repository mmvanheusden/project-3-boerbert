import {useContext, useState} from "react";
import Context, { Provider } from "./Context.tsx";
import {Slideshow} from "../Slideshow.tsx";
import {ActivitiesList} from "./ActivitiesList.tsx";
import {BACKEND} from "../../App.tsx";
import {useQuery} from "@tanstack/react-query";
import type {Treaty} from "@elysiajs/eden";
import { ViewActivity } from "./ViewActivity.tsx";
import { t } from "i18next";

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
					case 2:
						return <ViewActivity/>
					default:
						return null;
				}})()}

			</div>
		</>
	)
};

const BookingFlow = () => {
	const STEPS = 3; // Hoeveel stappen we hebben
	const [currentStep, setCurrentStep] = useState(0); // Dit is de huidige stap als opgeslagen in het manager-component. Deze wordt synchroon gehouden met de context.
	const [selectedActivity, selectActivity] = useState<Treaty.Data<typeof BACKEND.activities.get>[0] | null>(null); // Dit is de huidige stap als opgeslagen in het manager-component. Deze wordt synchroon gehouden met de context.

	// Haal de activiteiten alvast op (en stop in de gedeelde context). Scheelt laadtijd later.
	const {isPending, error, data} = useQuery<Treaty.Data<typeof BACKEND.activities.get>>({
		queryKey: ['activities'],
		queryFn: () =>
			BACKEND.activities.get().then(r => r.data as Treaty.Data<typeof BACKEND.activities.get>),
	})
	if (isPending) return 'Laden...'
	if (error) return 'Fout: ' + error.message


	const next = () => {
		if (currentStep === STEPS-1) {
			// Naar volgende stap bij laatste stap -> terug naar stap 0
			setCurrentStep(0);
			return;
		} else setCurrentStep(currentStep + 1);
	};
	const prev = () => {
		if (currentStep == 0) {
			return
		}
		setCurrentStep(currentStep - 1)
	};

	return (
		<Provider value={{ currentStep, setCurrentStep, next, prev, activities: data ?? [], selectedActivity, selectActivity }}>
			<div className="bg-white/90 border-2 border-black p-4 rounded-3xl">
				<main>{renderStep(currentStep)}</main> {/* <---- Hier staat de stap content.*/}
			</div>
		</Provider>
	);
};
export default BookingFlow;

export function CancelButton() {
	const { setCurrentStep } = useContext(Context);

	return (
		<button className="inline-flex items-center border-2 hover:underline hover:cursor-pointer rounded py-3 px-5 border-black bg-red-500  hover:bg-red-700 focus:outline-none text-2xl" onClick={() => setCurrentStep(0)}>
			{t("cancel")}
		</button>
	)
}
