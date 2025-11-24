/**
 * Hier defineren we de context, daarin staat gedeelde "context" die relevant is voor elke stap in het boekingsproces.
 * Elk component kan de context benaderen.
 * **/
import { createContext } from "react";
import {BACKEND} from "../App.tsx";
import type {Treaty} from "@elysiajs/eden";

// https://react.dev/learn/passing-data-deeply-with-context

// De structuur die de context aanhoudt.
type FormContextType = {
	currentStep: number;
	setCurrentStep: (step: number) => void;
	next: () => void;
	prev: () => void;
	availableActivities?: Treaty.Data<typeof BACKEND.activities.get>;
};


export const FormContext = createContext<FormContextType>({
	currentStep: undefined!,
	setCurrentStep: () => {},
	next: () => {},
	prev: () => {},
	availableActivities: undefined!,
});


export default FormContext;

export const { Provider, Consumer } = FormContext;
