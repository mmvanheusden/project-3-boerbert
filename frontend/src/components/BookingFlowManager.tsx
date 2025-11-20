import { useState } from "react";
import { Provider } from "./FormContext";
import {Slideshow} from "./Slideshow.tsx";
import {Scanner} from "./Scanner.tsx";

// Bron: https://codesandbox.io/p/sandbox/react-multi-step-form-dyujr?file=%2Fsrc%2FMultiStepForm%2FMultiStepForm.jsx%3A16%2C30

const renderStep = (step: number) => {
	switch (step) {
		case 0:
			return <Slideshow/>;
		case 1:
			return <Scanner/>;
		default:
			return null;
	}
};

const BookingFlow = () => {
	const [currentStep, setCurrentStep] = useState(0); // Dit is de huidige stap als opgeslagen in het manager-component. Deze wordt synchroon gehouden met de context.
	const next = () => {
		if (currentStep === 1) {
			// Stap 1 naar 2 -> reset naar stap 0
			setCurrentStep(0);
			return;
		} else setCurrentStep(currentStep + 1);
	};
	const prev = () => setCurrentStep(currentStep - 1);

	return (
		<Provider value={{ currentStep, setCurrentStep, next, prev }}>
			<h1 className="content-center">Stap: {currentStep}</h1>
			<main>{renderStep(currentStep)}</main>
			<a>
				<button className="border-2 rounded py-3 px-2.5 border-red-400" onClick={() => next()}>
					Volgende stap
				</button>
			</a>
		</Provider>
	);
};
export default BookingFlow;
