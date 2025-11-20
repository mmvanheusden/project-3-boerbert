/**
 * Hier defineren we de context, daarin staat gedeelde "context" die relevant is voor elke stap in het boekingsproces.
 * Elk component kan de context benaderen.
 * **/
import { createContext } from "react";

// https://react.dev/learn/passing-data-deeply-with-context

// De structuur die de context aanhoudt.
type FormContextType = {
	currentStep: number;
	setCurrentStep: (step: number) => void;
	next: () => void;
	prev: () => void;
};


export const FormContext = createContext<FormContextType>({
	currentStep: undefined!,
	setCurrentStep: () => {},
	next: () => {},
	prev: () => {},
});


export default FormContext;

export const { Provider, Consumer } = FormContext;
